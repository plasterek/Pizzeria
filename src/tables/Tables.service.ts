import { ITable, ITableWithStatus } from "./models/Table.model";
import { List } from "../utilities/ListGeneric.service";
import { TStatus } from "../utilities/models/Status.model";

export class TableList extends List<ITable, TStatus> {
  public addTable(table: ITable): void {
    try {
      const tableExist: ITableWithStatus | undefined = this.getObjectById(table.id);
      if (tableExist) {
        throw new Error();
      }
      const status: TStatus = "available";
      this.add(table, status);
    } catch (err: any) {
      throw new Error("Table already exist");
    }
  }
  public removeTable(table: ITable): void {
    try {
      this.delete(table);
    } catch (err: any) {
      throw new Error("Table does not exist");
    }
  }
  public changeTableStatus(tableId: string): void {
    try {
      const tableExist: ITableWithStatus | undefined = this.getObjectById(tableId);
      if (!tableExist) {
        throw new Error();
      }
      if (tableExist.property === "available") {
        tableExist.property = "unavailable";
        return;
      }
      tableExist.property = "available";
    } catch (err: any) {
      throw new Error("Table does not exist");
    }
  }
  public findFreeTable(numberOfSeats: number): ITableWithStatus[] {
    try {
      const freeTables: ITableWithStatus[] = this.getList().filter((element) => element.property === "available");
      if (freeTables.length === 0) {
        throw new Error();
      }
      const tablesWithSeats: ITableWithStatus[] = freeTables.filter(
        (element) => element.object.numberOfSeats >= numberOfSeats
      );
      if (tablesWithSeats.length === 0) {
        throw new Error();
      }
      return tablesWithSeats;
    } catch (err: any) {
      throw new Error("No tables available");
    }
  }
  public getTable(tableId: string): ITableWithStatus {
    try {
      const tableExist: ITableWithStatus | undefined = this.getObjectById(tableId);
      if (!tableExist) {
        throw new Error();
      }
      return tableExist;
    } catch (err: any) {
      throw new Error("Table does not exist!");
    }
  }
}
