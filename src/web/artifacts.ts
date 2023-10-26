import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { abapGit } from './abapgit';

export type SubFiles = {name: string, file: vscode.Uri}[];

export type ArtifactInformation = {
  abapType: string,
  abapName: string,
  description: string,
  mainFile: vscode.Uri,
  subFiles: SubFiles;
};

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

      const type = split[1].toUpperCase();
      const name = split[0].toUpperCase();
      const found = ret.find((r) => r.abapType === type && r.abapName === name);
      if (found) {
        found.subFiles.push({name: Utils.basename(filename), file: filename});
      } else {
        ret.push({
          abapType: type,
          abapName: name,
          description: type,
          mainFile: filename,
          subFiles: [],
        });
      }
    }
  }

  return ret;
}