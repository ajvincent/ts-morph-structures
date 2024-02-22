import {
  SourceFileImpl
} from "#stage_two/snapshot/source/exports.js";

import BaseClassModule from "./BaseClassModule.js";

export default class StructureModule extends BaseClassModule
{
  static readonly map = new Map<string, StructureModule>;

  constructor(defaultExportName: string)
  {
    super("source/structures/standard", defaultExportName, false);
    StructureModule.map.set(defaultExportName, this);
  }

  /*
  #buildClassDeclaration(): ClassDeclarationImpl {
    throw new Error("Method not implemented.");
  }
  */

  protected getSourceFileImpl(): SourceFileImpl {
    throw new Error("Method not implemented.");
  }
}
