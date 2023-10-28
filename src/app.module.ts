import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DrinksModule } from './drinks/drinks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './utils/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Amebita:T20062002@amebita.hnao9oy.mongodb.net/',
    ),
    DrinksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
