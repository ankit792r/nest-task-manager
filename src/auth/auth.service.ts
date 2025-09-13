import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtSerice: JwtService,
  ) { }

  async loginUser(data: LoginDto) {
    const user = await this.userService.getUserByEmail(data.email);
    if (user.password !== data.password)
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);

    const payload = {
      sub: user,
      email: user.email,
    };

    const token = await this.jwtSerice.signAsync(payload);
    return {
      token,
      userId: user._id,
    };
  }
}
