import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleYearDto } from './dto/create-vehicle_year.dto';
import { UpdateVehicleYearDto } from './dto/update-vehicle_year.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class VehicleYearService {
  private tableName = 'vehicle_year';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createVehicleYearDto: CreateVehicleYearDto) {
    try {
      const vehicle_year = await this.knex(this.tableName).insert({
        year: createVehicleYearDto.year,
      });

      return vehicle_year;
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

  async findAll(page: number, limit: number, id: string, year: string) {
    if (page > 0) {
      const offset = (page - 1) * limit;

      const datas = await this.knex(this.tableName)
        .select('*')
        .where('id', 'LIKE', `%${id}%`)
        .where('year', 'LIKE', `%${year}%`)
        .limit(limit)
        .offset(offset);

      const totalResult = (await this.knex(this.tableName)
        .count('id as count')
        .where('id', 'LIKE', `%${id}%`)
        .where('year', 'LIKE', `%${year}%`)
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
    const vehicle_year = await this.knex(this.tableName).where('id', id);
    return vehicle_year[0] ?? {};
  }

  async update(id: number, updateVehicleYearDto: UpdateVehicleYearDto) {
    try {
      const updateData = {};
      if (updateVehicleYearDto.year)
        updateData['year'] = updateVehicleYearDto.year;

      let vehicle_year = {};
      if (updateData) {
        vehicle_year = await this.knex(this.tableName)
          .update(updateData)
          .where('id', id);
      }

      return vehicle_year;
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
