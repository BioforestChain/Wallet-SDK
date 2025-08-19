import fs from "node:fs";
for (const tsfile of fs.globSync("packages/*/src/**/*.ts")) {
    let fileContent = fs.readFileSync(tsfile, "utf-8");
    for (const m of fileContent.matchAll(/from "(\..*\.js)"/g)) {
        const tsfilepath = m[1].replace(".js", ".ts");
        if (!fs.existsSync(tsfilepath)) {
            const indexFilepath = m[1].replace(".js", "/index.ts");
            if (fs.existsSync(indexFilepath)) {
                fileContent = fileContent.replaceAll(m[0], `from "${m[1].replace(".js", "/index.js")}"`);
            }
        }
    }
    fs.writeFileSync(tsfile, fileContent);
}
