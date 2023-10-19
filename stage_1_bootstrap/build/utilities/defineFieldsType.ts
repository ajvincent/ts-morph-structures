// #region preamble
import {
  LiteralTypedStructureImpl,
  MemberedObjectTypeStructureImpl,
  PrefixOperatorsTypedStructureImpl,
  PropertySignatureImpl,
  TypeArgumentedTypedStructure,
  TypeArgumentedTypedStructureImpl,
  TypeAliasDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import ConstantTypeStructures from "./ConstantTypeStructures.js";

// #endregion preamble

type FieldsTypeAliasContext = {
  fieldType: TypeAliasDeclarationImpl;
  instanceFieldsArgumented: TypeArgumentedTypedStructure;
}

export default function defineFieldsType(
  name: string
): FieldsTypeAliasContext
{
  const alias = new TypeAliasDeclarationImpl(name + "Fields");
  alias.isExported = true;

  const staticFields = new PropertySignatureImpl("staticFields");
  staticFields.typeStructure = ConstantTypeStructures.object;

  const instanceFields = new PropertySignatureImpl("instanceFields");

  const literalType = new LiteralTypedStructureImpl(name);
  let typeArgumented = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.PreferArrayFields, [literalType]
  );
  typeArgumented = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.RequiredOmit, [typeArgumented]
  );
  instanceFields.typeStructure = typeArgumented;
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

      new MemberedObjectTypeStructureImpl([
        staticFields,
        instanceFields,
        symbolKey,
      ])
    ]
  );

  return {
    fieldType: alias,
    instanceFieldsArgumented: instanceFields.typeStructure
  }
}
