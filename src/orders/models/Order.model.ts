import { IGenericListObject } from "../../utilities/models/Generics.model";

export interface IOrder {
  readonly id: string;
  pizzaWithQuantity: Map<string, number>;
  tableId: string;
  cookId: string;
}

export type TOrderWithWaiterId = IGenericListObject<IOrder, string>;
