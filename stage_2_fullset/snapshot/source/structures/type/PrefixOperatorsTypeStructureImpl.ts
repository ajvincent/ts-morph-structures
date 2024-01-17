import type { CodeBlockWriter, WriterFunction } from "ts-morph";

import { TypeStructureKind } from "../../base/TypeStructureKind.js";

import type { TypeStructures } from "./TypeStructures.js";

import TypeStructureClassesMap from "../../base/TypeStructureClassesMap.js";
import TypeStructuresBase from "./TypeStructuresBase.js";

import type { CloneableTypeStructure } from "../../types/CloneableStructure.js";

export type PrefixUnaryOperator =
  | "..."
  | "keyof"
  | "typeof"
  | "readonly"
  | "unique";

/** `("..." | "keyof" | "typeof" | "readonly" | "unique")[]` (object type) */
export default class PrefixOperatorsTypeStructureImpl extends TypeStructuresBase<TypeStructureKind.PrefixOperators> {
  public static clone(
    other: PrefixOperatorsTypeStructureImpl,
  ): PrefixOperatorsTypeStructureImpl {
    return new PrefixOperatorsTypeStructureImpl(
      other.operators,
      TypeStructureClassesMap.clone(other.objectType),
    );
  }

  readonly kind = TypeStructureKind.PrefixOperators;
  public operators: PrefixUnaryOperator[];
  public objectType: string | TypeStructures;

  constructor(
    operators: readonly PrefixUnaryOperator[],
    objectType: string | TypeStructures,
  ) {
    super();
    this.operators = operators.slice();
    this.objectType = objectType;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    if (this.operators.length) {
      writer.write(
        this.operators.map((op) => (op === "..." ? op : op + " ")).join(""),
      );
    }

    TypeStructuresBase.writeStringOrType(writer, this.objectType);
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
PrefixOperatorsTypeStructureImpl satisfies CloneableTypeStructure<PrefixOperatorsTypeStructureImpl>;
TypeStructureClassesMap.set(
  TypeStructureKind.PrefixOperators,
  PrefixOperatorsTypeStructureImpl,
);
