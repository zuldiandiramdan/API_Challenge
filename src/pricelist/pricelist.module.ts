import { Module } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { PricelistController } from './pricelist.controller';

@Module({
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
