<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [ts-morph-structures](./ts-morph-structures.md) &gt; [ConstructorHeadStatementsGetter](./ts-morph-structures.constructorheadstatementsgetter.md) &gt; [filterCtorHeadStatements](./ts-morph-structures.constructorheadstatementsgetter.filterctorheadstatements.md)

## ConstructorHeadStatementsGetter.filterCtorHeadStatements() method

**Signature:**

```typescript
filterCtorHeadStatements(key: MemberedStatementsKey): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | [MemberedStatementsKey](./ts-morph-structures.memberedstatementskey.md) | The membered statement key. <code>fieldKey</code> will be <code>ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL</code>. <code>statementGroupKey</code> will be "constructor". |

**Returns:**

boolean

true for a match against the key.

