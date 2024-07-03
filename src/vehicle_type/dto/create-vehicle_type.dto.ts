import { IsNumber, IsString } from "class-validator";

export class CreateVehicleTypeDto {
    @IsString()
    name: string;

    @IsNumber()
    brand_id: number;
}
