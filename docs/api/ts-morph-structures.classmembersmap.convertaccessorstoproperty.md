<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [ts-morph-structures](./ts-morph-structures.md) &gt; [ClassMembersMap](./ts-morph-structures.classmembersmap.md) &gt; [convertAccessorsToProperty](./ts-morph-structures.classmembersmap.convertaccessorstoproperty.md)

## ClassMembersMap.convertAccessorsToProperty() method

Convert get and/or set accessors to a property. This may be lossy, but we try to be faithful.

**Signature:**

```typescript
convertAccessorsToProperty(isStatic: boolean, name: string): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  isStatic | boolean | true if the property is static (and the accessors should be) |
|  name | string | the property name |

**Returns:**

void

