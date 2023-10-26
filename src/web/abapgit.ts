import * as vscode from 'vscode';

export class abapGit {

  public static async findStartingFolder(path: vscode.Uri) {
    const uri = vscode.Uri.joinPath(path, ".abapgit.xml");
    const result = await vscode.workspace.fs.readFile(uri);
    console.dir("SDFSDFSDFSDFSDFSDFSDFSDF");
    console.dir(result.toString());
  }

}