import { IngredientsList } from "../IngredientsList.service";
import { IIngredient, TIngredientWithQuantity } from "../models/Ingredient.model";

describe("Ingredient list class", () => {
  //given
  const ingredient: IIngredient = { id: "1", name: "ingredient" };
  let ingredientList: IngredientsList = new IngredientsList();
  beforeEach(() => {
    ingredientList = new IngredientsList();
    jest.clearAllMocks();
  });
  describe("When trying to add ingredient to an empty list and ingredient do not exist on list", () => {
    it("It should add ingredient to list", () => {
      //when
      ingredientList.addIngredient(ingredient);
      //then
      expect(ingredientList.getList().length).toBeGreaterThan(0);
    });
    it("add method should be called", () => {
      //given
      const addMethod = jest.spyOn(ingredientList, "add");
      //when
      ingredientList.addIngredient(ingredient);
      //then
      expect(addMethod).toBeCalled();
    });
    it("getObjectById method should be called", () => {
      //given
      const getObject = jest.spyOn(ingredientList, "getObjectById");
      //when
      ingredientList.addIngredient(ingredient);
      //then
      expect(getObject).toBeCalled();
    });
  });
  describe("When trying to add ingredient and ingredient already exist on list", () => {
    it("Ingredient quantity should change", () => {
      //when
      ingredientList.addIngredient(ingredient);
      ingredientList.addIngredient(ingredient);
      const ingredientFromList: TIngredientWithQuantity = ingredientList.getIngredient(ingredient.id);
      //then
      expect(ingredientFromList.property).toBeGreaterThan(1);
    });
    it("getObjectById method should be called", () => {
      //given
      const getObject = jest.spyOn(ingredientList, "getObjectById");
      //when
      ingredientList.addIngredient(ingredient);
      //then
      expect(getObject).toBeCalled();
    });
  });
  describe("When trying to delete ingredient from list and ingredient does not exist on list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => ingredientList.deleteIngredient(ingredient)).toThrow();
    });
  });
  describe("When trying to delete ingredient from list and its the only ingredient on a list", () => {
    it("Ingredient list should be empty", () => {
      //when
      ingredientList.addIngredient(ingredient);
      ingredientList.deleteIngredient(ingredient);
      //then
      expect(ingredientList).toMatchSnapshot();
    });
    it("delete method should be called", () => {
      //given
      const deleteMethod = jest.spyOn(ingredientList, "delete");
      //when
      ingredientList.addIngredient(ingredient);
      ingredientList.deleteIngredient(ingredient);
      //then
      expect(deleteMethod).toBeCalled();
    });
  });
  describe("When trying to use ingredient and ingredient does not exist on list", () => {
    it("It should throw exception", () => {
      //then
      expect(() => ingredientList.useIngredient(ingredient.id, 1)).toThrow();
    });
  });
  describe("When trying to use ingredient and amount of ingredients on list is insufficient", () => {
    it("It should throw exception", () => {
      //given
      const availableIngredients: number = 10;
      //when
      ingredientList.addIngredient(ingredient, availableIngredients);
      //then
      expect(() => ingredientList.useIngredient(ingredient.id, availableIngredients + 1)).toThrow();
    });
  });
  describe("When trying to use ingredient and everything went well", () => {
    it("Ingredient quantity should change", () => {
      //given
      const availableIngredients: number = 10;
      //when
      ingredientList.addIngredient(ingredient, availableIngredients);
      ingredientList.useIngredient(ingredient.id, availableIngredients - 5);
      const ingredientFromList: TIngredientWithQuantity = ingredientList.getIngredient(ingredient.id);
      //then
      expect(ingredientFromList.property).not.toBe(availableIngredients);
    });
    it("getObjectById method should be called", () => {
      //given
      const availableIngredients: number = 10;
      const getObject = jest.spyOn(ingredientList, "getObjectById");
      //when
      ingredientList.addIngredient(ingredient, availableIngredients);
      ingredientList.useIngredient(ingredient.id, availableIngredients - 5);
      //then
      expect(getObject).toBeCalled();
    });
  });
  describe("When trying to get ingredient and ingredient does not exist on list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => ingredientList.getIngredient(ingredient.id)).toThrow();
    });
  });
  describe("When trying to get ingredient and everything went well", () => {
    it("It should return ingredient with quantity", () => {
      //given
      const quantity: number = 10;
      //when
      ingredientList.addIngredient(ingredient, quantity);
      const ingredientFromList: TIngredientWithQuantity = ingredientList.getIngredient(ingredient.id);
      //then
      expect(ingredientFromList).toMatchSnapshot();
    });
  });
});
