import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';




@Injectable()
export class AuthService {
   
    constructor(private readonly jwtService: JwtService, private readonly userService:UserService){}

   

    async login(loginDto: LoginDTO) {
    console.log("on est dans login service");

    const { email, password } = loginDto;
          console.log("Email et mot de passe",);

    
    const user = await this.userService.findByEmail(email);

    
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
            console.log("Email ou mot de passe incorrect");

    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
      console.log("  mot de passe incorrect");
    }


    // Générer le token JWT
    const payload = { 
      sub: user.id_user, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);
   console.log("login bien passe",access_token);
    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

    async register(body: SignUpDTO) {
    const { email, password, username,role,ville,avatar } = body;  

    console.log('Données reçues:', { body });  

    // Vérifier si l'email existe déjà
    const existingUser = await this.userService.findByEmail(email );
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
       console.log('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle "user" par défaut
    const savedUser = await this.userService.create({ email, password: hashedPassword, username,role,ville,avatar});


    console.log(' Utilisateur sauvegardé:', savedUser);  

    return {
        message: "Utilisateur crée avec success",
    };
  }

     info(){
         return 'Infos';
     }
}
