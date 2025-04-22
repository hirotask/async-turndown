const path = require('path');
const rewire = require('rewire');

const turndownModule = rewire(path.resolve('lib/turndown.cjs'));

let edgeWhitespace;
// テストの設定
beforeAll(() => {
  // edgeWhitespaceをリワイヤーで取得
  edgeWhitespace = turndownModule.__get__('edgeWhitespace');
});

// test関数の実行
describe('edge whitespace detection', () => {
    const WS = '\r\n \t';
  
    test('${WS}HELLO WORLD${WS}', () => {
      expect(edgeWhitespace(`${WS}HELLO WORLD${WS}`)).toEqual({ leading: WS, leadingAscii: WS, leadingNonAscii: '', trailing: WS, trailingNonAscii: '', trailingAscii: WS });
    });
  
    test('${WS}H${WS}', () => {
      expect(edgeWhitespace(`${WS}H${WS}`)).toEqual({ leading: WS, leadingAscii: WS, leadingNonAscii: '', trailing: WS, trailingNonAscii: '', trailingAscii: WS });
    });
    
    test('HELLO WORLD', () => {
      expect(edgeWhitespace('HELLO WORLD')).toEqual({ leading: '', leadingAscii: '', leadingNonAscii: '', trailing: '', trailingNonAscii: '', trailingAscii: '' });
    });
  
    test('empty string', () => {
      expect(edgeWhitespace('')).toEqual({ leading: '', leadingAscii: '', leadingNonAscii: '', trailing: '', trailingNonAscii: '', trailingAscii: '' });
    });
  
    test('performance check', () => {
      expect(edgeWhitespace(`TEST${Array(32768).join(' ')}END`)).toEqual({ leading: '', leadingAscii: '', leadingNonAscii: '', trailing: '', trailingNonAscii: '', trailingAscii: '' });
    });
});
