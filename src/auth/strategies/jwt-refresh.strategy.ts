import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
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
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly config: ConfigService) {
    const refreshCookieName = config.get<string>('REFRESH_TOKEN_COOKIE', 'refresh_token');
    const refreshSecret = config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret';
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractorFactory(refreshCookieName)]),
      ignoreExpiration: false,
      secretOrKey: refreshSecret,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}

