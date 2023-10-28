import {
  Controller,
  Get,
  Query,
  Post,
  Param,
  NotFoundException,
  Injectable,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { DrinksService } from './drinks.service';
import { CreateDrinkDto } from './dto/create-drink.dto';
import { UpdateDrinkDto } from './dto/update-drink.dto';
import { HttpCustomService } from 'src/providers/http/http.service';

@Controller('drink')
export class DrinksController {
  constructor(
    private readonly drinksService: DrinksService,
    private readonly httpCustomService: HttpCustomService, // Inyecta el servicio
  ) {}

  @Post('saveindb')
  async searchAndSaveFromApi(@Query('name') name: string) {
    try {
      const savedDrink = await this.drinksService.searchAndSave(name);
      return savedDrink;
    } catch (error) {
      throw error;
    }
  }

  @Get('allDrinks')
  async searchFromDataB() {
    const allDrinks = await this.drinksService.getFromDB();
    return allDrinks;
  }

  @Get('/search')
  async searchByName(@Query('name') name: string) {
    const drinks = await this.drinksService.searchByNameInDatabase(name);
    return drinks;
  }

  @Get('/details/:id')
  async getDrinkById(@Param('id') id: string) {
    const drink = await this.drinksService.getDrinkById(id);
    if (!drink) {
      throw new NotFoundException(`Trago con ID ${id} no encontrado`);
    }
    return drink;
  }

  @Get('randomCocktail')
  async getRandomCocktail() {
    try {
      const randomCocktail = await this.drinksService.getRandomCocktail();
      return randomCocktail;
    } catch (error) {
      throw error;
    }
  }

  @Post('importRandomCocktails')
  async importRandomCocktails() {
    try {
      const numberOfCocktailsToImport = 100;
      const importedCocktails = [];

      for (let i = 0; i < numberOfCocktailsToImport; i++) {
        const cocktailData =
          await this.httpCustomService.apiFindRandomCocktail();
        if (!this.httpCustomService.isCocktailImported(cocktailData.id)) {
          const newCocktail = new this.drinksService.drinkModel(cocktailData);
          const savedCocktail = await newCocktail.save();
          importedCocktails.push(savedCocktail);
          this.httpCustomService.isCocktailImported(cocktailData.id);
        }
      }

      return {
        message: `Imported ${importedCocktails.length} random cocktails`,
        importedCocktails,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('deleteDuplicateCocktails')
  async deleteDuplicateCocktails() {
    try {
      const deletedCount = await this.drinksService.deleteDuplicateCocktails();
      return {
        message: `Deleted ${deletedCount} duplicate cocktails from the database.`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('setPopular/:id')
  async setPopular(
    @Param('id') id: string,
    @Body() updateDrinkDto: UpdateDrinkDto,
  ) {
    try {
      const updatedDrink = await this.drinksService.setPopular(
        id,
        updateDrinkDto.isPopular,
      );
      return updatedDrink;
    } catch (error) {
      throw error;
    }
  }

  @Get('popular')
  async getPopularDrinks() {
    try {
      const popularDrinks = await this.drinksService.getPopularDrinks();
      return popularDrinks;
    } catch (error) {
      throw error;
    }
  }
}
