import { Body, Controller, Get, Res, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Logindto, Registerdto, VerifyAccountdto } from './auth.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'Confilic' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async regitster(@Body() registerdto: Registerdto, @Res() res) {
    try {
      const data = await this.authService.register(registerdto);

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @Get('verify/:tokenVerify')
  public async verifyAccount(
    @Param() verifyAccountdto: VerifyAccountdto,
    @Res() res,
  ) {
    try {
      const data = await this.authService.verifyAccount(verifyAccountdto);
      res.json(data);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async Login(@Body() loginDto: Logindto, @Res() res) {
    try {
      const data = await this.authService.login(loginDto);
      res.json({ accessToken: data });
    } catch (error) {
      throw error;
    }
  }
}
