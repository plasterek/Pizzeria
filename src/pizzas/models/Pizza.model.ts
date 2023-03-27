import { IGenericListObject } from "../../utilities/models/Generics.model";

export interface IPizza {
  readonly id: string;
  readonly name: string;
  readonly ingredients: Map<string, number>;
}

export type TPizzaWithPrice = IGenericListObject<IPizza, number>;
