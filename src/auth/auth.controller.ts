import { Request, Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';


export class LoginDto { 
    @ApiProperty()
    username: string;
  
    @ApiProperty()
    password: string;
}

@ApiTags('Auth') // Add Swagger tag
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiBody({ type: LoginDto, description: 'Login app' })
  register(@Body() dto: LoginDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto, description: 'Login app' })
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }


//   TODO: move to users/me/profile path
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    const user = await this.authService.profile(req.user.sub);
    
    return user
  }
}