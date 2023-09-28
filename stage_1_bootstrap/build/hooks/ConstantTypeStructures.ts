import {
  LiteralTypedStructureImpl,
  PrefixOperatorsTypedStructureImpl,
  type TypeStructures,
} from "../../prototype-snapshot/exports.js";

const ConstantTypeStructures: Record<string, Readonly<TypeStructures>> = {
  "ClassDecoratorContext": new LiteralTypedStructureImpl("ClassDecoratorContext"),
  "MixinClass": new LiteralTypedStructureImpl("MixinClass"),
  "StaticAndInstance": new LiteralTypedStructureImpl("StaticAndInstance"),
  "Required": new LiteralTypedStructureImpl("Required"),
  "RightExtendsLeft": new LiteralTypedStructureImpl("RightExtendsLeft"),
  "false": new LiteralTypedStructureImpl("false"),
  "instanceFields": new LiteralTypedStructureImpl("instanceFields"),
  "object": new LiteralTypedStructureImpl("object"),
  "staticFields": new LiteralTypedStructureImpl("staticFields"),
  "typeof StructureBase": new PrefixOperatorsTypedStructureImpl(
    ["typeof"], new LiteralTypedStructureImpl("StructureBase")
  ),
  "uniqueSymbol": new PrefixOperatorsTypedStructureImpl(
    ["unique"], new LiteralTypedStructureImpl("symbol")
  ),
  "void": new LiteralTypedStructureImpl("void"),
}

export default ConstantTypeStructures;
