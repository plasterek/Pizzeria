import { IGenericListObject } from "../../utilities/models/Generics.model";
import { Status } from "../../utilities/models/Status.model";

export interface IWorker {
  readonly id: string;
  readonly name: string;
  readonly occupation: Occupation;
}

export type IWorkerWithStatus = IGenericListObject<IWorker, Status>;

export enum Occupation {
  waiter = "waiter",
  cook = "cook",
}
