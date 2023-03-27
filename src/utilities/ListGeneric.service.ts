import {
  IGenericObject,
  TGenericProperty,
  IGenericListObject,
} from "./models/Generics.model";
import { removeItemFromArray } from "./removeItemFromArray";

export class List<T extends IGenericObject, K extends TGenericProperty> {
  private list: IGenericListObject<T, K>[] = [];

  public add(object: T, property: K): void {
    this.list.push({ object, property });
  }
  public delete(object: T): void {
    const itemExist: IGenericListObject<T, K> | undefined = this.getObjectById(
      object.id
    );
    if (!itemExist) {
      throw new Error();
    }
    removeItemFromArray(this.list, itemExist);
  }
  getList(): IGenericListObject<T, K>[] {
    return this.list;
  }
  public getObjectById(objectId: string): IGenericListObject<T, K> | undefined {
    const objectExist: IGenericListObject<T, K> | undefined = this.list.find(
      (element) => element.object.id === objectId
    );
    return objectExist;
  }
}
