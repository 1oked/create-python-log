
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('create-python-log.createLog', async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		if (path.extname(editor.document.fileName) !== '.py') {
			vscode.window.showErrorMessage('Not a python file');
			return;
		}

		const filePath = editor.document.fileName;
        const fileName = path.basename(filePath);
        const logFileName = `${path.basename(filePath, '.py')}_log.txt`;
        const logFilePath = path.join(path.dirname(filePath), logFileName);

		let logContent = `LOG FOR: ${fileName}\n`;
        logContent += `Generated: ${new Date().toISOString()}\n`;
        logContent += `File: ${filePath}\n\n`;

		if (editor.document.isDirty) {
            await editor.document.save();
        }

		logContent += "EXECUTION OUTPUT:\n";
        logContent += "================\n";

		try {
            const result = child_process.spawnSync('python3', [filePath], {
                encoding: 'utf-8',
                timeout: 30000,
                shell: true  // Added shell for better command execution
            });

            logContent += `STDOUT:\n${result.stdout || '(no output)'}\n\n`;
            logContent += `STDERR:\n${result.stderr || '(no errors)'}\n\n`;
            logContent += `EXIT CODE: ${result.status}\n`;
        } catch (error: any) {
            logContent += `EXECUTION ERROR: ${error.message}\n`;
        }

		fs.writeFileSync(logFilePath, logContent, 'utf8');
        vscode.window.showInformationMessage(`Log created: ${logFileName}`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
