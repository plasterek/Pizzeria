import { List } from "../utilities/ListGeneric.service";
import { IWorker, IWorkerWithStatus, TOccupation } from "./models/Worker.model";
import { TStatus } from "../utilities/models/Status.model";

export class WorkerList extends List<IWorker, TStatus> {
  public addWorker(worker: IWorker): void {
    try {
      const workerExist = this.getObjectById(worker.id);
      if (workerExist) {
        throw new Error();
      }
      const status: TStatus = "available";
      this.add(worker, status);
    } catch (err: any) {
      throw new Error("Worker already exist");
    }
  }
  public removeWorker(worker: IWorker): void {
    try {
      this.delete(worker);
    } catch (err: any) {
      throw new Error("Worker does not exist");
    }
  }
  getWorker(workerId: string): IWorkerWithStatus {
    try {
      const workerExist: IWorkerWithStatus | undefined = this.getObjectById(workerId);
      if (!workerExist) {
        throw new Error();
      }
      return workerExist;
    } catch (err: any) {
      throw new Error("Worker does not exist");
    }
  }
  public findAvailableWorkers(occupation: TOccupation): IWorkerWithStatus[] | false {
    const occupationWorkers: IWorkerWithStatus[] = this.getList().filter(
      (worker) => worker.object.occupation === occupation
    );
    if (occupationWorkers.length === 0) {
      return false;
    }
    const availableWorkers: IWorkerWithStatus[] = occupationWorkers.filter((worker) => worker.property === "available");
    if (availableWorkers.length === 0) {
      return false;
    }
    return availableWorkers;
  }
  public changeWorkerStatus(workerId: string): void {
    try {
      const workerExist: IWorkerWithStatus | undefined = this.getObjectById(workerId);
      if (!workerExist) {
        throw new Error();
      }
      if (workerExist.property === "available") {
        workerExist.property = "unavailable";
        return;
      }
      workerExist.property = "available";
    } catch (err: any) {
      throw new Error("Worker does not exist");
    }
  }
}
