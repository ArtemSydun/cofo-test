import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configServiceKeys } from '../enums/config.service.enum';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const key =
      req.headers['x-api-key'] ?? req.headers['X-API-KEY'] ?? req.query.api_key;

    const validKey = this.configService.get(configServiceKeys.API_KEY);

    if (!validKey) {
      throw new InternalServerErrorException(`API is not secured with key`);
    }

    if (key !== validKey) {
      throw new UnauthorizedException(`Invalid API key`);
    }

    return true;
  }
}
