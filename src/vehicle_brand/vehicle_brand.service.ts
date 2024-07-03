import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle_brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle_brand.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class VehicleBrandService {
  private tableName = 'vehicle_brand';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createVehicleBrandDto: CreateVehicleBrandDto) {
    try {
      const vehicle_brand = await this.knex(this.tableName).insert({
        name: createVehicleBrandDto.name,
      });

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
      } else {
        throw err;
      }
    }
  }

  async findAll(page: number, limit: number, id: string, name: string) {
    if (page > 0) {
      const offset = (page - 1) * limit;

      const datas = await this.knex(this.tableName)
        .select('*')
        .where('name', 'LIKE', `%${name}%`)
        .where('id', 'LIKE', `%${id}%`)
        .limit(limit)
        .offset(offset);

      const totalResult = (await this.knex(this.tableName)
        .count('id as count')
        .where('name', 'LIKE', `%${name}%`)
        .where('id', 'LIKE', `%${id}%`)
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
    const vehicle_brand = await this.knex(this.tableName).where('id', id);
    return vehicle_brand[0] ?? {};
  }

  async update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    try {
      const updateData = {};
      if (updateVehicleBrandDto.name)
        updateData['name'] = updateVehicleBrandDto.name;

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
