import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Drink } from 'src/drinks/schema/drinks.schema';
import axios from 'axios';
@Injectable()
export class HttpCustomService {
  public importedCocktailIds = new Set<string>();
  public isCocktailImported(id: string): boolean {
    return this.importedCocktailIds.has(id);
  }
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Drink.name) public drinkModel: Model<Drink>,
  ) {}

  public async apiFindByName(name: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`,
      ),
    );

    const drink = response.data.drinks[0];

    if (!drink) {
      return null;
    }

    const ingredientsArray = this.saveIngredientsinArray(drink);
    const measuresArray = this.saveMeasuresinArray(drink);

    return {
      drink,
      ingredients: ingredientsArray,
      measures: measuresArray,
    };
  }

  saveIngredientsinArray(drink: any) {
    const ingredientsArray = [];

    for (let i = 1; i <= 15; i++) {
      const ingredientKey = `strIngredient${i}`;

      const ingredient = drink[ingredientKey]?.trim();

      if (!ingredient) {
        break;
      }

      ingredientsArray.push(ingredient);
    }

    return ingredientsArray;
  }

  saveMeasuresinArray(drink: any) {
    const measureArray = [];

    for (let i = 1; i <= 15; i++) {
      const measureKey = `strMeasure${i}`;

      const measure = drink[measureKey]?.trim();

      if (!measure) {
        break;
      }

      measureArray.push(measure);
    }

    return measureArray;
  }

  public async findByNameAndSave(name: string): Promise<Drink> {
    const response = await firstValueFrom(
      this.httpService.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`,
      ),
    );
    const firstDrink = response.data.drinks[0];

    const ingredientsArray = this.saveIngredientsinArray(firstDrink);
    const measureArray = this.saveMeasuresinArray(firstDrink);

    const newDrink = new this.drinkModel({
      name: firstDrink.strDrink,
      id: firstDrink.idDrink,
      strVideo: firstDrink.strVideo,
      strInstructions: firstDrink.strInstructions,
      strGlass: firstDrink.strGlass,
      strIngredient: ingredientsArray,
      strMeasure: measureArray,
      strDrinkThumb: firstDrink.strDrinkThumb,
    });

    const savedDrink = await newDrink.save();

    return savedDrink;
  }

  public async getFromDatabase(): Promise<Drink[]> {
    try {
      const drinks = await this.drinkModel.find();

      return drinks;
    } catch (error) {
      throw new Error(`Error al buscar en la base de datos: ${error.message}`);
    }
  }

  async apiFindRandomCocktail(): Promise<any> {
    try {
      const response = await axios.get(
        'https://www.thecocktaildb.com/api/json/v1/1/random.php',
      );

      const cocktailData = response.data.drinks[0];

      if (!cocktailData || Object.keys(cocktailData).length === 0) {
        throw new Error(
          'No se pudo encontrar un cóctel aleatorio válido en la respuesta.',
        );
      }

      return {
        strIngredient: this.saveIngredientsinArray(cocktailData),
        strMeasure: this.saveMeasuresinArray(cocktailData),
        strDrinkThumb: cocktailData.strDrinkThumb || '',
        strGlass: cocktailData.strGlass || '',
        strInstructions: cocktailData.strInstructions || '',
        id: cocktailData.idDrink || '',
        name: cocktailData.strDrink || '',
      };
    } catch (error) {
      throw new Error(`Error al obtener cóctel aleatorio: ${error.message}`);
    }
  }
}
