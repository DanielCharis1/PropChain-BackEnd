import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PrismaModule } from '../database/prisma/prisma.module';
import { ValuationModule } from '../valuation/valuation.module';

@Module({
  imports: [PrismaModule, ValuationModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
