import * as vscode from 'vscode';
import { createArtifact } from './create';
import { ArtifactsTreeProvider } from './artifacts_tree_provider';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("abap-artifacts.artifacts", new ArtifactsTreeProvider());

	let disposable = vscode.commands.registerCommand('abap-artifacts.create.artifact', createArtifact);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
