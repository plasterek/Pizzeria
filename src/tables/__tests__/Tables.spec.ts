import { TableList } from "../Tables.service";
import { ITable, ITableWithStatus } from "../models/Table.model";
import { Status } from "../../utilities/models/Status.model";

describe("TableList class", () => {
  //given
  const tableId: string = "tableId";
  const tableNumber: number = 1;
  const numberOfSeats: number = 5;
  const table: ITable = {
    id: tableId,
    number: tableNumber,
    numberOfSeats: numberOfSeats,
  };
  let tables = new TableList();
  beforeEach(() => {
    tables = new TableList();
    jest.clearAllMocks();
  });
  describe("When trying to add table and table already exists in list", () => {
    it("It should throw an exception", () => {
      //when
      tables.addTable(table);
      //then
      expect(() => tables.addTable(table)).toThrow();
    });
  });
  describe("When trying to add table and everything went well", () => {
    it("Given table should appear on table list", () => {
      //when
      tables.addTable(table);
      //then
      expect(tables).toMatchSnapshot();
    });
    it("Given table status should be set to 'available'", () => {
      //given
      const status: Status = Status.available;
      //when
      tables.addTable(table);
      const tableFromList: ITableWithStatus = tables.getTable(table.id);
      //then
      expect(tableFromList.property).toBe(status);
    });
    it("getObjectById method should be called", () => {
      //given
      const get = jest.spyOn(tables, "getObjectById");
      //when
      tables.addTable(table);
      //then
      expect(get).toBeCalled();
    });
    it("add method should be called", () => {
      //given
      const add = jest.spyOn(tables, "add");
      //when
      tables.addTable(table);
      //then
      expect(add).toBeCalled();
    });
  });
  describe("When trying to remove table and table does not exist in table list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => tables.removeTable(table)).toThrow();
    });
  });
  describe("When trying to remove table and everything went well", () => {
    it("delete method should be called", () => {
      //given
      const deleteTable = jest.spyOn(tables, "delete");
      //when
      tables.addTable(table);
      tables.removeTable(table);
      //then
      expect(deleteTable).toBeCalled();
    });
    it("Given table should dissapear from table list", () => {
      //when
      tables.addTable(table);
      tables.removeTable(table);
      //then
      expect(tables).toMatchSnapshot();
    });
  });
  describe("When trying to change table status and table does not exist in table list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => tables.changeTableStatus(table.id)).toThrow();
    });
  });
  describe("When trying to change table status and given table status was 'available'", () => {
    it("Given table status should change to 'unavailable'", () => {
      //given
      const status: Status = Status.unavailable;
      //when
      tables.addTable(table);
      tables.changeTableStatus(table.id);
      const tableFromList: ITableWithStatus = tables.getTable(table.id);
      //then
      expect(tableFromList.property).toBe(status);
    });
  });
  describe("When trying to change table status and given table status was 'unavailable'", () => {
    it("Given table status should change to 'available'", () => {
      //given
      const status: Status = Status.available;
      //when
      tables.addTable(table);
      tables.changeTableStatus(table.id);
      tables.changeTableStatus(table.id);
      const tableFromList: ITableWithStatus = tables.getTable(table.id);
      //then
      expect(tableFromList.property).toBe(status);
    });
  });
  describe("When trying to find free table with specified number of seats and there are no available tables with given number of seats", () => {
    it("It should throw an exception", () => {
      //given
      const numberOfPeople: number = numberOfSeats + 1;
      //when
      tables.addTable(table);
      //then
      expect(() => tables.findFreeTable(numberOfPeople)).toThrow();
    });
  });
  describe("When trying to find free table with specified number of seats and there are no available tables with any number of seats", () => {
    it("It should throw an exception", () => {
      //given
      const numberOfPeople: number = numberOfSeats;
      //then
      expect(() => tables.findFreeTable(numberOfPeople)).toThrow();
    });
  });
  describe("When trying to find free table with specified number of seats and everything went well", () => {
    it("It returns array with available tables", () => {
      //given
      const numberOfPeople: number = numberOfSeats;
      //when
      tables.addTable(table);
      //then
      expect(tables.findFreeTable(numberOfPeople)).toMatchSnapshot();
    });
  });
  describe("When trying to get table and table does not exist in table list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => tables.getTable(table.id)).toThrow();
    });
  });
  describe("When trying to get table and everything went well", () => {
    it("It should return table with status", () => {
      //when
      tables.addTable(table);
      //then
      expect(tables.getTable(table.id)).toMatchSnapshot();
    });
    it("getObjectById method should be called", () => {
      //given
      const get = jest.spyOn(tables, "getObjectById");
      //when
      tables.addTable(table);
      tables.getTable(table.id);
      //then
      expect(get).toBeCalled();
    });
  });
});
