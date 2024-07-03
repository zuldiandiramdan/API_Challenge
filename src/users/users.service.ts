import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class UsersService {
  private tableName = 'users';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(
    page: number,
    limit: number,
    id: number,
    name: string,
    is_admin: boolean,
  ) {
    if (page > 0) {
      const offset = (page - 1) * limit;

      const datas = await this.knex(this.tableName)
        .select('*')
        .where('id', 'LIKE', `%${id}`)
        .where('name', 'LIKE', `%${name}%`)
        .where('is_admin', 'LIKE', `%${is_admin}%`)
        .limit(limit)
        .offset(offset);

      const totalResult = (await this.knex(this.tableName)
        .count('id as count')
        .where('id', 'LIKE', `%${id}`)
        .where('name', 'LIKE', `%${name}%`)
        .where('is_admin', 'LIKE', `%${is_admin}%`)
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

  async findOne(name: string) {
    return await this.knex(this.tableName).where('name',name);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
