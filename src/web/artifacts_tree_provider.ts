import * as vscode from "vscode";
import { AnyArtifact, findTopArtifact } from "./artifacts";

export class ArtifactsTreeProvider implements vscode.TreeDataProvider<ArtifactTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<ArtifactTreeItem | undefined | void> = new vscode.EventEmitter<ArtifactTreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ArtifactTreeItem | undefined | void> = this._onDidChangeTreeData.event;

	public refresh(): void {
		this._onDidChangeTreeData.fire();
	}

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
      const items = await findTopArtifact();
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
    if (info.expand === true) {
      state = vscode.TreeItemCollapsibleState.Expanded;
    } else if (info.sub.length > 0) {
      state = vscode.TreeItemCollapsibleState.Collapsed;
    }

    super(info.name, state);
    this.iconPath = info.isFolder === true ? vscode.ThemeIcon.Folder : vscode.ThemeIcon.File;
    this.description = info.description;
    this.resourceUri = info.file;
    this.sub = info.sub;
    this.contextValue = info.contextValue;

    this.command = {
      command: "vscode.open",
      title: "",
      arguments: [this.resourceUri],
    };
  }

//  public contextValue = "abap-artifacts-context";
}