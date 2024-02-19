//#region preamble
import { JSDocTagImpl } from "../../exports.js";
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocStructureClassIfc,
  REPLACE_WRITER_WITH_STRING,
  StructureBase,
  StructureClassesMap,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
} from "../../internal-exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JSDocStructure,
  type JSDocTagStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const JSDocStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocImpl
  extends JSDocStructureBase
  implements JSDocStructureClassIfc
{
  readonly kind: StructureKind.JSDoc = StructureKind.JSDoc;
  description?: stringOrWriterFunction = undefined;
  readonly tags: JSDocTagImpl[] = [];

  /** @internal */
  public static [COPY_FIELDS](
    source: OptionalKind<JSDocStructure>,
    target: JSDocImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.description) {
      target.description = source.description;
    }

    if (source.tags) {
      target.tags.push(
        ...StructureClassesMap.cloneArrayWithKind<
          JSDocTagStructure,
          StructureKind.JSDocTag,
          JSDocTagImpl
        >(StructureKind.JSDocTag, StructureClassesMap.forceArray(source.tags)),
      );
    }
  }

  public static clone(source: OptionalKind<JSDocStructure>): JSDocImpl {
    const target = new JSDocImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<JSDocImpl> {
    const rv = super.toJSON() as StructureClassToJSON<JSDocImpl>;
    if (this.description) {
      rv.description = StructureBase[REPLACE_WRITER_WITH_STRING](
        this.description,
      );
    } else {
      rv.description = undefined;
    }

    rv.kind = this.kind;
    rv.tags = this.tags;
    return rv;
  }
}

JSDocImpl satisfies CloneableStructure<JSDocStructure, JSDocImpl> &
  Class<ExtractStructure<JSDocStructure["kind"]>>;
StructureClassesMap.set(StructureKind.JSDoc, JSDocImpl);
