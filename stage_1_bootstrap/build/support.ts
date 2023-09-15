import cleanGenerated from "./cleanSourceGenerated.js";
import structureToSyntax from "./structureToSyntax.js";

export default async function support(): Promise<void>
{
  // this has to happen first
  await cleanGenerated();

  await Promise.all([
    structureToSyntax(),
  ]);

  const dist = (await import("./dist.js")).default;
  await dist();
}
