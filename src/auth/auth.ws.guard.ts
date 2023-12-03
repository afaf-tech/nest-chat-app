// auth.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WSAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client.handshake.headers);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // You can attach the payload to the client for later use
      client['user'] = payload;
    } catch {
      throw new WsException('Unauthorized');
    }

    return true;
  }

  private extractTokenFromHeader(headers: Record<string, string>): string | undefined {
    const authorizationHeader = headers['authorization'];
    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
