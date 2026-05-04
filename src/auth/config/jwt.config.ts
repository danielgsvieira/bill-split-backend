import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

const DEFAULT_CONFIG = {
  JWT_SECRET: '0123456789',
};

function jwtConfigFactory(configService: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: configService.get<string>('JWT_SECRET', DEFAULT_CONFIG.JWT_SECRET),
  };
}

export { jwtConfigFactory };
