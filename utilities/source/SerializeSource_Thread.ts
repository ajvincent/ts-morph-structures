import {
  parentPort
} from "worker_threads";

import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  type ProjectOptions,
  ScriptTarget,
  SourceFileStructure,
} from "ts-morph";

import {
  SerializeRequest,
  SerializeResponse,
} from "./_types/SerializeSourceMessages.js";

const TSC_CONFIG: ProjectOptions = {
  "compilerOptions": {
    "lib": ["es2022"],
    "module": ModuleKind.ESNext,
    "target": ScriptTarget.ESNext,
    "moduleResolution": ModuleResolutionKind.NodeNext,
    "sourceMap": true,
    "declaration": true,
  },
  skipAddingFilesFromTsConfig: true,
  skipFileDependencyResolution: true,
  useInMemoryFileSystem: true,
};

const project = new Project(TSC_CONFIG);

async function serializeSource_child(
  absolutePathToFile: string,
  structure: SourceFileStructure
): Promise<string>
{
  const file = project.createSourceFile(absolutePathToFile, structure);
  const source = file.print();
  await file.deleteImmediately();
  return source;
}

parentPort!.on("message", (message: SerializeRequest): void => {
  const sourcePromise = serializeSource_child(message.absolutePathToFile, message.structure);
  const voidPromise = sourcePromise.then(source => {
    const response: SerializeResponse = {
      command: message.command,
      token: message.token,
      isResponse: true,
      source,
    };
    parentPort?.postMessage(response);
  });
  void(voidPromise);
});
