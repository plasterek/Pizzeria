import { PizzaList } from "../PizzaList.service";
import { IPizza, TPizzaWithPrice } from "../models/Pizza.model";

describe("PizzaList class", () => {
  //given
  const pizza: IPizza = { id: "1", name: "pizza", ingredients: new Map().set("ingredient", 1) };
  const price: number = 100;
  let pizzaList = new PizzaList();

  beforeEach(() => {
    pizzaList = new PizzaList();
    jest.clearAllMocks();
  });

  describe("When trying to add new pizza and pizza already exists in list", () => {
    it("It should throw an exception", () => {
      //when
      pizzaList.addPizza(pizza, price);
      //then
      expect(() => pizzaList.addPizza(pizza, price)).toThrow();
    });
  });
  describe("When trying to add new pizza and everything went well", () => {
    it("add method from should be called", () => {
      //given
      const add = jest.spyOn(pizzaList, "add");
      //when
      pizzaList.addPizza(pizza, price);
      //then
      expect(add).toBeCalled();
    });
    it("given pizza should appear on list with given price", () => {
      //when
      pizzaList.addPizza(pizza, price);
      //then
      expect(pizzaList).toMatchSnapshot();
    });
  });
  describe("When trying to delete pizza and pizza does not exists in list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => pizzaList.deletePizza(pizza)).toThrow();
    });
  });
  describe("When trying to delete pizza and everything went well", () => {
    it("delete method should be called", () => {
      //given
      const deletePizza = jest.spyOn(pizzaList, "delete");
      //when
      pizzaList.addPizza(pizza, price);
      pizzaList.deletePizza(pizza);
      //then
      expect(deletePizza).toBeCalled();
    });
    it("Given pizza should be removed from pizza list", () => {
      //when
      pizzaList.addPizza(pizza, price);
      pizzaList.deletePizza(pizza);
      //then
      expect(pizzaList).toMatchSnapshot();
    });
  });
  describe("When trying to get pizza and pizza does not exists on pizza list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => pizzaList.getPizza(pizza.id)).toThrow();
    });
  });
  describe("When trying to get pizza and everything went well", () => {
    it("It should return pizza with price", () => {
      //given
      const expectedResult: TPizzaWithPrice = { object: pizza, property: price };
      //when
      pizzaList.addPizza(pizza, price);
      //then
      expect(pizzaList.getPizza(pizza.id)).toMatchObject(expectedResult);
    });
    it("getObjectById method should be called", () => {
      //given
      const get = jest.spyOn(pizzaList, "getObjectById");
      //when
      pizzaList.addPizza(pizza, price);
      pizzaList.getPizza(pizza.id);
      //then
      expect(get).toBeCalled();
    });
  });
});
