import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../types/jwt-payload';

function cookieExtractorFactory(cookieName: string) {
  return (req: Request) => {
    if (req && req.cookies) {
      return req.cookies[cookieName];
    }
    return null;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService, private readonly usersService: UsersService) {
    const accessCookieName = config.get<string>('ACCESS_TOKEN_COOKIE', 'access_token');
    const accessSecret = config.get<string>('JWT_ACCESS_SECRET') || 'dev_access_secret';
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractorFactory(accessCookieName)]),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}

