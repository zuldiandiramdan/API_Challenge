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
import { VehicleYearService } from './vehicle_year.service';
import { CreateVehicleYearDto } from './dto/create-vehicle_year.dto';
import { UpdateVehicleYearDto } from './dto/update-vehicle_year.dto';
import { Response } from 'express';
import { Public, User } from 'src/lib/decorators/auth.decorator';

@Controller('vehicle-year')
export class VehicleYearController {
  constructor(private readonly vehicleYearService: VehicleYearService) {}

  @Post()
  async create(
    @Body() createVehicleYearDto: CreateVehicleYearDto,
    @Res() res: Response,
  ) {
    const vehicle_year =
      await this.vehicleYearService.create(createVehicleYearDto);

    res.location(`/vehicle_year/${vehicle_year[0]}`);
    res.status(201).json({
      id: vehicle_year[0],
      ...createVehicleYearDto,
    });
  }

  @User()
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
    @Query('id') id: string = '',
    @Query('year') year: string = '0',
    @Res() res: Response,
  ) {
    try {
      const paginatedDatas = await this.vehicleYearService.findAll(
        +page,
        +limit,
        id,
        year,
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
    return this.vehicleYearService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleYearDto: UpdateVehicleYearDto,
  ) {
    await this.vehicleYearService.update(+id, updateVehicleYearDto);

    return { id, ...updateVehicleYearDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vehicleYearService.remove(+id);
  }
}
