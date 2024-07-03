import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypeService } from './vehicle_type.service';

describe('VehicleTypeService', () => {
  let service: VehicleTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleTypeService],
    }).compile();

    service = module.get<VehicleTypeService>(VehicleTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
