import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DrinksDocuments = HydratedDocument<Drink>;

@Schema()
export class Drink {
  @Prop()
  name: String;

  @Prop()
  id: Number;

  @Prop()
  strVideo: String;

  @Prop()
  strInstructions: String;

  @Prop()
  strGlass: String;

  @Prop()
  strIngredient: String[];

  @Prop()
  strMeasure: String[];

  @Prop()
  strDrinkThumb: String;

  @Prop()
  isPopular: Boolean;
}

export const DrinkSchema = SchemaFactory.createForClass(Drink);
