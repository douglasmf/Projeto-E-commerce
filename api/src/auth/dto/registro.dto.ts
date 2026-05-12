import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistroDto {
  
  @ApiProperty({
    description: 'Nome do Usuário',
    example: 'João Silva'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'E-mail do Usuário',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Senha do Usuário',
    example: '12345678'
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
