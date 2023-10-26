import * as vscode from "vscode";
import { AnyArtifact, findArtifacts } from "./artifacts";

export class ArtifactsTreeProvider implements vscode.TreeDataProvider<ArtifactTreeItem> {

  public getTreeItem(element: ArtifactTreeItem): vscode.TreeItem {
    return element;
  }

  public async getChildren(parent?: ArtifactTreeItem): Promise<ArtifactTreeItem[]> {
    const treeItems: ArtifactTreeItem[] = [];
    if (parent !== undefined) {
      for (const sub of parent.sub) {
        treeItems.push(new ArtifactTreeItem(sub));
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
  public readonly sub: AnyArtifact[];

  public constructor(info: AnyArtifact) {
    let state = vscode.TreeItemCollapsibleState.None;
    if (info.sub.length > 0) {
      state = vscode.TreeItemCollapsibleState.Collapsed;
    }

    super(info.name, state);
    this.iconPath = info.isFolder === true ? vscode.ThemeIcon.Folder : vscode.ThemeIcon.File;
    this.description = info.description;
    this.resourceUri = info.file;
    this.sub = info.sub;

    this.command = {
      command: "vscode.open",
      title: "",
      arguments: [this.resourceUri],
    };
  }

  public contextValue = "abap-artifacts-context";
}