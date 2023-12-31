import {
  LiteralTypedStructureImpl,
  PrefixOperatorsTypedStructureImpl,
  StringTypedStructureImpl,
  UnionTypedStructureImpl,
  type TypeStructures,
  ArrayTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

const ConstantTypeStructures: Record<string, Readonly<TypeStructures>> = {
  "Class": new LiteralTypedStructureImpl("Class"),
  "ClassDecoratorContext": new LiteralTypedStructureImpl("ClassDecoratorContext"),
  "CloneableStructure": new LiteralTypedStructureImpl("CloneableStructure"),
  "ExtractStructure": new LiteralTypedStructureImpl("ExtractStructure"),
  "KindedStructure": new LiteralTypedStructureImpl("KindedStructure"),
  "MixinClass": new LiteralTypedStructureImpl("MixinClass"),
  "OptionalKind": new LiteralTypedStructureImpl("OptionalKind"),
  "PreferArrayFields": new LiteralTypedStructureImpl("PreferArrayFields"),
  "Required": new LiteralTypedStructureImpl("Required"),
  "RequiredOmit": new LiteralTypedStructureImpl("RequiredOmit"),
  "RightExtendsLeft": new LiteralTypedStructureImpl("RightExtendsLeft"),
  "StaticAndInstance": new LiteralTypedStructureImpl("StaticAndInstance"),
  "StructureBase": new LiteralTypedStructureImpl("StructureBase"),
  "StructureClassToJSON": new LiteralTypedStructureImpl("StructureClassToJSON"),
  "StructureKind": new LiteralTypedStructureImpl("StructureKind"),
  "Structures": new LiteralTypedStructureImpl("Structures"),
  "SubclassDecorator": new LiteralTypedStructureImpl("SubclassDecorator"),
  "TypeStructures": new LiteralTypedStructureImpl("TypeStructures"),
  "WriterFunction": new LiteralTypedStructureImpl("WriterFunction"),
  "boolean": new LiteralTypedStructureImpl("boolean"),
  "false": new LiteralTypedStructureImpl("false"),
  "instanceFields": new StringTypedStructureImpl("instanceFields"),
  "kind": new StringTypedStructureImpl("kind"),
  "object": new LiteralTypedStructureImpl("object"),
  "staticFields": new StringTypedStructureImpl("staticFields"),
  "string": new LiteralTypedStructureImpl("string"),
  "string_TypeStructures_Undefined": new UnionTypedStructureImpl([
    new LiteralTypedStructureImpl("string"),
    new LiteralTypedStructureImpl("TypeStructures"),
    new LiteralTypedStructureImpl("undefined"),
  ]),
  "stringOrWriterFunction": new LiteralTypedStructureImpl("stringOrWriterFunction"),
  "stringOrWriterFunction[]": new ArrayTypedStructureImpl(
    new LiteralTypedStructureImpl("stringOrWriterFunction")
  ),
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
