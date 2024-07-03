import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class PricelistService {
  private tableName = 'pricelist';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createPricelistDto: CreatePricelistDto) {
    try {
      const pricelist = await this.knex(this.tableName).insert({
        code: createPricelistDto.code,
        price: createPricelistDto.price,
        year_id: createPricelistDto.year_id,
        model_id: createPricelistDto.model_id,
      });

      return pricelist;
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

  async findAll(
    page: number,
    limit: number,
    id: string,
    code: string,
    price: string,
    year_id: string,
    model_id: string,
  ) {
    if (page > 0) {
      const offset = (page - 1) * limit;

      const datas = await this.knex(this.tableName)
        .select('*')
        .where('id', 'LIKE', `%${id}%`)
        .where('code', 'LIKE', `%${code}%`)
        .where('price', 'LIKE', `%${price}`)
        .where('year_id', 'LIKE', `%${year_id}`)
        .where('model_id', 'LIKE', `%${model_id}`)
        .limit(limit)
        .offset(offset);

      const totalResult = (await this.knex(this.tableName)
        .count('id as count')
        .where('id', 'LIKE', `%${id}%`)
        .where('code', 'LIKE', `%${code}%`)
        .where('price', 'LIKE', `%${price}`)
        .where('year_id', 'LIKE', `%${year_id}`)
        .where('model_id', 'LIKE', `%${model_id}`)
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
    const pricelist = await this.knex(this.tableName).where('id', id);
    return pricelist[0] ?? {};
  }

  async update(id: number, updatePricelistDto: UpdatePricelistDto) {
    try {
      const updateData = {};
      if (updatePricelistDto.code) updateData['code'] = updatePricelistDto.code;

      if (updatePricelistDto.price)
        updateData['price'] = updatePricelistDto.price;

      if (updatePricelistDto.year_id)
        updateData['year_id'] = updatePricelistDto.year_id;

      if (updatePricelistDto.model_id)
        updateData['model_id'] = updatePricelistDto.model_id;

      let pricelist = {};
      if (updateData) {
        pricelist = await this.knex(this.tableName)
          .update(updateData)
          .where('id', id);
      }

      return pricelist;
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
