import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: any) {
    const { phoneNumber, password, fullName } = registerDto;

    const existingUser = await this.usersService.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      throw new BadRequestException('S�?điện thoại đã được đăng ký');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      phoneNumber,
      password: hashedPassword,
      fullName,
    });

    return this.generateToken(user);
  }

  async login(loginDto: any) {
    const { phoneNumber, password } = loginDto;
    const user = await this.usersService.findByPhoneNumber(phoneNumber);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('S�?điện thoại hoặc mật khẩu không đúng');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user._id, phoneNumber: user.phoneNumber };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        rank: user.rank,
        points: user.points,
      },
    };
  }
}
