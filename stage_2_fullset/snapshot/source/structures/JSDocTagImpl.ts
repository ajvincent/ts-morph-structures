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
import { type JSDocTagStructure, OptionalKind, StructureKind } from "ts-morph";
//#endregion preamble
const JSDocTagStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocTagImpl
  extends JSDocTagStructureBase
  implements JSDocTagStructure
{
  readonly kind: StructureKind.JSDocTag = StructureKind.JSDocTag;
  tagName: string;
  text?: stringOrWriter = undefined;

  constructor(tagName: string) {
    super();
    this.tagName = tagName;
  }

  public static copyFields(
    source: OptionalKind<JSDocTagStructure>,
    target: JSDocTagImpl,
  ): void {
    super.copyFields(source, target);
    if (source.tagName) {
      target.tagName = source.tagName;
    }

    if (source.text) {
      target.text = source.text;
    }
  }

  public static clone(source: OptionalKind<JSDocTagStructure>): JSDocTagImpl {
    const target = new JSDocTagImpl(source.tagName);
    this.copyFields(source, target);
    return target;
  }
}

JSDocTagImpl satisfies CloneableStructure<JSDocTagStructure>;
StructuresClassesMap.set(StructureKind.JSDocTag, JSDocTagImpl);
