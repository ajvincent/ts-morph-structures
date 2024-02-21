import {
  ClassDeclarationImpl
} from "#stage_two/snapshot/source/exports.js";

import BaseClassModule from "./BaseClassModule.js";

export default
class DecoratorModule extends BaseClassModule
{
  static readonly map = new Map<string, DecoratorModule>;

  constructor(decoratorName: string) {
    super("source/decorators/standard", decoratorName);
    DecoratorModule.map.set(decoratorName, this);
  }

  buildClassDeclaration(): ClassDeclarationImpl {
    throw new Error("Method not implemented.");
  }
  public saveFile(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
