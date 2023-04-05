import { IOrder } from "../orders/models/Order.model";
import { OrdersList } from "../orders/OrdersList.service";
import { TOrderWithWaiterId } from "../orders/models/Order.model";
import { PizzaList } from "../pizzas/PizzaList.service";
import { ITableWithStatus } from "../tables/models/Table.model";
import { TableList } from "../tables/Tables.service";
import { IWorkerWithStatus, Occupation } from "../workers/models/Worker.model";
import { WorkerList } from "../workers/WorkerList.service";
import { v4 as newId } from "uuid";
import { IngredientsList } from "../ingredients/IngredientsList.service";
import { CookPizza } from "../pizzas/CookPizza.service";
import { PizzeriaException } from "./exceptions/Pizzeria.exception";

export class Pizzeria {
  private readonly cooking: CookPizza;
  constructor(
    private readonly workers: WorkerList,
    private readonly tables: TableList,
    private readonly pizzaList: PizzaList,
    private readonly orders: OrdersList,
    private readonly ingredients: IngredientsList
  ) {
    this.cooking = new CookPizza(this.pizzaList, this.ingredients);
  }
  public makeTakeOutOrder(pizzas: Map<string, number>): number {
    try {
      const waiter: IWorkerWithStatus | false = this.getAvailableWorker(Occupation.waiter);
      if (!waiter) {
        throw new Error("No waiter available to take order");
      }
      const cook: IWorkerWithStatus | false = this.getAvailableWorker(Occupation.cook);
      const order: IOrder = { id: newId(), tableId: "0", cookId: "0", pizzaWithQuantity: pizzas };
      if (cook) {
        order.cookId = cook.object.id;
        this.orderWhenCookIsAvailable(order, waiter, cook);
        return this.cooking.countPrice(pizzas);
      }
      this.orderWhenCookNotAvailable(order, waiter);
      return this.cooking.countPrice(pizzas);
    } catch (err: any) {
      throw new PizzeriaException(err.message);
    }
  }
  public makeOnSiteOrder(pizzas: Map<string, number>, numberOfPeople: number): number {
    try {
      const waiter: IWorkerWithStatus | false = this.getAvailableWorker(Occupation.waiter);
      if (!waiter) {
        throw new Error("No waiter available to take order");
      }
      const table: ITableWithStatus = this.getAvailableTable(numberOfPeople);
      const cook: IWorkerWithStatus | false = this.getAvailableWorker(Occupation.cook);
      const order: IOrder = { id: newId(), tableId: table.object.id, cookId: "0", pizzaWithQuantity: pizzas };
      if (!cook) {
        this.orderWhenCookNotAvailable(order, waiter);
        this.tables.changeTableStatus(table.object.id);
        return this.cooking.countPrice(pizzas);
      }
      order.cookId = cook.object.id;
      this.orderWhenCookIsAvailable(order, waiter, cook);
      this.tables.changeTableStatus(table.object.id);
      return this.cooking.countPrice(pizzas);
    } catch (err: any) {
      throw new PizzeriaException(err.message);
    }
  }
  public tryToPushWaitingOrder(): void {
    const waitingOrders: string[] = this.orders.getWaitingPizzas();
    if (waitingOrders.length === 0) {
      return;
    }
    const cook: IWorkerWithStatus | false = this.getAvailableWorker(Occupation.cook);
    if (!cook) {
      return;
    }
    const waitingOrderId: string = waitingOrders[0];
    const waitingOrder: TOrderWithWaiterId | undefined = this.orders.getObjectById(waitingOrderId);
    if (waitingOrder) {
      waitingOrder.object.cookId = cook.object.id;
      this.orders.addToRealisation(waitingOrder.object.id);
      this.workers.changeWorkerStatus(cook.object.id);
    }
  }
  public finishOrder(orderId: string): void {
    try {
      const order: TOrderWithWaiterId | undefined = this.orders.getObjectById(orderId);
      if (!order) {
        throw new Error("Order does not exist!");
      }
      this.orders.finishOrder(orderId);
      const waiterId: string = order.property;
      const cookId: string = order.object.cookId;
      const tableId: string = order.object.tableId;
      this.workers.changeWorkerStatus(waiterId);
      this.workers.changeWorkerStatus(cookId);
      if (tableId !== "0") {
        this.tables.changeTableStatus(tableId);
      }
    } catch (err: any) {
      throw new PizzeriaException(err.message);
    }
  }
  private getAvailableWorker(occupation: Occupation): IWorkerWithStatus | false {
    const availableWorkers: IWorkerWithStatus[] | false = this.workers.findAvailableWorkers(occupation);
    if (!availableWorkers) {
      return false;
    }
    const worker: IWorkerWithStatus = availableWorkers[0];
    this.workers.changeWorkerStatus(worker.object.id);
    return worker;
  }
  private getAvailableTable(numberOfPeople: number): ITableWithStatus {
    try {
      const availableTables: ITableWithStatus[] = this.tables.findFreeTable(numberOfPeople);
      const table: ITableWithStatus = availableTables[0];
      this.tables.changeTableStatus(table.object.id);
      return table;
    } catch (err: any) {
      throw new PizzeriaException(err.message);
    }
  }
  private reserveIngredients(pizzas: Map<string, number>) {
    pizzas.forEach((value, key) => {
      this.cooking.reserveIngredients(key, value);
    });
  }
  private orderWhenCookNotAvailable(order: IOrder, waiter: IWorkerWithStatus): void {
    this.reserveIngredients(order.pizzaWithQuantity);
    this.orders.makeOrder(order, waiter.object.id);
    this.orders.addToWaitList(order.id);
    this.workers.changeWorkerStatus(waiter.object.id);
  }
  private orderWhenCookIsAvailable(order: IOrder, waiter: IWorkerWithStatus, cook: IWorkerWithStatus): void {
    this.reserveIngredients(order.pizzaWithQuantity);
    this.orders.makeOrder(order, waiter.object.id);
    this.orders.addToRealisation(order.id);
    this.workers.changeWorkerStatus(cook.object.id);
    this.workers.changeWorkerStatus(waiter.object.id);
  }
}
