import { ClassDeclarationImpl } from "#stage_two/snapshot/source/exports.js";
import BaseClassModule from "./BaseClassModule.js";

export default class StructureModule extends BaseClassModule
{
  static readonly map = new Map<string, StructureModule>;

  constructor(defaultExportName: string) {
    super("source/structures/standard", defaultExportName);
    StructureModule.map.set(defaultExportName, this);
  }

  buildClassDeclaration(): ClassDeclarationImpl {
    throw new Error("Method not implemented.");
  }
  public saveFile(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
