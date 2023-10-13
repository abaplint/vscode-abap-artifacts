import * as vscode from 'vscode';
import { createArtifact } from './create';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('abap-artifacts.create.artifact', createArtifact);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
