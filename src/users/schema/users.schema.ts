import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  birthday: string;

  @Prop()
  password: string;

  @Prop()
  isAdmin: boolean;

  @Prop()
  isBan: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
