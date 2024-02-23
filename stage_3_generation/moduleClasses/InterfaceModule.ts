import {
  SourceFileImpl,
  TypeMembersMap,
  type TypeStructures
} from "#stage_two/snapshot/source/exports.js";

import BaseModule from "./BaseModule.js";

export default
class InterfaceModule extends BaseModule {
  static readonly decoratorsMap = new Map<string, InterfaceModule>;
  static readonly structuresMap = new Map<string, InterfaceModule>;

  readonly typeMembers: TypeMembersMap;
  readonly extendsSet: Set<TypeStructures>;

  constructor(
    interfaceName: string,
    typeMembers: TypeMembersMap,
    extendsSet: Set<TypeStructures>,
  )
  {
    super("source/interfaces/standard", interfaceName, true);
    this.typeMembers = typeMembers;
    this.extendsSet = extendsSet;
  }

  protected getSourceFileImpl(): SourceFileImpl {
    throw new Error("Method not implemented.");
  }
}
