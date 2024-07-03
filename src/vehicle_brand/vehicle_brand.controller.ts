import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VehicleBrandService } from './vehicle_brand.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle_brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle_brand.dto';
import { Response } from 'express';
import { User } from 'src/lib/decorators/auth.decorator';

@Controller('vehicle-brand')
export class VehicleBrandController {
  constructor(private readonly vehicleBrandService: VehicleBrandService) {}

  @Post()
  async create(
    @Body() createVehicleBrandDto: CreateVehicleBrandDto,
    @Res() res: Response,
  ) {
    const vehicle_brand = await this.vehicleBrandService.create(
      createVehicleBrandDto,
    );

    res.location(`/vehicle-brand/${vehicle_brand[0]}`);
    res.status(201).json({
      id: vehicle_brand[0],
      name: createVehicleBrandDto.name,
    });
  }

  @User()
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
    @Query('id') id: string = '',
    @Query('name') name: string = '',
    @Res() res: Response,
  ) {
    try {
      const paginatedDatas = await this.vehicleBrandService.findAll(
        +page,
        +limit,
        id,
        name,
      );

      res.status(HttpStatus.OK).json(paginatedDatas);
    } catch (err) {
      console.error(err);
      if (err.status === HttpStatus.BAD_REQUEST) {
        res.status(HttpStatus.BAD_REQUEST).json(err.response);
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleBrandService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto,
  ) {
    await this.vehicleBrandService.update(+id, updateVehicleBrandDto);

    return { id: id, ...updateVehicleBrandDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.vehicleBrandService.remove(+id);
  }
}
