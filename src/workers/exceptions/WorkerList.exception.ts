export class WorkerListException {
  constructor(message: string) {
    throw new Error(message);
  }
}
