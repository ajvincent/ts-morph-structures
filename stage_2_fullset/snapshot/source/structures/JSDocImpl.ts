//#region preamble
import {
  type CloneableStructure,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JSDocStructure,
  type JSDocTagStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const JSDocStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocImpl
  extends JSDocStructureBase
  implements JSDocStructure
{
  readonly kind: StructureKind.JSDoc = StructureKind.JSDoc;
  tags: JSDocTagStructure[] = [];
  description?: stringOrWriter = undefined;

  public static copyFields(
    source: OptionalKind<JSDocStructure>,
    target: JSDocImpl,
  ): void {
    super.copyFields(source, target);
    if (source.description) {
      target.description = source.description;
    }
  }

  public static clone(source: OptionalKind<JSDocStructure>): JSDocImpl {
    const target = new JSDocImpl();
    this.copyFields(source, target);
    return target;
  }
}

JSDocImpl satisfies CloneableStructure<JSDocStructure>;
StructuresClassesMap.set(StructureKind.JSDoc, JSDocImpl);
