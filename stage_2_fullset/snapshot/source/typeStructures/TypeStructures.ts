import IndexedAccessTypeStructureImpl from "./IndexedAccessTypeStructureImpl.js";
import IntersectionTypeStructureImpl from "./IntersectionTypeStructureImpl.js";
import LiteralTypeStructureImpl from "./LiteralTypeStructureImpl.js";
import ParenthesesTypeStructureImpl from "./ParenthesesTypeStructureImpl.js";
import StringTypeStructureImpl from "./StringTypeStructureImpl.js";
import UnionTypeStructureImpl from "./UnionTypeStructureImpl.js";
import WriterTypeStructureImpl from "./WriterTypeStructureImpl.js";

export type TypeStructures =
  | IndexedAccessTypeStructureImpl
  | IntersectionTypeStructureImpl
  | LiteralTypeStructureImpl
  | ParenthesesTypeStructureImpl
  | StringTypeStructureImpl
  | UnionTypeStructureImpl
  | WriterTypeStructureImpl;
