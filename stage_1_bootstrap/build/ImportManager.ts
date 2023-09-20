import {
  ImportDeclarationImpl,
  ImportSpecifierImpl,
} from "../prototype-snapshot/exports.js";

export default class ImportManager
{
  static #compareDeclarations(
    this: void,
    a: [string, ImportDeclarationImpl],
    b: [string, ImportDeclarationImpl],
  ): number
  {
    return a[0].localeCompare(b[0]);
  }

  static #compareSpecifiers(
    this: void,
    a: ImportSpecifierImpl,
    b: ImportSpecifierImpl,
  ): number
  {
    return a.name.localeCompare(b.name);
  }

  readonly #declarationsMap = new Map<string, ImportDeclarationImpl>;
  readonly #knownSpecifiers = new Set<string>;

  addImport(
    pathToSourceFile: string,
    nameToImport: string,
    isDefaultImport: boolean,
    isTypeOnly: boolean,
  ): void
  {
    if (this.#knownSpecifiers.has(nameToImport))
      throw new Error("this import is already known.");

    let importDecl = this.#declarationsMap.get(pathToSourceFile);
    if (!importDecl) {
      importDecl = new ImportDeclarationImpl(pathToSourceFile);
      this.#declarationsMap.set(pathToSourceFile, importDecl);
    }

    if (isDefaultImport) {
      if (importDecl.defaultImport) {
        throw new Error("You already have a default import.");
      }
      importDecl.defaultImport = nameToImport;
    }
    else {
      const specifier = new ImportSpecifierImpl(nameToImport);
      specifier.isTypeOnly = isTypeOnly;
      importDecl.namedImports.push(specifier);
    }

    this.#knownSpecifiers.add(nameToImport);
  }

  getStatements(): ImportDeclarationImpl[]
  {
    const entries = Array.from(this.#declarationsMap);
    entries.sort(ImportManager.#compareDeclarations);
    return entries.map(entry => {
      (entry[1].namedImports as ImportSpecifierImpl[]).sort(ImportManager.#compareSpecifiers);
      return entry[1];
    });
  }
}
