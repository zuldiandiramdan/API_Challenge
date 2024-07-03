import { IsString } from "class-validator";

export class CreateVehicleBrandDto {
    @IsString()
    name: string;    
}
