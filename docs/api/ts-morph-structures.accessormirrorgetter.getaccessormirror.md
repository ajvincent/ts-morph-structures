<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [ts-morph-structures](./ts-morph-structures.md) &gt; [AccessorMirrorGetter](./ts-morph-structures.accessormirrorgetter.md) &gt; [getAccessorMirror](./ts-morph-structures.accessormirrorgetter.getaccessormirror.md)

## AccessorMirrorGetter.getAccessorMirror() method

**Signature:**

```typescript
getAccessorMirror(
    key: MemberedStatementsKey,
  ): stringWriterOrStatementImpl | undefined;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | [MemberedStatementsKey](./ts-morph-structures.memberedstatementskey.md) | Describing the getter or setter to implement. <code>statementGroupKey</code> will be <code>ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY</code>. |

**Returns:**

[stringWriterOrStatementImpl](./ts-morph-structures.stringwriterorstatementimpl.md) \| undefined

the value to write for the getter and/or setter to mirror.

