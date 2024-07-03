import { IsNumber, IsString } from "class-validator";

export class CreatePricelistDto {
    @IsString()
    code: string;

    @IsNumber()
    price: number;

    @IsNumber()
    year_id: number;
    
    @IsNumber()
    model_id: number;
}
