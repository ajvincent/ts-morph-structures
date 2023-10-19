import {
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

import TypeStructuresBase from "./TypeStructuresBase.js";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";
import type {
  CloneableTypeStructure
} from "../types/CloneableStructure.js";
import { CodeBlockWriter, WriterFunction } from "ts-morph";

/** `one${"A" | "B"}two${"C" | "D"}three` */
export default
class TemplateLiteralTypeStructureImpl
extends TypeStructuresBase<TypeStructureKind.TemplateLiteral>
{
  static clone(
    other: TemplateLiteralTypeStructureImpl
  ): TemplateLiteralTypeStructureImpl
  {
    const spans = other.spans.map(
      span => TypeStructureClassesMap.cloneArray(span) as [string | TypeStructures, string]
    );
    return new TemplateLiteralTypeStructureImpl(other.head, spans);
  }

  readonly kind = TypeStructureKind.TemplateLiteral;
  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);

  head: string;
  spans: [string | TypeStructures, string][];

  constructor(
    head: string,
    spans: [string | TypeStructures, string][]
  )
  {
    super();
    this.head = head;
    this.spans = spans;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(
    writer: CodeBlockWriter
  ): void
  {
    TypeStructuresBase.pairedWrite(writer, "`", "`", false, false, () => {
      writer.write(this.head);
      this.spans.forEach(span => {
        TypeStructuresBase.pairedWrite(writer, "${", "}", false, false, () => {
          TypeStructuresBase.writeStringOrType(writer, span[0]);
        });

        writer.write(span[1]);
      });
    });
  }
}
TemplateLiteralTypeStructureImpl satisfies CloneableTypeStructure<TemplateLiteralTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.TemplateLiteral, TemplateLiteralTypeStructureImpl);
