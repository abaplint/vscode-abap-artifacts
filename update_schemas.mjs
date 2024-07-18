import * as child_process from "node:child_process";
import * as fs from "node:fs";

const raw = child_process.execSync(`curl -s -H "Accept: application/vnd.github+json" https://api.github.com/repos/SAP/abap-file-formats/contents/file-formats`);
const json = JSON.parse(raw);
const types = [];
for (const row of json) {
  if (row.type === "dir") {
    types.push(row.name);
  }
}

let schemas = "export const schemas: {[name: string]: any} = {};\n";
for (const type of types) {
  console.log(type);
  for (let version = 1; version < 100; version++) {
    const url = `https://raw.githubusercontent.com/SAP/abap-file-formats/main/file-formats/${type}/${type}-v${version}.json`;
    const raw = child_process.execSync(`curl -s -H "Accept: application/vnd.github+json" ${url}`);
    if (raw.toString().startsWith("404")) {
      break;
    }
    schemas += `schemas["${type}-v${version}"] = ` + JSON.stringify(JSON.parse(raw.toString())) + `;\n`;
  }
}

const filename = "./src/web/aff_schemas.ts";
fs.writeFileSync(filename, schemas);