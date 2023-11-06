//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import { type JSDocTagStructure, OptionalKind, StructureKind } from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const JSDocTagStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocTagImpl
  extends JSDocTagStructureBase
  implements RequiredOmit<PreferArrayFields<JSDocTagStructure>, "text">
{
  readonly kind: StructureKind.JSDocTag = StructureKind.JSDocTag;
  tagName: string;
  text?: stringOrWriterFunction = undefined;

  constructor(tagName: string) {
    super();
    this.tagName = tagName;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<JSDocTagStructure>,
    target: JSDocTagImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.tagName) {
      target.tagName = source.tagName;
    }

    if (source.text) {
      target.text = source.text;
    }
  }

  public static clone(source: OptionalKind<JSDocTagStructure>): JSDocTagImpl {
    const target = new JSDocTagImpl(source.tagName);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<JSDocTagImpl> {
    const rv = super.toJSON() as StructureClassToJSON<JSDocTagImpl>;
    rv.kind = this.kind;
    rv.tagName = this.tagName;
    if (this.text) {
      rv.text = StructureBase[REPLACE_WRITER_WITH_STRING](this.text);
    }

    return rv;
  }
}

JSDocTagImpl satisfies CloneableStructure<JSDocTagStructure, JSDocTagImpl> &
  Class<ExtractStructure<JSDocTagStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.JSDocTag, JSDocTagImpl);
