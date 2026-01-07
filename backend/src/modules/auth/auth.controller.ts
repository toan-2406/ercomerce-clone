import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.register(registerDto);
    this.setCookie(res, data.access_token);
    return data.user;
  }

  @Post('login')
  async login(
    @Body() loginDto: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = (await this.authService.login(loginDto)) as any;
    this.setCookie(res, data.access_token);
    return data.user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  private setCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // or 'none' if cross-site but 'lax' is fine for localhost if ports differ but mostly same-site context
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
