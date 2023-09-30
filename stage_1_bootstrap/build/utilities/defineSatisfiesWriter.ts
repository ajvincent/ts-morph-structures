// #region preamble
import {
  WriterFunction,
} from "ts-morph";

import {
  FunctionDeclarationImpl,
  LiteralTypedStructureImpl,
  TypeArgumentedTypedStructureImpl,
  TypeAliasDeclarationImpl,
} from "../../prototype-snapshot/exports.js";

import ConstantTypeStructures from "./ConstantTypeStructures.js";
// #endregion preamble

export default function defineSatisfiesWriter(
  fnDecl: FunctionDeclarationImpl,
  alias: TypeAliasDeclarationImpl,
): WriterFunction
{
  const subclass = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.SubclassDecorator,
    [
      new LiteralTypedStructureImpl(alias.name),
      ConstantTypeStructures["typeof StructureBase"],
      ConstantTypeStructures.false,
    ]
  )
  return writer => {
    writer.write(fnDecl.name!);
    writer.write(" satisfies ");
    subclass.writerFunction(writer);
    writer.write(";");
  };
}
