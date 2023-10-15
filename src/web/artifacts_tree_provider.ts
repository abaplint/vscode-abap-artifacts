import * as vscode from "vscode";
import { ArtifactInformation, findArtifacts } from "./artifacts";

export class ArtifactsTreeProvider implements vscode.TreeDataProvider<ArtifactTreeItem> {

  public getTreeItem(element: ArtifactTreeItem): vscode.TreeItem {
    return element;
  }

  public async getChildren(parent?: ArtifactTreeItem): Promise<ArtifactTreeItem[]> {
    console.dir(parent);
    console.dir("getchildren");

    if (parent !== undefined) {
      // todo, children here
      return [];
    } else {
      const items = await findArtifacts();
      const treeItems: ArtifactTreeItem[] = [];
      for (const i of items) {
        treeItems.push(new ArtifactTreeItem(i));
      }
      return treeItems;
    }
  }
}

export class ArtifactTreeItem extends vscode.TreeItem {
  public constructor(info: ArtifactInformation) {
    let state = vscode.TreeItemCollapsibleState.None;
    if (info.subFiles.length > 0) {
      state = vscode.TreeItemCollapsibleState.Collapsed;
    }

    super(info.name, state);
    this.tooltip = info.type;
    this.description = info.description;
    this.resourceUri = info.mainFile;

    this.command = {
      command: "vscode.open",
      title: "",
      arguments: [this.resourceUri],
    };
  }

  public contextValue = "abap-artifacts-context";
}