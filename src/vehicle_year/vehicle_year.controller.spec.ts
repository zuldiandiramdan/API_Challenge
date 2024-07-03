import { Test, TestingModule } from '@nestjs/testing';
import { VehicleYearController } from './vehicle_year.controller';
import { VehicleYearService } from './vehicle_year.service';

describe('VehicleYearController', () => {
  let controller: VehicleYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleYearController],
      providers: [VehicleYearService],
    }).compile();

    controller = module.get<VehicleYearController>(VehicleYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
