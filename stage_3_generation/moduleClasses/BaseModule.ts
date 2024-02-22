import path from "path";

import {
  ImportManager,
  SourceFileImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  pathToModule
} from "#utilities/source/AsyncSpecModules.js";

import { distDir } from "../build/constants.js";

import {
  publicExports,
  internalExports
} from "./ExportsModule.js";

export default
abstract class BaseModule
{
  readonly defaultExportName: string;

  readonly sourceFile: SourceFileImpl;
  readonly importsManager: ImportManager;

  public abstract saveFile(): Promise<void>;

  constructor(
    pathToParentDirectory: string,
    defaultExportName: string
  )
  {
    this.sourceFile = new SourceFileImpl;
    this.defaultExportName = defaultExportName;

    this.importsManager = new ImportManager(
      path.join(
        pathToModule(distDir, pathToParentDirectory), defaultExportName + ".ts"
      )
    );
  }

  static readonly #importsEnum = {
    "ts-morph": "ts-morph",
    "public": publicExports.absolutePathToExportFile,
    "internal": internalExports.absolutePathToExportFile,
  };

  public addImports(
    fromModule: "ts-morph" | "public" | "internal",
    values: string[],
    types: string[]
  ): void
  {
    const pathToImportedModule: string = BaseModule.#importsEnum[fromModule];
    const isPackageImport = fromModule === "ts-morph";

    if (values.length > 0) {
      this.importsManager.addImports({
        pathToImportedModule,
        isPackageImport,
        isDefaultImport: false,
        isTypeOnly: false,
        importNames: values
      });
    }

    if (types.length > 0) {
      this.importsManager.addImports({
        pathToImportedModule,
        isPackageImport,
        isDefaultImport: false,
        isTypeOnly: true,
        importNames: types
      });
    }
  }

  public addToExport(
    isPublic: boolean,
    defaultExportName: string,
    values: string[],
    types: string[]
  ): void
  {
    const exportManager = isPublic ? publicExports : internalExports;
    if (defaultExportName) {
      exportManager.addExports({
        pathToExportedModule: this.importsManager.absolutePathToModule,
        isDefaultExport: true,
        exportNames: [defaultExportName],
        isType: false
      });
    }

    if (values.length) {
      exportManager.addExports({
        pathToExportedModule: this.importsManager.absolutePathToModule,
        isDefaultExport: false,
        exportNames: values,
        isType: false
      });
    }

    if (types.length) {
      exportManager.addExports({
        pathToExportedModule: this.importsManager.absolutePathToModule,
        isDefaultExport: false,
        exportNames: types,
        isType: true
      });
    }
  }
}
