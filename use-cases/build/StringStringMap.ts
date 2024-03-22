import path from "path";
import {
  distDir,
  project,
  removeDistFile,
  //getExistingSourceFile,
} from "./sharedProject.js";
import { SourceFile } from "ts-morph";

export default async function buildStringStringMap(): Promise<void>
{
  await removeDistFile("StringStringMap.ts");

  /* This is a starting point, based on our needs:
  - hashing two keys into one
  - retrieving two keys from one
  - storing the hashed keys and values in a private map
  */
  const moduleFile: SourceFile = project.createSourceFile(
    path.join(distDir, "StringStringMap.ts"),
    `
interface StringStringKey {
  readonly firstKey: string,
  readonly secondKey: string
}

export default class StringStringMap<V> {
  static #hashKeys(firstKey: string, secondKey: string): string {
    return JSON.stringify({firstKey, secondKey});
  }

  static #parseKeys(hashedKey: string): [string, string]
  {
    const { firstKey, secondKey } = JSON.parse(hashedKey) as StringStringKey;
    return [firstKey, secondKey];
  }

  readonly #hashMap = new Map<string, V>;
}
    `.trim()
  );

  await moduleFile.save();
  return Promise.resolve();
}
