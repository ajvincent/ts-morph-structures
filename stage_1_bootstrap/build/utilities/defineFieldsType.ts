// #region preamble
import {
  LiteralTypedStructureImpl,
  ObjectLiteralTypedStructureImpl,
  PrefixOperatorsTypedStructureImpl,
  PropertySignatureImpl,
  TypeArgumentedTypedStructureImpl,
  TypeAliasDeclarationImpl,
} from "../../prototype-snapshot/exports.js";

import ConstantTypeStructures from "./ConstantTypeStructures.js";

// #endregion preamble

export default function defineFieldsType(
  name: string
): TypeAliasDeclarationImpl
{
  const alias = new TypeAliasDeclarationImpl(name + "Fields");
  alias.isExported = true;

  const staticFields = new PropertySignatureImpl("staticFields");
  staticFields.typeStructure = ConstantTypeStructures.object;

  const instanceFields = new PropertySignatureImpl("instanceFields");
  instanceFields.typeStructure = new LiteralTypedStructureImpl(name);
  /*
  instanceFields.typeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.Required,
    [
      new LiteralTypedStructureImpl(name)
    ]
  );
  */

  const symbolKey = new PropertySignatureImpl("symbolKey");
  symbolKey.typeStructure = new PrefixOperatorsTypedStructureImpl(
    ["typeof"], new LiteralTypedStructureImpl(name + "Key")
  );

  alias.typeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.RightExtendsLeft,
    [
      new TypeArgumentedTypedStructureImpl(
        ConstantTypeStructures.StaticAndInstance,
        [symbolKey.typeStructure]
      ),

      new ObjectLiteralTypedStructureImpl([
        staticFields,
        instanceFields,
        symbolKey,
      ])
    ]
  );

  return alias;
}
