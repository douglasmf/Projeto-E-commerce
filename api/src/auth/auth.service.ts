import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // LOGIN - Rota pública
  async login(  data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
        data.password, 
        user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { 
        sub: user.id,
        email: user.email,
        role: user.role
     };

     return {
        access_token: this.jwtService.sign(payload)
     };
  }

  // REGISTRO - Rota pública
  async register(data: RegistroDto) {
    return this.usersService.create({ name: data.name, email: data.email, password: data.password });
  }
}
