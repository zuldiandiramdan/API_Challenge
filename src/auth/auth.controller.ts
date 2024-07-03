import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from 'src/lib/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res() res: Response) {
    if (signInDto.name) {
      const token = await this.authService.signIn(signInDto.name);

      res.status(HttpStatus.OK).json(token);
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: ['name must be a string'],
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
