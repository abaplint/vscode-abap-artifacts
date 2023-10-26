import * as vscode from "vscode";
import { ArtifactInformation, SubFiles, findArtifacts } from "./artifacts";

export class ArtifactsTreeProvider implements vscode.TreeDataProvider<ArtifactTreeItem> {

  public getTreeItem(element: ArtifactTreeItem): vscode.TreeItem {
    return element;
  }

  public async getChildren(parent?: ArtifactTreeItem): Promise<ArtifactTreeItem[]> {
    const treeItems: ArtifactTreeItem[] = [];
    if (parent !== undefined) {
      for (const sub of parent.subFiles) {
        treeItems.push(new ArtifactTreeItem({
          type: "",
          name: sub.name,
          description: "",
          mainFile: sub.file,
          subFiles: [],
        }));
      }
    } else {
      const items = await findArtifacts();
      for (const i of items) {
        treeItems.push(new ArtifactTreeItem(i));
      }
    }

    return treeItems;
  }
}

export class ArtifactTreeItem extends vscode.TreeItem {
  public readonly subFiles: SubFiles;

  public constructor(info: ArtifactInformation) {
    let state = vscode.TreeItemCollapsibleState.None;
    if (info.subFiles.length > 0) {
      state = vscode.TreeItemCollapsibleState.Collapsed;
    }

    super(info.name, state);
    this.tooltip = info.type;
    this.subFiles = info.subFiles;
    this.iconPath =  vscode.ThemeIcon.File;
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