import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VehicleTypeService } from './vehicle_type.service';
import { CreateVehicleTypeDto } from './dto/create-vehicle_type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle_type.dto';
import { Response } from 'express';
import { Public, User } from 'src/lib/decorators/auth.decorator';

@Controller('vehicle-type')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post()
  async create(
    @Body() createVehicleTypeDto: CreateVehicleTypeDto,
    @Res() res: Response,
  ) {
    const vehicle_type =
      await this.vehicleTypeService.create(createVehicleTypeDto);

    res.location(`/vehicle_type/${vehicle_type[0]}`);
    res.status(201).json({
      id: vehicle_type[0],
      ...createVehicleTypeDto,
    });
  }

  @User()
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
    @Query('id') id: string = '',
    @Query('name') name: string = '',
    @Query('brand_id') brand_id: string = '',
    @Res() res: Response,
  ) {
    const paginatedDatas = await this.vehicleTypeService.findAll(
      +page,
      +limit,
      id,
      name,
      brand_id
    );

    res.status(HttpStatus.OK).json(paginatedDatas);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleTypeService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleTypeDto: UpdateVehicleTypeDto,
  ) {
    await this.vehicleTypeService.update(+id, updateVehicleTypeDto);

    return { id: id, ...updateVehicleTypeDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vehicleTypeService.remove(+id);
  }
}
