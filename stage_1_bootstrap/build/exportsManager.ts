import path from "path";

import {
  DefaultMap,
} from "#utilities/source/DefaultMap.js";

import getTS_SourceFile from "#utilities/source/getTS_SourceFile.js";

import {
  ExportDeclarationImpl,
  ExportSpecifierImpl,
  SourceFileImpl,
} from "../prototype-snapshot/exports.js"

import {
  stageDir,
} from "./constants.js";

export interface AddExportContext {
  relativePathToModule: `./${string}.ts`,
  exportNames: readonly string[],
  isDefaultExport: boolean,
  isType: boolean,
}

export class ExportManager
{
  static #compareDeclarations(
    this: void,
    a: [string, ExportDeclarationImpl],
    b: [string, ExportDeclarationImpl],
  ): number
  {
    return a[0].localeCompare(b[0]);
  }

  static #compareSpecifiers(
    this: void,
    a: ExportSpecifierImpl,
    b: ExportSpecifierImpl,
  ): number
  {
    return a.name.localeCompare(b.name);
  }

  readonly #pathToExportFile: string;
  readonly #pathToDeclarationMap = new DefaultMap<string, ExportDeclarationImpl>;

  #committed = false;

  constructor(
    pathToExportFile: string
  )
  {
    this.#pathToExportFile = pathToExportFile;
  }

  addExport(
    context: AddExportContext
  ): void
  {
    if (this.#committed)
      throw new Error("file has been committed");
    const { relativePathToModule, exportNames, isDefaultExport, isType } = context;

    if (isDefaultExport && (exportNames.length !== 1)) {
      throw new Error("at most one default export name");
    }

    const declaration = this.#pathToDeclarationMap.getDefault(
      relativePathToModule, () => this.#buildDeclaration(relativePathToModule)
    );

    const specifiers = exportNames.map(exportName => {
      const specifier = new ExportSpecifierImpl(exportName);
      specifier.isTypeOnly = isType;
      return specifier;
    });

    if (isDefaultExport) {
      specifiers[0].name = "default";
      specifiers[0].alias = exportNames[0];
    }

    if (!isType && declaration.isTypeOnly) {
      declaration.namedExports.forEach((specifier): void => {
        (specifier as ExportSpecifierImpl).isTypeOnly = true;
      });
      declaration.isTypeOnly = false;
    }

    declaration.namedExports.push(...specifiers);
  }

  #buildDeclaration(
    relativePathToModule: string
  ): ExportDeclarationImpl
  {
    const decl = new ExportDeclarationImpl;
    decl.moduleSpecifier = relativePathToModule.replace(/(?<!\.d)\.ts$/, ".js");
    decl.isTypeOnly = true;
    decl.assertElements = undefined;
    return decl;
  }

  async commit(): Promise<void> {
    if (this.#committed)
      throw new Error("file has been committed");
    this.#committed = true;

    const source = new SourceFileImpl;

    const declarationEntries = Array.from(this.#pathToDeclarationMap.entries());
    declarationEntries.sort(ExportManager.#compareDeclarations);

    const declarations = declarationEntries.map(entry => entry[1]);
    declarations.forEach(decl => {
      (decl.namedExports as ExportSpecifierImpl[]).sort(ExportManager.#compareSpecifiers);
    });
    source.statements.push(
      "// This file is generated.  Do not edit.",
      ...declarations
    );

    const sourceFile = getTS_SourceFile(stageDir, path.join("source", this.#pathToExportFile));
    sourceFile.removeText();
    sourceFile.set(source);
    await sourceFile.save();
  }
}

export const InternalExports = new ExportManager("./internal-exports.ts");
export const PublicExports = new ExportManager("./exports.ts");

InternalExports.addExport({
  relativePathToModule: "./exports.ts",
  exportNames: [],
  isDefaultExport: false,
  isType: false,
});
