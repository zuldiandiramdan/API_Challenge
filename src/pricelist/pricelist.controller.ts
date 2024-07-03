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
import { PricelistService } from './pricelist.service';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { Response } from 'express';
import { Public, User } from 'src/lib/decorators/auth.decorator';

@Controller('pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Post()
  async create(
    @Body() createPricelistDto: CreatePricelistDto,
    @Res() res: Response,
  ) {
    const pricelist = await this.pricelistService.create(createPricelistDto);

    res.location(`/pricelist/${pricelist[0]}`);
    res.status(201).json({
      id: pricelist[0],
      ...createPricelistDto,
    });
  }

  @User()
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
    @Query('id') id: string = '',
    @Query('code') code: string = '',
    @Query('price') price: string = '',
    @Query('year_id') year_id: string = '',
    @Query('model_id') model_id: string = '',
    @Res() res: Response,
  ) {
    try {
      const paginatedDatas = await this.pricelistService.findAll(
        +page,
        +limit,
        id,
        code,
        price,
        year_id,
        model_id,
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
    return this.pricelistService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePricelistDto: UpdatePricelistDto,
  ) {
    await this.pricelistService.update(+id, updatePricelistDto);

    return { id: id, ...updatePricelistDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pricelistService.remove(+id);
  }
}
