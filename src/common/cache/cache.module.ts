import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from '../services/cache.service';
import { RedisService } from '../services/redis.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD'),
        db: configService.get('REDIS_DB', 0),
        ttl: configService.get('CACHE_DEFAULT_TTL', 3600),
        max: configService.get('CACHE_MAX_ITEMS', 1000),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService, RedisService],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
