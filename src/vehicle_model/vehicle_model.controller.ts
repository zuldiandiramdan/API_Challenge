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
import { VehicleModelService } from './vehicle_model.service';
import { CreateVehicleModelDto } from './dto/create-vehicle_model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle_model.dto';
import { Response } from 'express';
import { Public, User } from 'src/lib/decorators/auth.decorator';

@Controller('vehicle-model')
export class VehicleModelController {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  @Post()
  async create(
    @Body() createVehicleModelDto: CreateVehicleModelDto,
    @Res() res: Response,
  ) {
    const vehicle_model = await this.vehicleModelService.create(
      createVehicleModelDto,
    );

    res.location(`/vehicle-model/${vehicle_model[0]}`);
    return res.status(201).json({
      id: vehicle_model[0],
      ...createVehicleModelDto,
    });
  }

  @User()
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
    @Query('id') id: string = '',
    @Query('name') name: string = '',
    @Query('type_id') type_id: string = '',
    @Res() res: Response,
  ) {
    try {
      const paginatedDatas = await this.vehicleModelService.findAll(
        +page,
        +limit,
        id,
        name,
        type_id,
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
    return this.vehicleModelService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleModelDto: UpdateVehicleModelDto,
  ) {
    await this.vehicleModelService.update(+id, updateVehicleModelDto);
    return { id, ...updateVehicleModelDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vehicleModelService.remove(+id);
  }
}
