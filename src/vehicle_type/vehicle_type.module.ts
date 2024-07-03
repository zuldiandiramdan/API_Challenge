import { Module } from '@nestjs/common';
import { VehicleTypeService } from './vehicle_type.service';
import { VehicleTypeController } from './vehicle_type.controller';

@Module({
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService],
})
export class VehicleTypeModule {}
