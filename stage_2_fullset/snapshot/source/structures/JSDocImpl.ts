//#region preamble
import { JSDocTagImpl } from "../exports.js";
import {
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type ExtractStructure,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
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
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class, Jsonify } from "type-fest";
//#endregion preamble
const JSDocStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocImpl
  extends JSDocStructureBase
  implements RequiredOmit<PreferArrayFields<JSDocStructure>, "description">
{
  readonly kind: StructureKind.JSDoc = StructureKind.JSDoc;
  description?: stringOrWriter = undefined;
  readonly tags: JSDocTagImpl[] = [];

  public static [COPY_FIELDS](
    source: OptionalKind<JSDocStructure>,
    target: JSDocImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.tags) {
      target.tags.push(
        ...cloneStructureArray<
          OptionalKind<JSDocTagStructure>,
          StructureKind.JSDocTag,
          JSDocTagImpl
        >(source.tags, StructureKind.JSDocTag),
      );
    }

    if (source.description) {
      target.description = source.description;
    }
  }

  public static clone(source: OptionalKind<JSDocStructure>): JSDocImpl {
    const target = new JSDocImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<JSDocStructure> {
    const rv = super.toJSON() as JSDocStructure;
    if (this.description) {
      rv.description = StructureBase[REPLACE_WRITER_WITH_STRING](
        this.description,
      );
    }

    rv.kind = this.kind;
    rv.tags = this.tags;
    return rv;
  }
}

JSDocImpl satisfies CloneableStructure<JSDocStructure, JSDocImpl> &
  Class<ExtractStructure<JSDocStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.JSDoc, JSDocImpl);
