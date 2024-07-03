import { Module } from '@nestjs/common';
import { VehicleBrandService } from './vehicle_brand.service';
import { VehicleBrandController } from './vehicle_brand.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [VehicleBrandController],
  providers: [VehicleBrandService],
})
export class VehicleBrandModule {}
