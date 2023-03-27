import { IngredientsList } from "../ingredients/IngredientsList.service";
import { TIngredientWithQuantity } from "../ingredients/models/Ingredient.model";
import { TPizzaWithPrice } from "./models/Pizza.model";
import { PizzaList } from "./PizzaList.service";

export class CookPizza {
  private readonly availablePizza: PizzaList;
  private readonly ingredients: IngredientsList;
  constructor(availablePizza: PizzaList, ingredients: IngredientsList) {
    this.availablePizza = availablePizza;
    this.ingredients = ingredients;
  }
  public reserveIngredients(pizzaId: string, pizzaQuantity: number): void {
    try {
      const pizzaExist: TPizzaWithPrice = this.availablePizza.getPizza(pizzaId);
      const neededIngredients: Map<string, number> = pizzaExist.object.ingredients;
      neededIngredients.forEach((quantity, ingredientId) => {
        const ingredient: TIngredientWithQuantity = this.ingredients.getIngredient(ingredientId);
        this.ingredients.useIngredient(ingredient.object.id, quantity * pizzaQuantity);
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public countPrice(pizzaList: Map<string, number>): number {
    let finalPrice: number = 0;
    pizzaList.forEach((quanitytyOfPizza, pizzaId) => {
      const pizza: TPizzaWithPrice = this.availablePizza.getPizza(pizzaId);
      finalPrice += pizza.property * quanitytyOfPizza;
      return;
    });
    return finalPrice;
  }
}
