import { List } from "../utilities/ListGeneric.service";
import {
  IIngredient,
  TIngredientWithQuantity,
} from "./models/Ingredient.model";

export class IngredientsList extends List<IIngredient, number> {
  public addIngredient(ingredient: IIngredient, quantity: number = 1): void {
    const ingredientExist: TIngredientWithQuantity | undefined =
      this.getObjectById(ingredient.id);
    if (ingredientExist) {
      ingredientExist.property += quantity;
      return;
    }
    this.add(ingredient, quantity);
  }
  public deleteIngredient(ingredient: IIngredient): void {
    try {
      this.delete(ingredient);
    } catch (err: any) {
      throw new Error("Ingredient you are trying to delete does not exist");
    }
  }
  public useIngredient(ingredientId: string, quantity: number): void {
    try {
      const ingredientExist: TIngredientWithQuantity | undefined =
        this.getObjectById(ingredientId);
      if (!ingredientExist) {
        throw new Error("Ingredient does not exist");
      }
      if (ingredientExist.property < quantity) {
        throw new Error("Insufficient amount of ingredients");
      }
      ingredientExist.property -= quantity;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public getIngredient(ingredientId: string): TIngredientWithQuantity {
    try {
      const ingredientExist: TIngredientWithQuantity | undefined =
        this.getObjectById(ingredientId);
      if (!ingredientExist) {
        throw new Error();
      }
      return ingredientExist;
    } catch (err: any) {
      throw new Error("Ingredient does not exist");
    }
  }
}
