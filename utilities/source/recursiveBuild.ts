import path from "path";
import { chdir, cwd } from 'node:process';

export default async function recursiveBuild(
  dirName: string,
  relativePathToModule: string,
): Promise<void>
{
  const popDir: string = cwd();
  try {
    const pushDir = path.resolve(popDir, dirName);
    const scriptToLoad = path.resolve(pushDir, relativePathToModule);
    chdir(pushDir);
    await import(scriptToLoad);
  }
  finally {
    chdir(popDir);
  }
}
