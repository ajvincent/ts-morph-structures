// #region preamble
import path from "path";

import {
  pathToModule
} from "#utilities/source/AsyncSpecModules.js";

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


// #endregion preamble

export interface AddExportContext {
  absolutePathToModule: string,
  exportNames: readonly string[],
  isDefaultExport: boolean,
  isType: boolean,
}

/**
 * This represents a tool for generating an exports file.
 */
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

  readonly #absolutePathToExportFile: string;
  readonly #pathToDeclarationMap = new DefaultMap<string, ExportDeclarationImpl>;

  #committed = false;

  constructor(
    absolutePathToExportFile: string,
  )
  {
    this.#absolutePathToExportFile = absolutePathToExportFile;
  }

  addExports(
    context: AddExportContext
  ): void
  {
    if (this.#committed)
      throw new Error("file has been committed");

    const { absolutePathToModule, exportNames, isDefaultExport, isType } = context;
    if (!absolutePathToModule.endsWith(".ts"))
      throw new Error("path to module must end with .ts");

    if (isDefaultExport && (exportNames.length !== 1)) {
      throw new Error("at most one default export name");
    }

    const declaration = this.#pathToDeclarationMap.getDefault(
      absolutePathToModule, () => this.#buildDeclaration(absolutePathToModule)
    );

    if (!isType && declaration.isTypeOnly) {
      declaration.namedExports.forEach((specifier): void => {
        (specifier as ExportSpecifierImpl).isTypeOnly = true;
      });
      declaration.isTypeOnly = false;
    }

    const specifiers = exportNames.map(exportName => {
      const specifier = new ExportSpecifierImpl(exportName);
      if (isType && !declaration.isTypeOnly)
        specifier.isTypeOnly = isType;
      return specifier;
    });

    if (isDefaultExport) {
      specifiers[0].name = "default";
      specifiers[0].alias = exportNames[0];
    }


    declaration.namedExports.push(...specifiers);
  }

  #buildDeclaration(
    absolutePathToModule: string
  ): ExportDeclarationImpl
  {
    const decl = new ExportDeclarationImpl;
    decl.moduleSpecifier = "./" + path.relative(
      path.dirname(this.#absolutePathToExportFile),
      absolutePathToModule.replace(/(\.d)?\.(m?)ts$/, ".$2js")
    );
    decl.isTypeOnly = true;
    decl.assertElements = undefined;
    return decl;
  }

  getDeclarations(): ExportDeclarationImpl[] {
    const declarationEntries = Array.from(this.#pathToDeclarationMap.entries());
    declarationEntries.sort(ExportManager.#compareDeclarations);

    const declarations = declarationEntries.map(entry => entry[1]);
    declarations.forEach(decl => {
      (decl.namedExports as ExportSpecifierImpl[]).sort(ExportManager.#compareSpecifiers);
    });

    return declarations;
  }

  async commit(): Promise<void> {
    if (this.#committed)
      throw new Error("file has been committed");
    this.#committed = true;

    const sourceStructure = new SourceFileImpl;
    const declarations = this.getDeclarations();

    sourceStructure.statements.push(
      "// This file is generated.  Do not edit.",
      ...declarations
    );

    const sourceFile = getTS_SourceFile(stageDir, this.#absolutePathToExportFile);
    sourceFile.removeText();
    sourceFile.set(sourceStructure);
    await sourceFile.save();
  }
}

export const InternalExports = new ExportManager("./source/internal-exports.ts");
export const PublicExports = new ExportManager("./source/exports.ts");

InternalExports.addExports({
  absolutePathToModule: pathToModule(stageDir, "./source/exports.ts"),
  exportNames: [],
  isDefaultExport: false,
  isType: false,
});
