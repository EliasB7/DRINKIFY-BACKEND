import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpCustomService } from './http/http.service';
import { Drink, DrinkSchema } from 'src/drinks/schema/drinks.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Drink.name, schema: DrinkSchema }]),
  ],
  providers: [HttpCustomService],
  exports: [HttpModule, HttpCustomService],
})
export class ProvidersModule {}
