import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
    @Query('id') id: string = '',
    @Query('name') name: string = '',
    @Query('is_admin') is_admin: any = '',
    @Res() res: Response,
  ) {
    const paginatedDatas = await this.usersService.findAll(
      +page,
      +limit,
      +id,
      name,
      is_admin
    );

    res.status(HttpStatus.OK).json(paginatedDatas);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findOne(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
