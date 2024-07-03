import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleTypeDto } from './dto/create-vehicle_type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle_type.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class VehicleTypeService {
  private tableName = 'vehicle_type';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createVehicleTypeDto: CreateVehicleTypeDto) {
    try {
      const vehicle_type = await this.knex(this.tableName).insert({
        name: createVehicleTypeDto.name,
        brand_id: createVehicleTypeDto.brand_id,
      });

      return vehicle_type;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            message: ["A resource with the provided 'name' already exists."],
            error: 'Bad Request',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new HttpException(
          {
            message: ['related resource does not exist.'],
            error: 'Bad Request',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw err;
      }
    }
  }

  async findAll(page: number, limit: number, id: string, name: string, brand_id: string) {
    if (page > 0) {
      const offset = (page - 1) * limit;

      const datas = await this.knex(this.tableName)
        .select('*')
        .where('id','LIKE',`%${id}`)
        .where('name', 'LIKE', `%${name}%`)
        .where('brand_id', 'LIKE',`%${brand_id}%`)
        .limit(limit)
        .offset(offset);

      const totalResult = (await this.knex(this.tableName)
        .count('id as count')
        .where('id','LIKE',`%${id}`)
        .where('name', 'LIKE', `%${name}%`)
        .where('brand_id', 'LIKE',`%${brand_id}%`)
        .first()) as any;
      const total = totalResult ? parseInt(totalResult.count, 10) : 0;
      const totalPages = Math.ceil(total / limit);
      const nextPage = page + 1 < totalPages ? page + 1 : null;
      const prevPage = page - 1 > 0 ? page - 1 : null;

      return {
        data: datas,
        metadata: {
          total_records: total,
          current_page: page,
          total_page: totalPages,
          next_page: nextPage,
          prev_page: prevPage,
        },
      };
    } else {
      throw new HttpException(
        {
          message: ['Page must be greater than 0.'],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    const vehicle_type = await this.knex(this.tableName).where('id', id);
    return vehicle_type[0] ?? {};
  }

  async update(id: number, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    try {
      const updateData = {};
      if (updateVehicleTypeDto.name)
        updateData['name'] = updateVehicleTypeDto.name;

      if (updateVehicleTypeDto.brand_id)
        updateData['brand_id'] = updateVehicleTypeDto.brand_id;

      let vehicle_type = {};
      if (updateData) {
        vehicle_type = await this.knex(this.tableName)
          .update(updateData)
          .where('id', id);
      }

      return vehicle_type;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            message: ["A resource with the provided 'name' already exists."],
            error: 'Bad Request',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new HttpException(
          {
            message: ['related resource does not exist.'],
            error: 'Bad Request',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw err;
      }
    }
  }

  async remove(id: number) {
    try {
      await this.knex(this.tableName).where('id', id).del();
    } catch (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new HttpException(
          {
            message: ['Resource still connected to another data.'],
            error: 'Bad Request',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw err;
      }
    }
  }
}
