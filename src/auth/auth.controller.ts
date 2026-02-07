import { Controller, Post, Get ,Body, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
   
    constructor(private readonly authservice: AuthService){}

    @Post('login')
     async login(@Body() loginDto: LoginDTO) {
        
        console.log("on est dans login controller:");
        console.log("email et password arrive",loginDto);
        return await this.authservice.login(loginDto);
    }


    @Post('register')
    async register(@Body() body:SignUpDTO){
        let message =  await this.authservice.register(body);
        return message;
    }

    // @UseGuards(AuthGuard())
  

}
