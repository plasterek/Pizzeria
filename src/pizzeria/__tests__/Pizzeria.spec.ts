import { IngredientsList } from "../../ingredients/IngredientsList.service";
import { IIngredient } from "../../ingredients/models/Ingredient.model";
import { OrdersList } from "../../orders/OrdersList.service";
import { IOrder } from "../../orders/models/Order.model";
import { PizzaList } from "../../pizzas/PizzaList.service";
import { IPizza } from "../../pizzas/models/Pizza.model";
import { TableList } from "../../tables/Tables.service";
import { ITable } from "../../tables/models/Table.model";
import { WorkerList } from "../../workers/WorkerList.service";
import { IWorker, Occupation } from "../../workers/models/Worker.model";
import { Pizzeria } from "../Pizzeria.component";

describe("Pizzeria class", () => {
  //given
  const ingredient: IIngredient = { id: "ingredientId", name: "ingredient" };
  const availableIngredients: number = 10;
  const pizzaIngredients: Map<string, number> = new Map().set(ingredient.id, 1);
  const pizza: IPizza = { id: "pizzaId", name: "pizza", ingredients: pizzaIngredients };
  const pizzaQuantity: number = 1;
  const pizzaPrice: number = 100;
  const orderedPizzas: Map<string, number> = new Map().set(pizza.id, pizzaQuantity);
  const waiter: IWorker = { id: "workerId", name: "workerName", occupation: Occupation.waiter };
  const cook: IWorker = { id: "cookId", name: "cook", occupation: Occupation.cook };
  let workers: WorkerList = new WorkerList();
  let tables: TableList = new TableList();
  let pizzaList: PizzaList = new PizzaList();
  let orders: OrdersList = new OrdersList();
  let ingredients: IngredientsList = new IngredientsList();
  let pizzeria: Pizzeria = new Pizzeria(workers, tables, pizzaList, orders, ingredients);
  beforeEach(() => {
    //given
    workers = new WorkerList();
    tables = new TableList();
    pizzaList = new PizzaList();
    orders = new OrdersList();
    pizzeria = new Pizzeria(workers, tables, pizzaList, orders, ingredients);
    //when
    ingredients.addIngredient(ingredient, availableIngredients);
    pizzaList.addPizza(pizza, pizzaPrice);
    jest.clearAllMocks();
  });
  describe("When trying to make take-out order and there are no waiters available", () => {
    it("It should throw an exception", () => {
      //given
      jest.spyOn(workers, "findAvailableWorkers").mockImplementation(() => false);
      //then
      expect(() => pizzeria.makeTakeOutOrder(orderedPizzas)).toThrow();
    });
  });
  describe("When trying to make take-out order and there are no cooks available", () => {
    it("It should return number equal to ordered pizza price", () => {
      //when
      workers.addWorker(waiter);
      //then
      expect(pizzeria.makeTakeOutOrder(orderedPizzas)).toBe(pizzaPrice);
    });
  });
  describe("When trying to make take-out order and there is cook available", () => {
    it("It should return number equal to ordered pizza price", () => {
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      //then
      expect(pizzeria.makeTakeOutOrder(orderedPizzas)).toBe(pizzaPrice);
    });
  });
  describe("When trying to make on-site order and there are no waiters available", () => {
    it("It should throw an exception", () => {
      //given
      const numberOfPeople: number = 5;
      jest.spyOn(workers, "findAvailableWorkers").mockImplementation(() => false);
      //then
      expect(() => pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople)).toThrow();
    });
  });
  describe("When trying to make on-site order and there are no tables available", () => {
    it("It should throw an exception", () => {
      //given
      const numberOfPeople: number = 5;
      //when
      workers.addWorker(waiter);
      //then
      expect(() => pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople)).toThrow();
    });
  });
  describe("When trying to make on-site order and there is no cook available", () => {
    it("It should return number equal to pizza price", () => {
      //given
      const numberOfPeople: number = 5;
      const table: ITable = { id: "tableId", number: 1, numberOfSeats: numberOfPeople + 1 };
      //when
      workers.addWorker(waiter);
      tables.addTable(table);
      //then
      expect(pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople)).toBe(pizzaPrice);
    });
    it("changeTableStatus method from Tables class should be called", () => {
      //given
      const numberOfPeople: number = 5;
      const table: ITable = { id: "tableId", number: 1, numberOfSeats: numberOfPeople + 1 };
      const changeStatus = jest.spyOn(tables, "changeTableStatus");
      //when
      workers.addWorker(waiter);
      tables.addTable(table);
      pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople);
      //then
      expect(changeStatus).toBeCalled();
    });
  });
  describe("When trying to make on-site order and there is cook available", () => {
    it("It should return number equal to pizza price", () => {
      //given
      const numberOfPeople: number = 5;
      const table: ITable = { id: "tableId", number: 1, numberOfSeats: numberOfPeople + 1 };
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      tables.addTable(table);
      //then
      expect(pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople)).toBe(pizzaPrice);
    });
    it("changeTableStatus method from Tables class should be called", () => {
      //given
      const numberOfPeople: number = 5;
      const table: ITable = { id: "tableId", number: 1, numberOfSeats: numberOfPeople + 1 };
      const changeStatus = jest.spyOn(tables, "changeTableStatus");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      tables.addTable(table);
      pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople);
      //then
      expect(changeStatus).toBeCalled();
    });
  });
  describe("When trying to push waiting order and there are no waiting orders", () => {
    it("It should not throw", () => {
      //then
      expect(() => pizzeria.tryToPushWaitingOrder()).not.toThrow();
    });
    it("getWaitingPizzas method from OrdersList class should be called", () => {
      //given
      const getWaiting = jest.spyOn(orders, "getWaitingPizzas");
      //when
      pizzeria.tryToPushWaitingOrder();
      //then
      expect(getWaiting).toBeCalled();
    });
  });
  describe("When trying to push waiting order and there are no available cooks", () => {
    it("It should not throw", () => {
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      workers.changeWorkerStatus(cook.id);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      //then
      expect(() => pizzeria.tryToPushWaitingOrder()).not.toThrow();
    });
    it("getWaitingPizzas method from OrdersList class should be called", () => {
      //given
      const getWaiting = jest.spyOn(orders, "getWaitingPizzas");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      workers.changeWorkerStatus(cook.id);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      pizzeria.tryToPushWaitingOrder();
      //then
      expect(getWaiting).toBeCalled();
    });
  });
  describe("When trying to push waiting order and there is waiting order and cook available", () => {
    it("It should not throw", () => {
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      workers.changeWorkerStatus(cook.id);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      workers.changeWorkerStatus(cook.id);
      //then
      expect(() => pizzeria.tryToPushWaitingOrder()).not.toThrow();
    });
    it("getWaitingPizzas method from OrdersList class should be called", () => {
      //given
      const getWaiting = jest.spyOn(orders, "getWaitingPizzas");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      workers.changeWorkerStatus(cook.id);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      workers.changeWorkerStatus(cook.id);
      pizzeria.tryToPushWaitingOrder();
      //then
      expect(getWaiting).toBeCalled();
    });
    it("addToRealisation method from OrdersList class should be called", () => {
      //given
      const add = jest.spyOn(orders, "addToRealisation");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      workers.changeWorkerStatus(cook.id);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      workers.changeWorkerStatus(cook.id);
      pizzeria.tryToPushWaitingOrder();
      //then
      expect(add).toBeCalled();
    });
    it("changeWorkerStatus method from Workers class should be called", () => {
      //given
      const changeStatus = jest.spyOn(workers, "changeWorkerStatus");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      workers.changeWorkerStatus(cook.id);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      workers.changeWorkerStatus(cook.id);
      pizzeria.tryToPushWaitingOrder();
      //then
      expect(changeStatus).toBeCalled();
    });
  });
  describe("When trying to finish order and order does not exist in list", () => {
    it("It should throw an exception", () => {
      //given
      const order: IOrder = {
        id: "orderId",
        pizzaWithQuantity: new Map().set(pizza.id, pizzaQuantity),
        tableId: "0",
        cookId: cook.id,
      };
      //then
      expect(() => pizzeria.finishOrder(order.id)).toThrow();
    });
  });
  describe("When trying to finish order and everything goes well", () => {
    it("It should not throw any exception", () => {
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      const orderId: string = orders.inRealization[0];
      //then
      expect(() => pizzeria.finishOrder(orderId)).not.toThrow();
    });
    it("getObjectById from OrdersList class should be called", () => {
      //given
      const get = jest.spyOn(orders, "getObjectById");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      const orderId: string = orders.inRealization[0];
      pizzeria.finishOrder(orderId);
      //then
      expect(get).toBeCalled();
    });
    it("finishOrder from OrdersList class should be called", () => {
      //given
      const finish = jest.spyOn(orders, "finishOrder");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      const orderId: string = orders.inRealization[0];
      pizzeria.finishOrder(orderId);
      //then
      expect(finish).toBeCalled();
    });
    it("changeWorkerStatus from WorkerList class should be called", () => {
      //given
      const changeStatus = jest.spyOn(workers, "changeWorkerStatus");
      //when
      workers.addWorker(waiter);
      workers.addWorker(cook);
      pizzeria.makeTakeOutOrder(orderedPizzas);
      const orderId: string = orders.inRealization[0];
      pizzeria.finishOrder(orderId);
      //then
      expect(changeStatus).toBeCalled();
    });
  });
  describe("When trying to finish order and everything goes well and it was on-site order", () => {
    it("changeTableStatus method from Tables class should be called", () => {
      //given
      const numberOfPeople: number = 5;
      const table: ITable = { id: "tableId", number: 1, numberOfSeats: numberOfPeople + 1 };
      const changeStatus = jest.spyOn(tables, "changeTableStatus");
      //when
      tables.addTable(table);
      workers.addWorker(waiter);
      workers.addWorker(cook);
      pizzeria.makeOnSiteOrder(orderedPizzas, numberOfPeople - 1);
      const orderId: string = orders.inRealization[0];
      //then
      expect(changeStatus).toBeCalled();
    });
  });
});
