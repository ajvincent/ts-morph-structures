# Design constraints

## fillDictionaries: use the snapshot's structures instead of ts-morph directly

In stage 1, I'm using ts-morph API's to generate intermediate data objects via fillDictionaries.  While useful, this does have some side-effects.

The intermediates are throwing away useful information.  When there is a union between array and non-array types (`ClassDeclarationStructure.implements`), I drop the non-array type.  This means I can't use them to generate reference information.  On the other hand, structures from ts-morph (and thusly, from ts-morph-structures) are disposable.  With type-augmented structures, I could simply _sort_ the union where the array type is at the end of the union type.

By using the type-augmented structures directly, I can also strengthen the "two independent builds" theory of bootstrapping.
