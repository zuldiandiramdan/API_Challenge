import { Module } from '@nestjs/common';
import { VehicleYearService } from './vehicle_year.service';
import { VehicleYearController } from './vehicle_year.controller';

@Module({
  controllers: [VehicleYearController],
  providers: [VehicleYearService],
})
export class VehicleYearModule {}
