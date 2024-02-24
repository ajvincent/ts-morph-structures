import assert from "node:assert/strict";

import {
  ArrayTypeStructureImpl,
  LiteralTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  TypeStructureKind,
  type TypeArgumentedTypeStructureImpl,
  type TypeStructures,
  UnionTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  getStructureImplName,
  getUnionOfStructuresName
} from "#utilities/source/StructureNameTransforms.js";

const stringType = LiteralTypeStructureImpl.get("string");
const writerType = LiteralTypeStructureImpl.get("WriterFunction");
const stringorWriterType = LiteralTypeStructureImpl.get("stringOrWriterFunction");

const OptionalKindType = LiteralTypeStructureImpl.get("OptionalKind");

export default
function tightenPropertyType(
  typeStructure: TypeStructures
): TypeStructures
{
  switch (typeStructure.kind) {
    case TypeStructureKind.Array:
      return tightenArray(typeStructure);

    case TypeStructureKind.Literal:
      return tightenLiteral(typeStructure);

    case TypeStructureKind.Parentheses:
      return tightenParentheses(typeStructure);

    case TypeStructureKind.TypeArgumented:
      return tightenTypeArgumented(typeStructure);

    case TypeStructureKind.Union:
      return tightenUnion(typeStructure);
  }
  return typeStructure;
}

function tightenArray(
  typeStructure: ArrayTypeStructureImpl
): ArrayTypeStructureImpl
{
  return new ArrayTypeStructureImpl(
    tightenPropertyType(typeStructure.objectType)
  );
}

function tightenLiteral(
  typeStructure: LiteralTypeStructureImpl
): LiteralTypeStructureImpl
{
  return LiteralTypeStructureImpl.get(
    getUnionOfStructuresName(
      getStructureImplName(
        typeStructure.stringValue
      )
    )
  );
}

function tightenParentheses(
  typeStructure: ParenthesesTypeStructureImpl
): TypeStructures
{
  const childType = tightenPropertyType(typeStructure.childTypes[0]);
  if (childType.kind === TypeStructureKind.Union) {
    return new ParenthesesTypeStructureImpl(childType);
  }
  return childType;
}

function tightenTypeArgumented(
  typeStructure: TypeArgumentedTypeStructureImpl
): TypeStructures
{
  assert.equal(typeStructure.objectType, OptionalKindType, "expected OptionalKind");
  return tightenPropertyType(typeStructure.childTypes[0]);
}

function tightenUnion(
  typeStructure: UnionTypeStructureImpl
): TypeStructures
{
  typeStructure = UnionTypeStructureImpl.clone(typeStructure);
  // Often we find `string | WriterFunction` in sequence.
  let { childTypes } = typeStructure;
  const writerIndex = childTypes.indexOf(writerType);
  if ((writerIndex > 0) && (childTypes[writerIndex - 1] === stringType)) {
    childTypes.splice(writerIndex - 1, 2, stringorWriterType);
  }

  // prefer arrays over individuals
  const arrayTypes = childTypes.filter(type => type.kind === TypeStructureKind.Array);
  if (arrayTypes.length > 0)
    childTypes = arrayTypes;

  // tighten the elements
  childTypes = childTypes.map(tightenPropertyType);
  assert(childTypes.length > 0, "how'd we end up with an empty array?");

  if (childTypes.length === 1)
    return childTypes[0];
  return new UnionTypeStructureImpl(childTypes);
}
