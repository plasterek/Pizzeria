import { WorkerList } from "../WorkerList.service";
import { IWorker, Occupation, IWorkerWithStatus } from "../models/Worker.model";
import { Status } from "../../utilities/models/Status.model";

describe("WorkerList class", () => {
  //given
  const occupation: Occupation = Occupation.waiter;
  const worker: IWorker = {
    id: "workerId",
    name: "name",
    occupation: occupation,
  };
  let workerList: WorkerList = new WorkerList();
  beforeEach(() => {
    workerList = new WorkerList();
    jest.clearAllMocks();
  });
  describe("When trying to add worker and worker already exist in list", () => {
    it("It should throw an exception", () => {
      //when
      workerList.addWorker(worker);
      //then
      expect(() => workerList.addWorker(worker)).toThrow();
    });
  });
  describe("When trying to add worker and everything goes well", () => {
    it("Worker should appear in list", () => {
      //when
      workerList.addWorker(worker);
      //then
      expect(workerList).toMatchSnapshot();
    });
  });
  describe("When trying to remove worker and worker does not exist in list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => workerList.removeWorker(worker)).toThrow();
    });
  });
  describe("When trying to remove worker and everything goes well", () => {
    it("delete method should be called", () => {
      //given
      const deleteWorker = jest.spyOn(workerList, "delete");
      //when
      workerList.addWorker(worker);
      workerList.removeWorker(worker);
      //then
      expect(deleteWorker).toBeCalled();
    });
    it("Given worker should dissapear from list", () => {
      //when
      workerList.addWorker(worker);
      workerList.removeWorker(worker);
      //then
      expect(workerList).toMatchSnapshot();
    });
  });
  describe("When trying to get worker and worker does not exist in list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => workerList.getWorker(worker.id)).toThrow();
    });
  });
  describe("When trying to get worker and everything goes well", () => {
    it("It should return worker with status", () => {
      //given
      const expectedResult: IWorkerWithStatus = { object: worker, property: Status.available };
      //when
      workerList.addWorker(worker);
      //then
      expect(workerList.getWorker(worker.id)).toMatchObject(expectedResult);
    });
  });
  describe("When trying to find available workers and there are no workers from given occupation in list", () => {
    it("It should return with false", () => {
      //then
      expect(workerList.findAvailableWorkers(occupation)).toBe(false);
    });
  });
  describe("When trying to find available workers and there are no availabe workers from given occupation", () => {
    it("It should return with false", () => {
      //given
      const cook: IWorker = {
        id: "workerId",
        name: "name",
        occupation: Occupation.cook,
      };
      //when
      workerList.addWorker(cook);
      //then
      expect(workerList.findAvailableWorkers(occupation)).toBe(false);
    });
  });
  describe("When trying to find available workers and everything goes well", () => {
    it("It should return array with available workers", () => {
      //given
      const expectedResult: IWorkerWithStatus[] = [{ object: worker, property: Status.available }];
      //when
      workerList.addWorker(worker);
      //then
      expect(workerList.findAvailableWorkers(occupation)).toMatchObject(expectedResult);
    });
    it("getList method should be called", () => {
      //given
      const get = jest.spyOn(workerList, "getList");
      //when
      workerList.addWorker(worker);
      workerList.findAvailableWorkers(occupation);
      //then
      expect(get).toBeCalled();
    });
  });
  describe("When trying to change worker status and worker does not exist in list", () => {
    it("It should throw an exception", () => {
      //then
      expect(() => workerList.changeWorkerStatus(worker.id)).toThrow();
    });
  });
  describe("When trying to change worker status and worker has available status", () => {
    it("It should change given worker status to unavailable", () => {
      //when
      workerList.addWorker(worker);
      workerList.changeWorkerStatus(worker.id);
      const workerFromList: IWorkerWithStatus = workerList.getWorker(worker.id);
      //then
      expect(workerFromList.property).toBe(Status.unavailable);
    });
  });
  describe("When trying to change worker status and worker has unavailable status", () => {
    it("It should change given worker status to available", () => {
      //when
      workerList.addWorker(worker);
      workerList.changeWorkerStatus(worker.id);
      workerList.changeWorkerStatus(worker.id);
      const workerFromList: IWorkerWithStatus = workerList.getWorker(worker.id);
      //then
      expect(workerFromList.property).toBe(Status.available);
    });
  });
});
