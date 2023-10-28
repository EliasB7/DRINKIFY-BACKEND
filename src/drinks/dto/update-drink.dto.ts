import { PartialType } from '@nestjs/mapped-types';
import { CreateDrinkDto } from './create-drink.dto';
import { IsBoolean } from 'class-validator';

export class UpdateDrinkDto extends PartialType(CreateDrinkDto) {
  @IsBoolean()
  isPopular: boolean;
}
