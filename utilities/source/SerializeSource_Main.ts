//import { AsyncResource } from "async_hooks";
import { Worker } from "worker_threads";
import { randomUUID } from "crypto";

import type {
  SourceFileStructure
} from "ts-morph";

import type {
  SerializeRequest,
  SerializeResponse
} from "./_types/SerializeSourceMessages.js";

type PromiseResolver<T> = (value: T | PromiseLike<T>) => unknown;
type PromiseRejecter = (reason?: unknown) => unknown;

class Deferred<T>
{
  resolve: PromiseResolver<T>;
  reject: PromiseRejecter;
  promise: Promise<T>;

  constructor()
  {
    this.resolve = (value): void => {
      void(value);
    };
    this.reject = (reason): void => {
      throw reason;
    }
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}

const baseWorker = new Worker(new URL("./SerializeSource_Thread.js", import.meta.url));
baseWorker.on("message", (response: SerializeResponse): void => {
  const deferred = TaskMap.get(response.token)!;
  if (response.success) {
    deferred.resolve(response.source);
  }
  else {
    deferred.reject(response.error);
  }
});
baseWorker.on("error", console.error);
baseWorker.on("exit", (exitCode) => console.log("thread exited with code " + exitCode));

const TaskMap = new Map<SerializeRequest["token"], Deferred<string>>;

export default async function SerializeSource(
  absolutePathToFile: string,
  structure: SourceFileStructure,
): Promise<string>
{
  const request: SerializeRequest = {
    command: "serializeSource",
    token: randomUUID(),
    isRequest: true,
    absolutePathToFile,
    structure,
  };

  const deferred = new Deferred<string>;
  TaskMap.set(request.token, deferred);
  baseWorker.postMessage(request);
  return deferred.promise;
}
