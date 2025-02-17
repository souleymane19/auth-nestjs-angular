import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, } from 'date-fns';
import { ResetPasswordDto } from './dto/reset-password';

@Injectable()
export class AuthService {


  constructor(
     private readonly prisma: PrismaService,
     private usersService : UserService,
    //  private nodemailerService: NodemailerService,
     private jwtService: JwtService)
     {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findEmail(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException({ message: 'email ou mot de passe incorecte' });
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  //crating a new user
  async signUp(createUserDto: any) {
    const newUser = await this.usersService.create(createUserDto);
    const code= await this.generateCode()
    this.createValidateCode(code, newUser.id,"email_verification")
    return {
      message:`le code de validation est ${code}`,
      data:newUser}
  }

  async validateAccount(code:string){
    //verfication du code 
   const verifyCode = await this.vericationCode(code)
   const isActivateAccount = await this.prisma.user.findFirst({where:{id:verifyCode.userId}})
   if (isActivateAccount.status==true) {
    throw new HttpException("l'email est déja verifié", HttpStatus.NON_AUTHORITATIVE_INFORMATION)
   }
   const updateUser = await this.prisma.user.update({where:{id:verifyCode.userId}, 
    data:{status:true},
    select:{email:true, status:true}
  })
  ///this.prisma.user.findFirst({where:{id:updateUser.}})
   return {
    message:"email vefier avec succes",
    data: updateUser
  }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const verification_codes  = await this.vericationCode(resetPasswordDto.code)

    const updateUser = await this.prisma.user.update({where:{
      id:verification_codes.userId
    },
      data:{
        password:resetPasswordDto.newPassword
      },select:{
        email:true,
         status:true
        }
      })
    return { message: 'mot de pass modifier avec succes',
      data:updateUser
     };
  }

  async requestPasswordReset(email: string) {
   
    const user = await this.usersService.findEmail(email);
    if(!user){
      throw new UnauthorizedException({message:"aucune utilisateur ne corespond a cette email"})
    }
    if (!user.status) {
      throw new UnauthorizedException({message:"l'email de l'utilisateur na pas été véfier"})
  
    }
    const code = await this.generateCode();
   //this.nodemailerService.sendMail(email, 'reset password', `votre code de verification est ${code}`)
    return this.createValidateCode(code, user.id, "password_reset");
  
  }

  private async generateCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }



  private async createValidateCode(code: string, userId: string, type: string) {
    const expiration = addMinutes(new Date(), 30); // Expire dans 30 minutes 
    const types  = this.isValidType(type) 

    const isValidationCode = await this.prisma.verification_codes.findFirst({where:{userId:userId}})
    if (isValidationCode) {
      const updateValidationCode = await this.prisma.verification_codes.update({where:{id:isValidationCode.id, type:"password_reset"},
           data:{
            ...isValidationCode,code
          }})
           return {message:"le code de validation est", code:updateValidationCode.code}
    }
    const newValidationCode = await this.prisma.verification_codes.create({
      data: {
        userId,
        code,
        type:types,
        expiration,
      }
    })
    return {message:"le code de validation est", code:newValidationCode.code}
  }

  private async vericationCode(sendCode:string){
    const verifyCode = await this.prisma.verification_codes.findFirst({where:{code:sendCode}})
    if (!verifyCode) {
      throw new HttpException("le code ne pas valable démande une autre code ", HttpStatus.NOT_FOUND)
    }
  return verifyCode
  }

  private async isAccountVerify(userId: string):Promise<Boolean>{
   const user = await this.prisma.user.findFirst({where:{id:userId}})
   if (!user.status) {
    return false
   }
   return true
  }

  //verifcation si la date es espierer 

  private verificationDate(data){

  }
 
  private isValidType(type: string)  {
    const types = ['password_reset', 'email_verification'];
    if (!types.includes(type)) {
      throw new HttpException(`invalid type les types vaides sont ${types.join(', ')}`, HttpStatus.BAD_REQUEST);
    }
    return type;
  }

  // async sendEmail(email: string) {
  //   const send = await this.nodemailerService.sendMail(email, 'test', 'test');
  //   return send;
  // }

}


