const PropertyHashesWithTypes: ReadonlySet<string> = new Set<string>([
  "ClassDeclarationStructure:extends",
  "ClassDeclarationStructure:implements",
  "IndexSignatureDeclarationStructure:keyType",
  "InterfaceDeclarationStructure:extends",
  "ReturnTypedNodeStructure:returnType",
  "TypedNodeStructure:type",
  "TypeParameterDeclarationStructure:constraint",
  "TypeParameterDeclarationStructure:default",
]);

export default PropertyHashesWithTypes;
