import { ITable, ITableWithStatus } from "./models/Table.model";
import { List } from "../utilities/ListGeneric.service";
import { Status } from "../utilities/models/Status.model";
import { TablesException } from "./exceptions/Tables.exception";

export class TableList extends List<ITable, Status> {
  public addTable(table: ITable): void {
    try {
      const tableExist: ITableWithStatus | undefined = this.getObjectById(table.id);
      if (tableExist) {
        throw new TablesException("Table already exist");
      }
      const status: Status = Status.available;
      this.add(table, status);
    } catch (err: any) {
      throw new TablesException(err.message);
    }
  }
  public removeTable(table: ITable): void {
    try {
      this.delete(table);
    } catch (err: any) {
      throw new TablesException("Table does not exist");
    }
  }
  public changeTableStatus(tableId: string): void {
    try {
      const tableExist: ITableWithStatus | undefined = this.getObjectById(tableId);
      if (!tableExist) {
        throw new TablesException();
      }
      if (tableExist.property === Status.available) {
        tableExist.property = Status.unavailable;
        return;
      }
      tableExist.property = Status.available;
    } catch (err: any) {
      throw new TablesException("Table does not exist");
    }
  }
  public findFreeTable(numberOfSeats: number): ITableWithStatus[] {
    try {
      const freeTables: ITableWithStatus[] = this.getList().filter((element) => element.property === "available");
      if (freeTables.length === 0) {
        throw new TablesException();
      }
      const tablesWithSeats: ITableWithStatus[] = freeTables.filter(
        (element) => element.object.numberOfSeats >= numberOfSeats
      );
      if (tablesWithSeats.length === 0) {
        throw new TablesException();
      }
      return tablesWithSeats;
    } catch (err: any) {
      throw new TablesException("No tables available");
    }
  }
  public getTable(tableId: string): ITableWithStatus {
    try {
      const tableExist: ITableWithStatus | undefined = this.getObjectById(tableId);
      if (!tableExist) {
        throw new TablesException();
      }
      return tableExist;
    } catch (err: any) {
      throw new TablesException("Table does not exist!");
    }
  }
}
