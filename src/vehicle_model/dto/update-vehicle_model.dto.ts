import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleModelDto } from './create-vehicle_model.dto';

export class UpdateVehicleModelDto extends PartialType(CreateVehicleModelDto) {}
