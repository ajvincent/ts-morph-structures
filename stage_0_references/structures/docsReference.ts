import path from "path";
import projectDir from "./projectDir.js";
const docsAsHTMLPath = path.normalize(path.join(
  projectDir, "docs/reference/structure-types.html"
));

const docsAsMDPath = path.normalize(path.join(
  projectDir, "docs/reference/structure-types.md"
));

export { docsAsHTMLPath, docsAsMDPath }
