import { List } from "../utilities/ListGeneric.service";
import { IPizza, TPizzaWithPrice } from "./models/Pizza.model";

export class PizzaList extends List<IPizza, number> {
  public addPizza(pizza: IPizza, price: number): void {
    try {
      const pizzaExist: TPizzaWithPrice | undefined = this.getObjectById(
        pizza.id
      );
      if (pizzaExist) {
        throw new Error();
      }
      this.add(pizza, price);
    } catch (err: any) {
      throw new Error("Pizza already exist");
    }
  }
  public deletePizza(pizza: IPizza): void {
    try {
      this.delete(pizza);
    } catch (err: any) {
      throw new Error("Pizza does not exist");
    }
  }
  public getPizza(pizzaId: string): TPizzaWithPrice {
    try {
      const pizzaExist: TPizzaWithPrice | undefined =
        this.getObjectById(pizzaId);
      if (!pizzaExist) {
        throw new Error();
      }
      return pizzaExist;
    } catch (err: any) {
      throw new Error("Pizza does not exist");
    }
  }
}
