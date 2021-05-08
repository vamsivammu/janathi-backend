import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { configService } from 'src/config/config.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controller/auth.controller';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './service/auth.service';

@Module({
  imports:[
    forwardRef(()=>UserModule),
    PassportModule,
    JwtModule.register({
      secret:configService.getJwtConfig(),
      signOptions:{expiresIn:'1d'}
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtGuard,JwtStrategy,RolesGuard]
})
export class AuthModule {}
