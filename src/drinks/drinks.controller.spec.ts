import { Test, TestingModule } from '@nestjs/testing';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';

describe('DrinksController', () => {
  let controller: DrinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrinksController],
      providers: [DrinksService],
    }).compile();

    controller = module.get<DrinksController>(DrinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
