import { IGenericListObject } from "../../utilities/models/Generics.model";
import { TStatus } from "../../utilities/models/Status.model";

export interface IWorker {
  readonly id: string;
  readonly name: string;
  readonly occupation: TOccupation;
}

export type IWorkerWithStatus = IGenericListObject<IWorker, TStatus>;

export type TOccupation = "waiter" | "cook";
