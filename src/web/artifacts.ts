import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { abapGit } from './abapgit';

export interface AnyArtifact {
  name: string,
  description: string,
  file: vscode.Uri,

  sub: AnyArtifact[];
};

/////////////////////////

export async function findArtifacts(): Promise<AnyArtifact[]> {
  const ret: AnyArtifact[] = [];

  for (const folder of vscode.workspace.workspaceFolders || []) {
    // todo: use folder.name as top level in artifact tree

    const startingPattern = await abapGit.findStartingFolderPattern(folder.uri);
    const pattern = new vscode.RelativePattern(folder, startingPattern);
    const filenames = await vscode.workspace.findFiles(pattern);
    for (const filename of filenames) {
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
      const found = ret.find((r) => r.name === name && r.description === type);
      if (found) {
        found.sub.push({
          name: Utils.basename(filename),
          description: "",
          sub: [],
          file: filename,
        });
      } else {
        ret.push({
          name: name,
          description: type,
          file: filename,
          sub: [],
        });
      }
    }
  }

  return ret;
}