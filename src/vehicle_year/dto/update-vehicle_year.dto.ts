import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleYearDto } from './create-vehicle_year.dto';

export class UpdateVehicleYearDto extends PartialType(CreateVehicleYearDto) {}
