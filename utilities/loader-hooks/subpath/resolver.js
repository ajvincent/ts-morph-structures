import path from "node:path";
import fs from "node:fs/promises";

import {
  getReplacement,
  buildReplacementMap,
} from "./replacement-map.js";

import projectDir from "../internal/projectDir.js";

/*
import logWithHook from "./logWithHook.js";
*/

/** @returns Map<RegExp, string | null> */

let subpathStartResolver;

/** @type SingletonPromise<Map<RegExp, string | null>> */
let SubpathImportsPromise = new Promise(resolve => subpathStartResolver = resolve).then(async () => {
  const packageLocation = path.join(projectDir, "package.json");
  const packageContents = JSON.parse(await fs.readFile(packageLocation, { encoding: "utf-8" }));
  return buildReplacementMap(packageContents.imports);
});

export async function initialize() {
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("#")) {
    subpathStartResolver();
    const replacementMap = await SubpathImportsPromise;
    const subpathImportMatch = await getReplacement(replacementMap, specifier, context.parentURL);
    /*
    await logWithHook("subpathImportMatch", subpathImportMatch, "parentURL", context.parentURL);
    */
    specifier = subpathImportMatch;
  }
  const result = await nextResolve(specifier, context);
  return Promise.resolve(result);
}

export async function load(url, context, nextLoad) {
  return await nextLoad(url, context);
}
