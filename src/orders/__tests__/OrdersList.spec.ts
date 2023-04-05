import { IOrder } from "../models/Order.model";
import { OrdersList } from "../OrdersList.service";
import * as removeItemFromArray from "../../utilities/removeItemFromArray";

describe("Orders list class", () => {
  //given
  const waiterId: string = "1";
  const pizza: Map<string, number> = new Map().set("pizza", 1);
  const order: IOrder = { id: "orderId", pizzaWithQuantity: pizza, tableId: "tableId", cookId: "cookId" };
  let ordersList = new OrdersList();
  beforeEach(() => {
    ordersList = new OrdersList();
    jest.clearAllMocks();
  });
  describe("When trying to add an order and order already exist on list", () => {
    it("It should throw an exception", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      //then
      expect(() => ordersList.makeOrder(order, waiterId)).toThrow();
    });
  });
  describe("When trying to add an order and everything went well", () => {
    it("Order should appear on order list", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      //then
      expect(ordersList).toMatchSnapshot();
    });
    it("getObjectById method should be called", () => {
      //given
      const getObject = jest.spyOn(ordersList, "getObjectById");
      //when
      ordersList.makeOrder(order, waiterId);
      //then
      expect(getObject).toBeCalled();
    });
    it("add method should be called", () => {
      //given
      const add = jest.spyOn(ordersList, "add");
      //when
      ordersList.makeOrder(order, waiterId);
      //then
      expect(add).toBeCalled();
    });
  });
  describe("When trying to get list of pizzas waiting in que", () => {
    it("It should return array with IDs or empty array", () => {
      //given
      const getPizzas: string[] = ordersList.getWaitingPizzas();
      //then
      expect(getPizzas).toMatchSnapshot();
    });
  });
  describe("When trying to add order to waitlist and order does not exist in orders list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => ordersList.addToWaitList(order.id)).toThrow();
    });
  });
  describe("When trying to add order to waitlist and order was already added to waitlist", () => {
    it("It should throw an exception", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToWaitList(order.id);
      //then
      expect(() => ordersList.addToWaitList(order.id)).toThrow();
    });
  });
  describe("When trying to add order to waitlist and everything went well", () => {
    it("order id should be added to waitlist", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToWaitList(order.id);
      //then
      expect(ordersList.getWaitingPizzas().length).toBeGreaterThan(0);
    });
    it("getObjectById method should be called", () => {
      //given
      const getObject = jest.spyOn(ordersList, "getObjectById");
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToWaitList(order.id);
      //then
      expect(getObject).toBeCalled();
    });
  });
  describe("When trying to add order to realization and order does not exist on orders list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => ordersList.addToRealisation(order.id)).toThrow();
    });
  });
  describe("When trying to add order to realization and order was already added to realization", () => {
    it("It should throw an exception", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToRealisation(order.id);
      //then
      expect(() => ordersList.addToRealisation(order.id)).toThrow();
    });
  });
  describe("When trying to add order to realization and order was already added to waitlist", () => {
    it("Order id should be removed from waitlist", () => {
      //given
      const waitList: string[] = ordersList.getWaitingPizzas();
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToWaitList(order.id);
      ordersList.addToRealisation(order.id);
      //then
      expect(waitList).toMatchSnapshot();
    });
    it("removeItemFromArray function should be called", () => {
      //given
      const remove = jest.spyOn(removeItemFromArray, "removeItemFromArray");
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToWaitList(order.id);
      ordersList.addToRealisation(order.id);
      //then
      expect(remove).toBeCalled();
    });
  });
  describe("When trying to add order to realization and everything went well", () => {
    it("Order id should be added to orders in realization list", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToRealisation(order.id);
      //then
      expect(ordersList).toMatchSnapshot();
    });
  });
  describe("When trying to finish order and order does not exist on order list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => ordersList.finishOrder(order.id)).toThrow();
    });
  });
  describe("When trying to finish order and order was already finished", () => {
    it("It should throw an exception", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToRealisation(order.id);
      ordersList.finishOrder(order.id);
      //then
      expect(() => ordersList.finishOrder(order.id)).toThrow();
    });
  });
  describe("When trying to finish order and everything went well", () => {
    it("removeItemFromArray function should be called", () => {
      //given
      const remove = jest.spyOn(removeItemFromArray, "removeItemFromArray");
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToRealisation(order.id);
      ordersList.finishOrder(order.id);
      //then
      expect(remove).toBeCalled();
    });
    it("Given order id should be removed from realization list and appear in finished list", () => {
      //when
      ordersList.makeOrder(order, waiterId);
      ordersList.addToRealisation(order.id);
      ordersList.finishOrder(order.id);
      //then
      expect(ordersList).toMatchSnapshot();
    });
  });
});
