import { AuthController } from './controller/auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { HashService } from './service/hash.service';
import { jwtConfigFactory } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    HashService,
  ],
})
class AuthModule {}

export { AuthModule };
