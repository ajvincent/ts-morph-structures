import {
  LiteralTypedStructureImpl,
  PrefixOperatorsTypedStructureImpl,
  StringTypedStructureImpl,
  type TypeStructures,
} from "../../prototype-snapshot/exports.js";

const ConstantTypeStructures: Record<string, Readonly<TypeStructures>> = {
  "ClassDecoratorContext": new LiteralTypedStructureImpl("ClassDecoratorContext"),
  "MixinClass": new LiteralTypedStructureImpl("MixinClass"),
  "Required": new LiteralTypedStructureImpl("Required"),
  "RightExtendsLeft": new LiteralTypedStructureImpl("RightExtendsLeft"),
  "StaticAndInstance": new LiteralTypedStructureImpl("StaticAndInstance"),
  "SubclassDecorator": new LiteralTypedStructureImpl("SubclassDecorator"),
  "false": new LiteralTypedStructureImpl("false"),
  "instanceFields": new StringTypedStructureImpl("instanceFields"),
  "object": new LiteralTypedStructureImpl("object"),
  "staticFields": new StringTypedStructureImpl("staticFields"),
  "typeof StructureBase": new PrefixOperatorsTypedStructureImpl(
    ["typeof"], new LiteralTypedStructureImpl("StructureBase")
  ),
  "uniqueSymbol": new PrefixOperatorsTypedStructureImpl(
    ["unique"], new LiteralTypedStructureImpl("symbol")
  ),
  "void": new LiteralTypedStructureImpl("void"),
}

export default ConstantTypeStructures;
