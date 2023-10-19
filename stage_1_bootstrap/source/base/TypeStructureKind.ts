import type {
  TypedNodeWriter
} from "../types/ts-morph-typednodewriter.js";

export enum TypeStructureKind {
  Literal = 1000000,
  String,
  Writer,
  QualifiedName,
  Parentheses,
  PrefixOperators,
  Infer,
  Union,
  Intersection,
  Tuple,
  Array,
  Conditional,
  IndexedAccess,
  Mapped,
  TypeArgumented,
  Function,
  Parameter,
  TemplateLiteral,
  MemberedObject,
}

export interface KindedTypeStructure<
  TKind extends TypeStructureKind
> extends TypedNodeWriter
{
  readonly kind: TKind;
}
