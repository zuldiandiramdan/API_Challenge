import { IsNumber, IsString } from "class-validator";

export class CreateVehicleModelDto {
    @IsString()
    name: string;

    @IsNumber()
    type_id: number;
}
