import {
  LiteralTypedStructureImpl,
  PrefixOperatorsTypedStructureImpl,
  StringTypedStructureImpl,
  type TypeStructures,
} from "../../prototype-snapshot/exports.js";

const ConstantTypeStructures: Record<string, Readonly<TypeStructures>> = {
  "ClassDecoratorContext": new LiteralTypedStructureImpl("ClassDecoratorContext"),
  "KindedStructure": new LiteralTypedStructureImpl("KindedStructure"),
  "MixinClass": new LiteralTypedStructureImpl("MixinClass"),
  "Required": new LiteralTypedStructureImpl("Required"),
  "RightExtendsLeft": new LiteralTypedStructureImpl("RightExtendsLeft"),
  "StaticAndInstance": new LiteralTypedStructureImpl("StaticAndInstance"),
  "StructureBase": new LiteralTypedStructureImpl("StructureBase"),
  "StructureKind": new LiteralTypedStructureImpl("StructureKind"),
  "Structures": new LiteralTypedStructureImpl("Structures"),
  "SubclassDecorator": new LiteralTypedStructureImpl("SubclassDecorator"),
  "WriterFunction": new LiteralTypedStructureImpl("WriterFunction"),
  "false": new LiteralTypedStructureImpl("false"),
  "instanceFields": new StringTypedStructureImpl("instanceFields"),
  "object": new LiteralTypedStructureImpl("object"),
  "staticFields": new StringTypedStructureImpl("staticFields"),
  "string": new LiteralTypedStructureImpl("string"),
  "stringOrWriter": new LiteralTypedStructureImpl("stringOrWriter"),
  "typeof StructureBase": new PrefixOperatorsTypedStructureImpl(
    ["typeof"], new LiteralTypedStructureImpl("StructureBase")
  ),
  "undefined": new LiteralTypedStructureImpl("undefined"),
  "uniqueSymbol": new PrefixOperatorsTypedStructureImpl(
    ["unique"], new LiteralTypedStructureImpl("symbol")
  ),
  "void": new LiteralTypedStructureImpl("void"),
}

export default ConstantTypeStructures;
