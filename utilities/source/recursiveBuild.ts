import path from "path";
import { spawn } from "child_process";
import { Deferred } from "./PromiseTypes.js";

export default async function recursiveBuild(
  dirname: string,
): Promise<void>
{
  const d = new Deferred<void>;

  const child = spawn(
    "node",
    [
      "../node_modules/ts-node/dist/bin-esm.js",
      "build.ts"
    ],
    {
      stdio: ["ignore", "inherit", "inherit", "ipc"],
      cwd: path.join(process.cwd(), dirname)
    }
  );
  child.on('exit', code => code ? d.reject(code) : d.resolve());

  return d.promise;
}
