//#region preamble
import type { TypeStructures } from "../exports.js";
import {
  COPY_FIELDS,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type RightExtendsLeft,
  StructureBase,
  TypeAccessors,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ReturnTypedNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const ReturnTypedNodeStructureKey: unique symbol;
export type ReturnTypedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ReturnTypedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<
      PreferArrayFields<ReturnTypedNodeStructure>,
      "returnType"
    >;
    symbolKey: typeof ReturnTypedNodeStructureKey;
  }
>;

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

    get returnType(): stringOrWriterFunction {
      return this.#returnTypeManager.type ?? "";
    }

    set returnType(value: stringOrWriterFunction) {
      this.#returnTypeManager.type = value;
    }

    get returnTypeStructure(): string | TypeStructures | undefined {
      return this.#returnTypeManager.typeStructure;
    }

    set returnTypeStructure(value: string | TypeStructures | undefined) {
      this.#returnTypeManager.typeStructure = value;
    }

    public static [COPY_FIELDS](
      source: ReturnTypedNodeStructure & Structures,
      target: ReturnTypedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.returnType) {
        target.returnType = source.returnType;
      }
    }

    public toJSON(): Jsonify<ReturnTypedNodeStructure> {
      const rv = super.toJSON() as ReturnTypedNodeStructure;
      if (this.returnType) {
        rv.returnType = StructureBase[REPLACE_WRITER_WITH_STRING](
          this.returnType,
        );
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
