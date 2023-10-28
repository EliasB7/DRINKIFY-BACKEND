import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drink } from './schema/drinks.schema';
import { HttpCustomService } from 'src/providers/http/http.service';
import { CreateDrinkDto } from './dto/create-drink.dto';

@Injectable()
export class DrinksService {
  constructor(
    @InjectModel(Drink.name) public drinkModel: Model<Drink>,
    private readonly httpService: HttpCustomService,
  ) {}

  async searchAndSave(name: string) {
    return this.httpService.findByNameAndSave(name);
  }

  getFromDB() {
    return this.httpService.getFromDatabase();
  }

  async searchByNameInDatabase(name: string) {
    // Realiza la búsqueda en la base de datos utilizando el modelo de Drink.
    const drinks = await this.drinkModel
      .find({
        name: { $regex: new RegExp(name, 'i') }, // Búsqueda de texto insensible a mayúsculas/minúsculas
      })
      .exec();

    return drinks;
  }

  async getDrinkById(id: string): Promise<Drink | null> {
    try {
      const drink = await this.drinkModel.findOne({ id: id }).exec();
      return drink;
    } catch (error) {
      throw new NotFoundException(
        `Trago con ID ${id} no encontrado en la base de datos`,
      );
    }
  }

  async importRandomCocktailFromApi() {
    try {
      const cocktailData = await this.httpService.apiFindRandomCocktail();
      const newCocktail = new this.drinkModel(cocktailData.importedCocktail);
      const savedCocktail = await newCocktail.save();
      return savedCocktail;
    } catch (error) {
      throw new Error(`Error importing random cocktail: ${error.message}`);
    }
  }

  async deleteDuplicateCocktails(): Promise<number> {
    try {
      const cocktails = await this.drinkModel.find({}, 'id').exec();
      const uniqueIds = new Set<string>();
      const duplicateIds: string[] = [];

      // Identificar los IDs duplicados
      cocktails.forEach((cocktail) => {
        if (uniqueIds.has(cocktail.id.toString())) {
          duplicateIds.push(cocktail.id.toString());
        } else {
          uniqueIds.add(cocktail.id.toString());
        }
      });

      // Eliminar los cócteles duplicados
      const deleteResult = await this.drinkModel
        .deleteMany({ id: { $in: duplicateIds } })
        .exec();

      return deleteResult.deletedCount || 0;
    } catch (error) {
      throw new Error(
        `Error al eliminar cócteles duplicados: ${error.message}`,
      );
    }
  }

  async setPopular(id: string, isPopular: boolean): Promise<Drink | null> {
    try {
      const drink = await this.drinkModel.findByIdAndUpdate(
        id,
        { isPopular },
        { new: true },
      );

      if (!drink) {
        throw new NotFoundException(
          `Trago con ID ${id} no encontrado en la base de datos`,
        );
      }

      return drink;
    } catch (error) {
      throw new Error(`Error al establecer "isPopular": ${error.message}`);
    }
  }

  async getPopularDrinks(): Promise<Drink[]> {
    try {
      const popularDrinks = await this.drinkModel
        .find({ isPopular: true })
        .exec();
      return popularDrinks;
    } catch (error) {
      throw new Error(
        `Error al obtener los tragos populares: ${error.message}`,
      );
    }
  }

  async getRandomCocktail() {
    try {
      const randomCocktail = await this.drinkModel
        .aggregate([{ $sample: { size: 1 } }])
        .exec();

      if (randomCocktail && randomCocktail.length > 0) {
        return randomCocktail[0];
      } else {
        throw new NotFoundException(
          'No se encontraron cócteles en la base de datos.',
        );
      }
    } catch (error) {
      throw new Error(`Error al obtener cóctel aleatorio: ${error.message}`);
    }
  }
}
