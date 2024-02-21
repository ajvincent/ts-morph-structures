import {
  LiteralTypeStructureImpl,
  //TypeAliasDeclarationImpl,
  UnionTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

class UnionsModuleBase
{
  #unionsSet = new Map<string, UnionTypeStructureImpl>;

  public addUnion(
    parentName: string,
    childNames: readonly string[]
  ): void
  {
    this.#unionsSet.set(parentName, new UnionTypeStructureImpl(
      childNames.map(name => LiteralTypeStructureImpl.get(name))
    ));
  }

  public saveFile(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

const UnionModule = new UnionsModuleBase;
export default UnionModule;
