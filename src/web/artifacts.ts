import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { abapGit } from './abapgit';

export interface AnyArtifact {
  name: string,
  description: string,
  file: vscode.Uri,
  isFolder: boolean,
  expand: boolean,
  sub: AnyArtifact[];
};

/////////////////////////

function findTopFolder(filenames: vscode.Uri[]): string | undefined {
  const folders = new Set<string>();
  for (const filename of filenames) {
    folders.add(Utils.dirname(filename).toString());
  }
  const list = Array.from(folders).sort();
  return list[0];
}

function findSubFolders(path: string, filenames: vscode.Uri[]): string[] {
  const folders = new Set<string>();
  for (const filename of filenames) {
    folders.add(Utils.dirname(filename).toString());
  }
  const list = Array.from(folders).filter(f => f.replace(path, "").split("/").length === 2);
  return list.sort();
}

function buildFolder(path: string, filenames: vscode.Uri[]): AnyArtifact {
  const sub: AnyArtifact[] = [];

  const subFolders = findSubFolders(path, filenames);
  for (const subFolder of subFolders) {
    sub.push(buildFolder(subFolder, filenames));
  }

  for (const filename of filenames) {
    const dirname = Utils.dirname(filename).toString();
    if (dirname !== path) {
      continue;
    }

    const basename = Utils.basename(filename);
    if (basename === "package.devc.xml") {
      continue;
    }

    const split = basename.split(".");
    if (split.length < 3) {
      // then its not a abapGit or AFF file
      continue;
    }

    const type = split[1].toUpperCase();
    const name = split[0].toUpperCase();
    const found = sub.find((r) => r.name === name && r.description === type);
    if (found) {
      found.sub.push({
        name: Utils.basename(filename),
        description: "",
        sub: [],
        isFolder: false,
        expand: false,
        file: filename,
      });
    } else {
      sub.push({
        name: name,
        description: type,
        file: filename,
        isFolder: false,
        expand: false,
        sub: [],
      });
    }
  }

  const parsed = vscode.Uri.parse(path);
  return {
    name: Utils.basename(parsed),
    isFolder: true,
    description: "",
    file: parsed,
    expand: false,
    sub: sub,
  };
}

export async function findArtifacts(): Promise<AnyArtifact[]> {
  const ret: AnyArtifact[] = [];

  for (const folder of vscode.workspace.workspaceFolders || []) {
    // todo: use folder.name as top level in artifact tree

    const startingPattern = await abapGit.findStartingFolderPattern(folder.uri);
    const pattern = new vscode.RelativePattern(folder, startingPattern);

    const filenames = await vscode.workspace.findFiles(pattern);
    filenames.sort();

    const top = findTopFolder(filenames);
    if (top === undefined) {
      return [];
    }
    ret.push(buildFolder(top, filenames));
    ret[0].expand = true;
  }

  return ret;
}