export interface IGenericObject {
  id: string;
}

export type TGenericProperty = number | string;

export interface IGenericListObject<
  T extends IGenericObject,
  K extends TGenericProperty
> {
  object: T;
  property: K;
}
