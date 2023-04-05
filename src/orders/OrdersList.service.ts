import { List } from "../utilities/ListGeneric.service";
import { removeItemFromArray } from "../utilities/removeItemFromArray";
import { IOrder, TOrderWithWaiterId } from "./models/Order.model";
import { OrdersListException } from "./exceptions/OrdersList.exception";

export class OrdersList extends List<IOrder, string> {
  readonly waiting: string[] = [];
  readonly inRealization: string[] = [];
  readonly finished: string[] = [];

  public makeOrder(order: IOrder, waiterId: string): void {
    try {
      const orderExist: TOrderWithWaiterId | undefined = this.getObjectById(order.id);
      if (orderExist) {
        throw new Error("Order already exist");
      }
      this.add(order, waiterId);
    } catch (err: any) {
      throw new OrdersListException(err.message);
    }
  }
  public getWaitingPizzas(): string[] {
    return this.waiting;
  }
  public addToWaitList(orderId: string): void {
    try {
      const orderExist: TOrderWithWaiterId | undefined = this.getObjectById(orderId);
      if (!orderExist) {
        throw new Error("Order does not exist");
      }
      const waiting: boolean = this.checkIfOrderExistInList(orderId, this.waiting);
      if (waiting) {
        throw new Error("Order already waiting for realization");
      }
      this.waiting.push(orderId);
    } catch (err: any) {
      throw new OrdersListException(err.message);
    }
  }
  public addToRealisation(orderId: string): void {
    try {
      const orderExist: TOrderWithWaiterId | undefined = this.getObjectById(orderId);
      if (!orderExist) {
        throw new Error("Order does not exist");
      }
      const inRealization: boolean = this.checkIfOrderExistInList(orderId, this.inRealization);
      if (inRealization) {
        throw new Error("Order already in realization");
      }
      const waiting: boolean = this.checkIfOrderExistInList(orderId, this.waiting);
      if (waiting) {
        removeItemFromArray(this.waiting, orderId);
      }
      this.inRealization.push(orderId);
    } catch (err: any) {
      throw new OrdersListException(err.message);
    }
  }
  public finishOrder(orderId: string): void {
    try {
      const orderExist: TOrderWithWaiterId | undefined = this.getObjectById(orderId);
      if (!orderExist) {
        throw new Error("Order does not exist");
      }
      const finished: boolean = this.checkIfOrderExistInList(orderId, this.finished);
      if (finished) {
        throw new Error("Order already finished");
      }
      const inRealization: boolean = this.checkIfOrderExistInList(orderId, this.inRealization);
      if (!inRealization) {
        throw new Error("Order was not in realization");
      }
      removeItemFromArray(this.inRealization, orderId);
      this.finished.push(orderId);
    } catch (err: any) {
      throw new OrdersListException(err.message);
    }
  }
  private checkIfOrderExistInList(orderId: string, list: string[]): boolean {
    const order = list.find((element) => element === orderId);
    if (order) {
      return true;
    }
    return false;
  }
}
