import LiteralTypeStructureImpl from "./LiteralTypeStructureImpl.js";
import StringTypeStructureImpl from "./StringTypeStructureImpl.js";
import WriterTypeStructureImpl from "./WriterTypeStructureImpl.js";

export type TypeStructures = (
  LiteralTypeStructureImpl |
  StringTypeStructureImpl |
  WriterTypeStructureImpl
);
