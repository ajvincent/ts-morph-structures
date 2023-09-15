import cleanGenerated from "./cleanSourceGenerated.js";
import structureToSyntax from "./structureToSyntax.js";

export default async function(): Promise<void>
{
  // this has to happen first
  await cleanGenerated();

  await Promise.all([
    structureToSyntax(),
  ]);
}
