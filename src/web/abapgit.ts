import * as vscode from 'vscode';

const DEFAULT = "src/**/*.*";

export class abapGit {

  public static async findStartingFolderPattern(path: vscode.Uri) {
    const uri = vscode.Uri.joinPath(path, ".abapgit.xml");

    let result: Uint8Array;
    try {
      result = await vscode.workspace.fs.readFile(uri);
    } catch {
      return DEFAULT;
    }

    const xml = new TextDecoder().decode(result);
    const match = xml.match(/<STARTING_FOLDER>(.*)<\/STARTING_FOLDER>/);
    if (match) {
      const found = match[1];
      return found.substring(1) + "**/*.*";
    } else {
      return DEFAULT;
    }

  }

}