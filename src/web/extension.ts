import * as vscode from 'vscode';
import { createArtifact } from './create';
import { ArtifactsTreeProvider } from './artifacts_tree_provider';
import { WorkspaceSymbolProvider } from './workspace_symbol_provider';

export function activate(context: vscode.ExtensionContext) {
  const tree = new ArtifactsTreeProvider();
  vscode.window.registerTreeDataProvider("abap-artifacts.artifacts", tree);

  vscode.commands.registerCommand('abap-artifacts.tree.refresh', () =>
    tree.refresh()
  );

  vscode.commands.registerCommand('abap-artifacts.tree.create', () =>
    vscode.window.showInformationMessage('todo, create')
  );
  vscode.commands.registerCommand('abap-artifacts.tree.rename', () =>
    // todo: this will call the abaplint extension to rename the object
    vscode.window.showInformationMessage('todo, rename')
  );
  vscode.commands.registerCommand('abap-artifacts.tree.delete', () =>
    vscode.window.showInformationMessage('todo, delete')
  );

  vscode.languages.registerWorkspaceSymbolProvider(new WorkspaceSymbolProvider());

	let disposable = vscode.commands.registerCommand('abap-artifacts.create.artifact', createArtifact);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
