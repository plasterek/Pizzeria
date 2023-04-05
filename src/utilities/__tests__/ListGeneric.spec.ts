import { List } from "../ListGeneric.service";
import { IGenericObject, TGenericProperty, IGenericListObject } from "../models/Generics.model";
import * as removeItem from "../../utilities/removeItemFromArray";

describe("List generic class", () => {
  //given
  const object: IGenericObject = { id: "id" };
  const property: TGenericProperty = "string";
  let list = new List();
  beforeEach(() => {
    list = new List();
    jest.clearAllMocks();
  });
  describe("When trying to add object with property", () => {
    it("It should appear in item list", () => {
      //when
      list.add(object, property);
      //then
      expect(list).toMatchSnapshot();
    });
  });
  describe("When trying to delete object and object does not exist in list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => list.delete(object)).toThrow();
    });
  });
  describe("When trying to delete object and everything went well", () => {
    it("getObjectById method should be caled", () => {
      //given
      const get = jest.spyOn(list, "getObjectById");
      //when
      list.add(object, property);
      list.delete(object);
      //then
      expect(get).toBeCalled();
    });
    it("Object should dissapear from list", () => {
      //when
      list.add(object, property);
      list.delete(object);
      //then
      expect(list).toMatchSnapshot();
    });
    it("removeItemFromArray function should be called", () => {
      //given
      const remove = jest.spyOn(removeItem, "removeItemFromArray");
      //when
      list.add(object, property);
      list.delete(object);
      //then
      expect(remove).toBeCalled();
    });
  });
  describe("When trying to get list", () => {
    it("It should return an array", () => {
      //then
      expect(list.getList()).toMatchObject([]);
    });
  });
  describe("When trying to get object by Id and object does not exist in list", () => {
    it("It should return undefined", () => {
      //then
      expect(list.getObjectById(object.id)).toBe(undefined);
    });
  });
  describe("When trying to get object by Id and everything goes well", () => {
    it("It should return given object with property", () => {
      const expectedResult: IGenericListObject<IGenericObject, TGenericProperty> = { object, property };
      //when
      list.add(object, property);
      //then
      expect(list.getObjectById(object.id)).toMatchObject(expectedResult);
    });
  });
});
