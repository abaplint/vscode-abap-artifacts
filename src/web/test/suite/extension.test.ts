import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { buildClasXml } from '../../create';
// import * as myExtension from '../../extension';

suite('Web Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('CLAS XML sets testclasses flag when requested', () => {
		const xml = buildClasXml('zcl_demo', true);

		assert.ok(xml.includes('<WITH_UNIT_TESTS>X</WITH_UNIT_TESTS>'));
	});

	test('CLAS XML omits testclasses flag when not requested', () => {
		const xml = buildClasXml('zcl_demo', false);

		assert.ok(!xml.includes('<WITH_UNIT_TESTS>X</WITH_UNIT_TESTS>'));
	});
});
