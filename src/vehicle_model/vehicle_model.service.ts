import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleModelDto } from './dto/create-vehicle_model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle_model.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class VehicleModelService {
  private tableName = 'vehicle_model';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createVehicleModelDto: CreateVehicleModelDto) {
    try {
      const vehicle_model = await this.knex(this.tableName).insert({
        name: createVehicleModelDto.name,
        type_id: createVehicleModelDto.type_id,
      });

      return vehicle_model;
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

  async findAll(page: number, limit: number,id: string, name: string, type_id: string) {
    if (page > 0) {
      const offset = (page - 1) * limit;

      const datas = await this.knex(this.tableName)
        .select('*')
        .where('id', 'LIKE', `%${id}%`)
        .where('name', 'LIKE', `%${name}%`)
        .where('type_id', 'LIKE',`%${type_id}%`)
        .limit(limit)
        .offset(offset);

      const totalResult = (await this.knex(this.tableName)
        .count('id as count')
        .where('name', 'LIKE', `%${name}%`)
        .where('type_id', 'LIKE',`%${type_id}%`)
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
    const vehicle_model = await this.knex(this.tableName).where('id', id);
    return vehicle_model[0] ?? {};
  }

  async update(id: number, updateVehicleModelDto: UpdateVehicleModelDto) {
    try {
      const updateData = {};
      if (updateVehicleModelDto.name)
        updateData['name'] = updateVehicleModelDto.name;

      if (updateVehicleModelDto.type_id)
        updateData['type_id'] = updateVehicleModelDto.type_id;

      let vehicle_brand = {};
      if (updateData) {
        vehicle_brand = await this.knex(this.tableName)
          .update(updateData)
          .where('id', id);
      }

      return vehicle_brand;
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
