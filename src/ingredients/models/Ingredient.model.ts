import { IGenericListObject } from "../../utilities/models/Generics.model";

export type TIngredientWithQuantity = IGenericListObject<IIngredient, number>;

export interface IIngredient {
  readonly id: string;
  readonly name: string;
}
