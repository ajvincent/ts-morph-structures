import {
  InterfaceDeclarationImpl,
  SourceFileImpl,
  type TypeMemberImpl,
  TypeMembersMap,
} from "#stage_two/snapshot/source/exports.js";

import BaseModule from "./BaseModule.js";

export default
class InterfaceModule extends BaseModule {
  static readonly decoratorsMap = new Map<string, InterfaceModule>;
  static readonly structuresMap = new Map<string, InterfaceModule>;

  static #entryComparator(
    this: void,
    a: [string, TypeMemberImpl],
    b: [string, TypeMemberImpl]
  ): number
  {
    if (a[0] === "kind")
      return -1;
    if (b[0] === "kind")
      return +1;
  
    return a[0].localeCompare(b[0]);
  }

  readonly typeMembers: TypeMembersMap;
  readonly extendsSet: Set<string>;

  structureKindName?: string;

  constructor(
    interfaceName: string,
  )
  {
    super("source/interfaces/standard", interfaceName, true);
    this.typeMembers = new TypeMembersMap;
    this.extendsSet = new Set<string>;
  }

  protected getSourceFileImpl(): SourceFileImpl {
    const sourceFile = new SourceFileImpl;

    const interfaceDecl = new InterfaceDeclarationImpl(this.defaultExportName);
    interfaceDecl.isExported = true;
    this.typeMembers.sortEntries(InterfaceModule.#entryComparator);
    this.typeMembers.moveMembersToType(interfaceDecl);
    sourceFile.statements.push(
      interfaceDecl
    );

    return sourceFile;
  }
}
