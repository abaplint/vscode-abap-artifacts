import * as vscode from 'vscode';
import { createArtifact } from './create';
import { ArtifactsTreeProvider } from './artifacts_tree_provider';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("abap-artifacts.artifacts", new ArtifactsTreeProvider());

  vscode.commands.registerCommand('abap-artifacts.tree.refresh', () =>
    vscode.window.showInformationMessage('todo, refresh')
  );

  vscode.commands.registerCommand('abap-artifacts.tree.create', () =>
    vscode.window.showInformationMessage('todo, create')
  );
  vscode.commands.registerCommand('abap-artifacts.tree.rename', () =>
    vscode.window.showInformationMessage('todo, rename')
  );
  vscode.commands.registerCommand('abap-artifacts.tree.delete', () =>
    vscode.window.showInformationMessage('todo, delete')
  );

	let disposable = vscode.commands.registerCommand('abap-artifacts.create.artifact', createArtifact);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
