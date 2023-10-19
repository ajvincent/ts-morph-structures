import IndexedAccessTypeStructureImpl from "./IndexedAccessTypeStructureImpl.js";
import LiteralTypeStructureImpl from "./LiteralTypeStructureImpl.js";
import ParenthesesTypeStructureImpl from "./ParenthesesTypeStructureImpl.js";
import StringTypeStructureImpl from "./StringTypeStructureImpl.js";
import WriterTypeStructureImpl from "./WriterTypeStructureImpl.js";

export type TypeStructures = (
  IndexedAccessTypeStructureImpl |
  LiteralTypeStructureImpl |
  ParenthesesTypeStructureImpl |
  StringTypeStructureImpl |
  WriterTypeStructureImpl
);
