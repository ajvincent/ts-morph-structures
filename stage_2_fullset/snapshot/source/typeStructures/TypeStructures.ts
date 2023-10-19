import ArrayTypeStructureImpl from "./ArrayTypeStructureImpl.js";
import ConditionalTypeStructureImpl from "./ConditionalTypeStructureImpl.js";
import IndexedAccessTypeStructureImpl from "./IndexedAccessTypeStructureImpl.js";
import IntersectionTypeStructureImpl from "./IntersectionTypeStructureImpl.js";
import LiteralTypeStructureImpl from "./LiteralTypeStructureImpl.js";
import ParenthesesTypeStructureImpl from "./ParenthesesTypeStructureImpl.js";
import PrefixOperatorsTypeStructureImpl from "./PrefixOperatorsTypeStructureImpl.js";
import QualifiedNameTypeStructureImpl from "./QualifiedNameTypeStructureImpl.js";
import StringTypeStructureImpl from "./StringTypeStructureImpl.js";
import TupleTypeStructureImpl from "./TupleTypeStructureImpl.js";
import TypeArgumentedTypeStructureImpl from "./TypeArgumentedTypeStructureImpl.js";
import UnionTypeStructureImpl from "./UnionTypeStructureImpl.js";
import WriterTypeStructureImpl from "./WriterTypeStructureImpl.js";

export type TypeStructures =
  | ArrayTypeStructureImpl
  | ConditionalTypeStructureImpl
  | IndexedAccessTypeStructureImpl
  | IntersectionTypeStructureImpl
  | LiteralTypeStructureImpl
  | ParenthesesTypeStructureImpl
  | PrefixOperatorsTypeStructureImpl
  | QualifiedNameTypeStructureImpl
  | StringTypeStructureImpl
  | TupleTypeStructureImpl
  | TypeArgumentedTypeStructureImpl
  | UnionTypeStructureImpl
  | WriterTypeStructureImpl;
