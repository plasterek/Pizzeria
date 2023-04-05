import { IngredientsList } from "../../ingredients/IngredientsList.service";
import { IPizza } from "../models/Pizza.model";
import { CookPizza } from "../CookPizza.service";
import { PizzaList } from "../PizzaList.service";
import { IIngredient } from "../../ingredients/models/Ingredient.model";

describe("CookPizza class", () => {
  //given
  const pizza: IPizza = { id: "1", name: "pizza", ingredients: new Map().set("ingredientId", 1) };
  const price: number = 100;
  const quantity: number = 1;
  const ingredient: IIngredient = { id: "ingredientId", name: "ingredient" };
  let pizzaList: PizzaList = new PizzaList();
  let ingredients: IngredientsList = new IngredientsList();
  let cookPizza: CookPizza = new CookPizza(pizzaList, ingredients);

  beforeEach(() => {
    pizzaList = new PizzaList();
    ingredients = new IngredientsList();
    cookPizza = new CookPizza(pizzaList, ingredients);
  });

  describe("When trying to reserve ingredients for pizza and pizza does not exist in pizza list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => cookPizza.reserveIngredients(pizza.id, quantity)).toThrow();
    });
  });
  describe("When trying to reserve ingredients for pizza and ingredient needed for pizza does not exist in ingredient list", () => {
    it("It should throw an exception", () => {
      //when
      pizzaList.addPizza(pizza, price);
      //then
      expect(() => cookPizza.reserveIngredients(pizza.id, quantity)).toThrow();
    });
  });
  describe("When trying to reserve ingredients and everything went well", () => {
    it("getPizza method from pizza list should be called", () => {
      //given
      const getPizza = jest.spyOn(pizzaList, "getPizza");
      //when
      pizzaList.addPizza(pizza, price);
      ingredients.addIngredient(ingredient, quantity);
      cookPizza.reserveIngredients(pizza.id, quantity);
      //then
      expect(getPizza).toBeCalled();
    });
    it("getIngredient method from ingredient list should be called", () => {
      //given
      const getIngredient = jest.spyOn(ingredients, "getIngredient");
      //when
      pizzaList.addPizza(pizza, price);
      ingredients.addIngredient(ingredient, quantity);
      cookPizza.reserveIngredients(pizza.id, quantity);
      //then
      expect(getIngredient).toBeCalled();
    });
    it("useIngredient method from ingredient list should be called", () => {
      //given
      const useIngredient = jest.spyOn(ingredients, "useIngredient");
      //when
      pizzaList.addPizza(pizza, price);
      ingredients.addIngredient(ingredient, quantity);
      cookPizza.reserveIngredients(pizza.id, quantity);
      //then
      expect(useIngredient).toBeCalled();
    });
    it("Ingredients needed to make pizza should dissapear from ingredient list", () => {
      //when
      pizzaList.addPizza(pizza, price);
      ingredients.addIngredient(ingredient, quantity);
      cookPizza.reserveIngredients(pizza.id, quantity);
      //then
      expect(ingredients).toMatchSnapshot();
    });
  });
  describe("When trying to count price and given pizza does not exists in pizza list", () => {
    it("It should throw an exception", () => {
      //given
      const pizzas: Map<string, number> = new Map().set(pizza.id, quantity);
      //then
      expect(() => cookPizza.countPrice(pizzas)).toThrow();
    });
  });
  describe("When trying to count price and everything went well", () => {
    it("It should return a number", () => {
      //given
      const pizzas: Map<string, number> = new Map().set(pizza.id, quantity);
      //when
      pizzaList.addPizza(pizza, price);
      //then
      expect(cookPizza.countPrice(pizzas)).toBe(price);
    });
    it("getPizza method from pizza list should be called", () => {
      //given
      const pizzas: Map<string, number> = new Map().set(pizza.id, quantity);
      const getPizza = jest.spyOn(pizzaList, "getPizza");
      //when
      pizzaList.addPizza(pizza, price);
      cookPizza.countPrice(pizzas);
      //then
      expect(getPizza).toBeCalled();
    });
  });
});
