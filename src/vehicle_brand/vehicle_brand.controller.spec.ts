import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandController } from './vehicle_brand.controller';
import { VehicleBrandService } from './vehicle_brand.service';

describe('VehicleBrandController', () => {
  let controller: VehicleBrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleBrandController],
      providers: [VehicleBrandService],
    }).compile();

    controller = module.get<VehicleBrandController>(VehicleBrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
