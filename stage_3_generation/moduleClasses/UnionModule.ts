import {
  SourceFileImpl,
  TypeAliasDeclarationImpl,
} from "#stage_two/snapshot/source/exports.js";

import getTS_SourceFile from "#utilities/source/getTS_SourceFile.js";

import {
  distDir,
} from "../build/constants.js";

import BaseModule from "./BaseModule.js";
import { pathToModule } from "#utilities/source/AsyncSpecModules.js";

class UnionsModuleBase extends BaseModule
{
  constructor() {
    super(pathToModule(distDir, "source/types"), "StructureImplUnions.d.ts");
  }
  readonly aliases = new Map<string, TypeAliasDeclarationImpl>;

  public async saveFile(): Promise<void> {
    const file = getTS_SourceFile(distDir, "source/types/StructureImplUnions.d.ts");
    const structure = new SourceFileImpl;

    const unions = Array.from(this.aliases.values());
    unions.sort((a, b): number => a.name.localeCompare(b.name));

    structure.statements.push(
      ...this.importsManager.getDeclarations(),
      ...unions
    );

    file.set(structure);
    await file.save();
  }
}

const UnionModule = new UnionsModuleBase;
export default UnionModule;
