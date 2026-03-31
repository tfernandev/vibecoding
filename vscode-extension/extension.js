const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('AI Dev Architect Extension is now active!');

	const provider = new PromptArchitectSidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('ai-dev-architect.sidebar', provider)
	);

	let disposable = vscode.commands.registerCommand('ai-dev-architect.openSandbox', function () {
		vscode.window.showInformationMessage('Abriendo Prompt Sandbox...');
	});

	context.subscriptions.push(disposable);
}

class PromptArchitectSidebarProvider {
	constructor(extensionUri) {
		this._extensionUri = extensionUri;
	}

	resolveWebviewView(webviewView, context, token) {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		// POINT TO OUR LOCAL NEXT.JS APP SANDBOX!
		webviewView.webview.html = this._getHtmlForWebview();
	}

	_getHtmlForWebview() {
		return `
			<!DOCTYPE html>
			<html lang="es">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>AI Dev Architect</title>
				<style>
					body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
					iframe { border: none; width: 100%; height: 100%; }
				</style>
			</head>
			<body>
				<iframe src="http://localhost:3000/sandbox" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
			</body>
			</html>
		`;
	}
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
