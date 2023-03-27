import { TStatus } from "../../utilities/models/Status.model";
import { IGenericListObject } from "../../utilities/models/Generics.model";

export interface ITable {
  readonly id: string;
  readonly number: number;
  readonly numberOfSeats: number;
}

export type ITableWithStatus = IGenericListObject<ITable, TStatus>;
