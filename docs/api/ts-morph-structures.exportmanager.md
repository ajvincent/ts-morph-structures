<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [ts-morph-structures](./ts-morph-structures.md) &gt; [ExportManager](./ts-morph-structures.exportmanager.md)

## ExportManager class

This manages export declarations and specifiers, for including in a source file.

**Signature:**

```typescript
export default class ExportManager 
```

## Example


```typescript
publicExports.addExports({
  absolutePathToModule: path.join(distDir, "source/toolbox/ExportManager.ts"),
  exportNames: ["ExportManager"],
  isDefaultExport: true,
  isType: false,
});
// ...
sourceFile.statements.push(...publicExports.getDeclarations());
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(absolutePathToExportFile)](./ts-morph-structures.exportmanager._constructor_.md) |  | Constructs a new instance of the <code>ExportManager</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [absolutePathToExportFile](./ts-morph-structures.exportmanager.absolutepathtoexportfile.md) | <code>readonly</code> | string | Where the file will live on the file system. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [addExports(context)](./ts-morph-structures.exportmanager.addexports.md) |  |  |
|  [getDeclarations()](./ts-morph-structures.exportmanager.getdeclarations.md) |  | Get the export declarations, sorted by path to file, then internally by specified export values. |
