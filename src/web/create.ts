import * as vscode from "vscode";
import { Utils } from 'vscode-uri';
import { schemas } from "./aff_schemas";
import { JSONSchemaFaker } from "json-schema-faker";

async function createFile(path: string, filename: string, content: string) {
  const uri = vscode.Uri.joinPath(vscode.Uri.parse(path), filename);
  if (await fileExists(uri)) {
    vscode.window.showErrorMessage("File already exists!");
    return;
  }
  const uintarray = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(uri, uintarray);
  await vscode.window.showTextDocument(uri, {preview: false});
}

async function findFolder(uri: vscode.Uri): Promise<string> {
  const stat = await vscode.workspace.fs.stat(uri);
  if (stat.type === vscode.FileType.File) {
    const base = Utils.dirname(uri).path;
    return base;
  } else {
    return uri.path;
  }
}

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  if (!uri) {
    return false;
  }
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

export async function createArtifact(uri: vscode.Uri) {
  const foo: {[name: string]: (uri: vscode.Uri) => Promise<void>} = {
    "CLAS - Class (abapGit)": createCLAS,
    "INTF - Interface (abapGit)": createINTF,
    "PROG - Program (abapGit)": createPROG,
  };

  for (const key of Object.keys(schemas)) {
    const schema = schemas[key];
    foo[key.toUpperCase() + " - " + schema.title + " (AFF)"] = createAff(key);
  }

  const type = await vscode.window.showQuickPick(Object.keys(foo));

  if (type === undefined || type === "") {
    return;
  }

  const fun = foo[type];
  if (fun) {
    await fun(uri);
  }
}

function createAff(key: string) {
  const ret = async (uri: vscode.Uri) => {
    let name = await vscode.window.showInputBox({placeHolder: "name"});
    if (name === undefined || name === "") {
      return;
    }
    // change namespace,
    name = name.trim().replace("/", "(");
    name = name.replace("/", ")");

    const sample = JSONSchemaFaker.generate(schemas[key]);
    const dir = await findFolder(uri);
    const json = JSON.stringify(sample, null, 2);
    await createFile(dir, `${name}.${key}.json`, json);
  };
  return ret;
}

async function createCLAS(uri: vscode.Uri) {
  const name = await vscode.window.showInputBox({placeHolder: "cl_name"});
  if (name === undefined || name === "") {
    return;
  }

  const dir = await findFolder(uri);
  const filename = name.replace(/\//g, "#").toLowerCase() + ".clas";

  const uriXML = filename + ".xml";
  const dataXML = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_CLAS" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <VSEOCLASS>
    <CLSNAME>${name.toUpperCase()}</CLSNAME>
    <LANGU>E</LANGU>
    <DESCRIPT>${name.toUpperCase()}</DESCRIPT>
    <STATE>1</STATE>
    <CLSCCINCL>X</CLSCCINCL>
    <FIXPT>X</FIXPT>
    <UNICODE>X</UNICODE>
   </VSEOCLASS>
  </asx:values>
 </asx:abap>
</abapGit>`;
  await createFile(dir, uriXML, dataXML);

  const uriABAP = filename + ".abap";
  const dataABAP = `CLASS ${name.toLowerCase()} DEFINITION PUBLIC.
  PUBLIC SECTION.
ENDCLASS.

CLASS ${name.toLowerCase()} IMPLEMENTATION.

ENDCLASS.`;
  await createFile(dir, uriABAP, dataABAP);
}

async function createINTF(uri: vscode.Uri) {
  const name = await vscode.window.showInputBox({placeHolder: "if_name"});
  if (name === undefined || name === "") {
    return;
  }

  const dir = await findFolder(uri);
  const filename = name.replace(/\//g, "#").toLowerCase() + ".intf";

  const uriXML = filename + ".xml";
  const dataXML = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_INTF" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <VSEOINTERF>
    <CLSNAME>${name.toUpperCase()}</CLSNAME>
    <LANGU>E</LANGU>
    <DESCRIPT>${name.toUpperCase()}</DESCRIPT>
    <EXPOSURE>2</EXPOSURE>
    <STATE>1</STATE>
    <UNICODE>X</UNICODE>
   </VSEOINTERF>
  </asx:values>
 </asx:abap>
</abapGit>`;
  await createFile(dir, uriXML, dataXML);

  const uriABAP = filename + ".abap";
  const dataABAP = `INTERFACE ${name.toLowerCase()} PUBLIC.

ENDINTERFACE.`;
  await createFile(dir, uriABAP, dataABAP);
}

async function createPROG(uri: vscode.Uri) {
  const name = await vscode.window.showInputBox({placeHolder: "zreport"});
  if (name === undefined || name === "") {
    return;
  }

  const dir = await findFolder(uri);
  const filename = name.toLowerCase() + ".prog";

  const uriXML = filename + ".xml";
  const dataXML = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_PROG" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <PROGDIR>
    <NAME>${name.toUpperCase()}</NAME>
    <DBAPL>S</DBAPL>
    <SUBC>1</SUBC>
    <FIXPT>X</FIXPT>
    <UCCHECK>X</UCCHECK>
   </PROGDIR>
  </asx:values>
 </asx:abap>
</abapGit>`;
  await createFile(dir, uriXML, dataXML);

  const uriABAP = filename + ".abap";
  const dataABAP = `REPORT ${name.toLowerCase()}.\n\n`;
  await createFile(dir, uriABAP, dataABAP);
}