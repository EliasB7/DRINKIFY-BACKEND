import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DrinksService } from './drinks.service';
import { DrinksController } from './drinks.controller';
import { Drink, DrinkSchema } from './schema/drinks.schema';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/http/http.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drink.name, schema: DrinkSchema }]),
    ProvidersModule,
  ],
  providers: [DrinksService, HttpCustomService],
  controllers: [DrinksController],
})
export class DrinksModule {}
