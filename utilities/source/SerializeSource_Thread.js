import { parentPort } from "worker_threads";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget, } from "ts-morph";
const TSC_CONFIG = {
    "compilerOptions": {
        "lib": ["es2022"],
        "module": ModuleKind.ESNext,
        "target": ScriptTarget.ESNext,
        "moduleResolution": ModuleResolutionKind.NodeNext,
        "sourceMap": true,
        "declaration": true,
    },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
    useInMemoryFileSystem: true,
};
const project = new Project(TSC_CONFIG);
async function serializeSource_child(absolutePathToFile, structure) {
    const file = project.createSourceFile(absolutePathToFile, structure);
    const source = file.print();
    await file.deleteImmediately();
    return source;
}
async function processRequest(message) {
    try {
        const source = await serializeSource_child(message.absolutePathToFile, message.structure);
        const response = {
            command: message.command,
            token: message.token,
            isResponse: true,
            success: true,
            source
        };
        parentPort.postMessage(response);
    }
    catch (ex) {
        const response = {
            command: message.command,
            token: message.token,
            isResponse: true,
            success: false,
            error: ex
        };
        parentPort.postMessage(response);
    }
}
parentPort.on("message", (message) => {
    void (processRequest(message));
});
