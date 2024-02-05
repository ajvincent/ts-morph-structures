//#region preamble
import type { StructureImpls, TypeStructures } from "../../exports.js";
import {
  COPY_FIELDS,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type RightExtendsLeft,
  STRUCTURE_AND_TYPES_CHILDREN,
  StructureBase,
  type StructureClassToJSON,
  TypeAccessors,
  TypeStructureClassesMap,
} from "../../internal-exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ReturnTypedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ReturnTypedNodeStructureKey: unique symbol;
export type ReturnTypedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ReturnTypedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<
      PreferArrayFields<ReturnTypedNodeStructure>,
      "returnType"
    > &
      ReturnTypeInterface;
    symbolKey: typeof ReturnTypedNodeStructureKey;
  }
>;

interface ReturnTypeInterface {
  returnTypeStructure: TypeStructures | undefined;
}

export default function ReturnTypedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ReturnTypedNodeStructureFields["staticFields"],
  ReturnTypedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ReturnTypedNodeStructureMixin extends baseClass {
    readonly #returnTypeManager = new TypeAccessors();

    get returnType(): stringOrWriterFunction | undefined {
      return this.#returnTypeManager.type;
    }

    set returnType(value: stringOrWriterFunction | undefined) {
      this.#returnTypeManager.type = value;
    }

    get returnTypeStructure(): TypeStructures | undefined {
      return this.#returnTypeManager.typeStructure;
    }

    set returnTypeStructure(value: TypeStructures | undefined) {
      this.#returnTypeManager.typeStructure = value;
    }

    public static [COPY_FIELDS](
      source: ReturnTypedNodeStructure & Structures,
      target: ReturnTypedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      const { returnTypeStructure } =
        source as unknown as ReturnTypedNodeStructureMixin;
      if (returnTypeStructure) {
        target.returnTypeStructure =
          TypeStructureClassesMap.clone(returnTypeStructure);
      } else if (source.returnType) {
        target.returnType = source.returnType;
      }
    }

    /** @internal */
    public *[STRUCTURE_AND_TYPES_CHILDREN](): IterableIterator<
      StructureImpls | TypeStructures
    > {
      yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
      if (typeof this.returnTypeStructure === "object")
        yield this.returnTypeStructure;
    }

    public toJSON(): StructureClassToJSON<ReturnTypedNodeStructureMixin> {
      const rv =
        super.toJSON() as StructureClassToJSON<ReturnTypedNodeStructureMixin>;
      if (this.returnType) {
        rv.returnType = StructureBase[REPLACE_WRITER_WITH_STRING](
          this.returnType,
        );
      } else {
        rv.returnType = undefined;
      }

      return rv;
    }
  }

  return ReturnTypedNodeStructureMixin;
}

ReturnTypedNodeStructureMixin satisfies SubclassDecorator<
  ReturnTypedNodeStructureFields,
  typeof StructureBase,
  false
>;
