import {
  SourceFileImpl,
  TypeMembersMap,
} from "#stage_two/snapshot/source/exports.js"

import BaseModule from "./BaseModule.js";

export default
class InterfaceModule extends BaseModule {
  static readonly decoratorsMap = new Map<string, InterfaceModule>;
  static readonly structuresMap = new Map<string, InterfaceModule>;

  readonly typeMembers: TypeMembersMap;

  constructor(interfaceName: string, typeMembers: TypeMembersMap) {
    super("source/interfaces/standard", interfaceName, true);
    this.typeMembers = typeMembers;
  }

  protected getSourceFileImpl(): SourceFileImpl {
    throw new Error("Method not implemented.");
  }
}
