import { Module } from '@nestjs/common';
import { VehicleModelService } from './vehicle_model.service';
import { VehicleModelController } from './vehicle_model.controller';

@Module({
  controllers: [VehicleModelController],
  providers: [VehicleModelService],
})
export class VehicleModelModule {}
