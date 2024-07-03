import { IsNumber } from "class-validator";

export class CreateVehicleYearDto {
  @IsNumber()
  year: number;
}
