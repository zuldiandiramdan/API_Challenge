import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleBrandModule } from './vehicle_brand/vehicle_brand.module';
import { KnexModule } from 'nest-knexjs';
import { VehicleTypeModule } from './vehicle_type/vehicle_type.module';
import { VehicleModelModule } from './vehicle_model/vehicle_model.module';
import { VehicleYearModule } from './vehicle_year/vehicle_year.module';
import { PricelistModule } from './pricelist/pricelist.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
require('dotenv').config();

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        connection: {
          host: process.env.DB_HOST || 'localhost33',
          port: parseInt(process.env.DB_PORT, 10) || 3306,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'db_cars',
        },
      },
    }),
    VehicleBrandModule,
    VehicleTypeModule,
    VehicleModelModule,
    VehicleYearModule,
    PricelistModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
    UsersService,
  ],
})
export class AppModule {}
