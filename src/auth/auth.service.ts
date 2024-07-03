import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user[0].id, name: user[0].name, is_admin: user[0].is_admin };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
