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
  
    test('${WS}\xa0${WS}HELLO${WS}WORLD${WS}\xa0${WS}', () => {
      expect(edgeWhitespace(`${WS}\xa0${WS}HELLO${WS}WORLD${WS}\xa0${WS}`)).toEqual({ leading: WS, leadingAscii: '\xa0', leadingNonAscii: WS, trailing: WS, trailingNonAscii: '\xa0', trailingAscii: WS });
    });
  
    test('\xa0${WS}HELLO${WS}WORLD${WS}\xa0', () => {
      expect(edgeWhitespace(`\xa0${WS}HELLO${WS}WORLD${WS}\xa0`)).toEqual({ leading: '', leadingAscii: '\xa0', leadingNonAscii: WS, trailing: WS, trailingNonAscii: '\xa0', trailingAscii: '' });
    });
  
    test('\xa0${WS}\xa0', () => {
      expect(edgeWhitespace(`\xa0${WS}\xa0`)).toEqual({ leading: '', leadingAscii: '\xa0', leadingNonAscii: WS, trailing: '', trailingNonAscii: '\xa0', trailingAscii: '' });
    });
  
    test('${WS}\xa0${WS}', () => {
      expect(edgeWhitespace(`${WS}\xa0${WS}`)).toEqual({ leading: WS, leadingAscii: '\xa0', leadingNonAscii: WS, trailing: '', trailingNonAscii: '', trailingAscii: '' });
    });
  
    test('${WS}\xa0', () => {
      expect(edgeWhitespace(`${WS}\xa0`)).toEqual({ leading: WS, leadingAscii: '\xa0', leadingNonAscii: '', trailing: '', trailingNonAscii: '', trailingAscii: '' });
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
