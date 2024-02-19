<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [ts-morph-structures](./ts-morph-structures.md) &gt; [TypeMembersMap](./ts-morph-structures.typemembersmap.md) &gt; [resolveIndexSignature](./ts-morph-structures.typemembersmap.resolveindexsignature.md)

## TypeMembersMap.resolveIndexSignature() method

Replace an index signature with other methods/properties matching the signature's return type.

It is up to you to ensure the names match the key type of the index signature.

**Signature:**

```typescript
resolveIndexSignature(signature: IndexSignatureDeclarationImpl, names: string[]): MethodSignatureImpl[] | PropertySignatureImpl[];
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  signature | [IndexSignatureDeclarationImpl](./ts-morph-structures.indexsignaturedeclarationimpl.md) | the signature (which must be a member of this) to resolve. |
|  names | string\[\] | the names to replace the signature's key with. |

**Returns:**

[MethodSignatureImpl](./ts-morph-structures.methodsignatureimpl.md)<!-- -->\[\] \| [PropertySignatureImpl](./ts-morph-structures.propertysignatureimpl.md)<!-- -->\[\]
