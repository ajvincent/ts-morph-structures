<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [ts-morph-structures](./ts-morph-structures.md) &gt; [ConstructorHeadStatementsGetter](./ts-morph-structures.constructorheadstatementsgetter.md) &gt; [getCtorHeadStatements](./ts-morph-structures.constructorheadstatementsgetter.getctorheadstatements.md)

## ConstructorHeadStatementsGetter.getCtorHeadStatements() method

**Signature:**

```typescript
getCtorHeadStatements(
    key: MemberedStatementsKey,
  ): readonly stringWriterOrStatementImpl[];
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | [MemberedStatementsKey](./ts-morph-structures.memberedstatementskey.md) | The membered statement key. <code>fieldKey</code> will be <code>ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL</code>. <code>statementGroupKey</code> will be "constructor". |

**Returns:**

readonly [stringWriterOrStatementImpl](./ts-morph-structures.stringwriterorstatementimpl.md)<!-- -->\[\]

statements to insert before other statements in the purpose block.

