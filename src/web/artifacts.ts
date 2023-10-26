import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { abapGit } from './abapgit';

export interface ArtifactInformation {
  type: string,
  name: string,
  description: string,
  mainFile: vscode.Uri,
  subFiles: {name: string, file: string}[];
}

export async function findArtifacts(): Promise<ArtifactInformation[]> {
  const ret: ArtifactInformation[] = [];

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
      // todo: need more logic here,
      ret.push({
        type: split[1].toUpperCase() + "sdf",
        name: split[0].toUpperCase(),
        description: "",
        mainFile: filename,
        subFiles: [],
      });
    }
  }

  return ret;
}