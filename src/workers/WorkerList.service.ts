import { List } from "../utilities/ListGeneric.service";
import { IWorker, IWorkerWithStatus, Occupation } from "./models/Worker.model";
import { Status } from "../utilities/models/Status.model";
import { WorkerListException } from "./exceptions/WorkerList.exception";

export class WorkerList extends List<IWorker, Status> {
  public addWorker(worker: IWorker): void {
    try {
      const workerExist = this.getObjectById(worker.id);
      if (workerExist) {
        throw new Error();
      }
      const status: Status = Status.available;
      this.add(worker, status);
    } catch (err: any) {
      throw new WorkerListException("Worker already exist");
    }
  }
  public removeWorker(worker: IWorker): void {
    try {
      this.delete(worker);
    } catch (err: any) {
      throw new WorkerListException("Worker does not exist");
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
      throw new WorkerListException("Worker does not exist");
    }
  }
  public findAvailableWorkers(occupation: Occupation): IWorkerWithStatus[] | false {
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
      if (workerExist.property === Status.available) {
        workerExist.property = Status.unavailable;
        return;
      }
      workerExist.property = Status.available;
    } catch (err: any) {
      throw new WorkerListException("Worker does not exist");
    }
  }
}
