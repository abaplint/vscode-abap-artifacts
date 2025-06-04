import * as vscode from "vscode";
import { findAllABAPFiles } from "./artifacts";
import { Utils } from 'vscode-uri';

export class WorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {

  public async provideWorkspaceSymbols(query: string): Promise<vscode.SymbolInformation[]> {

    // todo: use query to filter the results ?
    const allSymbols = [];

    // todo, this is slow, should be cached
    const allFiles = await findAllABAPFiles();

    for (const file of allFiles) {
      const basename = Utils.basename(file).toUpperCase();
      if (basename === "PACKAGE.DEVC.XML") {
        continue;
      }
      let kind: vscode.SymbolKind | undefined = undefined;

      if (basename.endsWith(".CLAS.ABAP")) {
        kind = vscode.SymbolKind.Class;
      } else if (basename.endsWith(".INTF.ABAP")) {
        kind = vscode.SymbolKind.Interface;
      } else if (basename.endsWith(".PROG.ABAP")) {
        kind = vscode.SymbolKind.Field;
      }

      if (kind !== undefined) {
        const symbol = new vscode.SymbolInformation(
          basename.split(".")[0],
          kind,
          "",
          new vscode.Location(
            file,
            new vscode.Position(0, 0)
          )
        );
        allSymbols.push(symbol);
      }
    }

    return allSymbols;
  }
}