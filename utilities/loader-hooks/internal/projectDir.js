import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.normalize(path.join(
  fileURLToPath(import.meta.url), "../../../.."
));

export default projectDir;
