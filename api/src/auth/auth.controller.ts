import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';
import { ApiOperation, ApiTags} from  '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ROTA PÚBLICA - LOGIN
  @ApiOperation({ summary: 'Login de usuário' })
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  // ROTA PÚBLICA - REGISTRO
  @ApiOperation({ summary: 'Registro de usuário' })
  @Post('register')
  register(@Body() data: RegistroDto) {
    return this.authService.register(data);
  }
}
