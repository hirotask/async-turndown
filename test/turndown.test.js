const { test, expect, beforeEach } = require('@jest/globals')
const TurndownService = require('../lib/turndown.cjs')

let turndownService;

beforeEach(() => {
    turndownService = new TurndownService()
})

test('malformed documents', async () => {
    await turndownService.turndown('<HTML><head></head><BODY><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><body onload=alert(document.cookie);></body></html>')
})

test('null input', async () => {
    await expect(turndownService.turndown(null)).rejects.toThrow('null is not a string')
})

test('undefined input', async () => {
    await expect(turndownService.turndown(void (0))).rejects.toThrow('undefined is not a string')
})

test('#addRule returns the instance', () => {
    const rule = {
        filter: ['del', 's', 'strike'],
        replacement: function (content) {
            return '~~' + content + '~~'
        }
    }
    expect(turndownService.addRule('strikethrough', rule)).toEqual(turndownService)
})

test('#addRule adds the rule', () => {
    const rulesAddMock = jest.fn()
    turndownService.rules.add = rulesAddMock

    const rule = {
        filter: ['del', 's', 'strike'],
        replacement: function (content) {
            return '~~' + content + '~~'
        }
    }

    turndownService.addRule('strikethrough', rule)
    expect(rulesAddMock).toBeCalledWith('strikethrough', rule)
})

test('#use returns the instance for chaining', () => {
    expect(turndownService.use(function plugin () {})).toEqual(turndownService)
})

test('#use with a single plugin calls the fn with instance', () => {
    function plugin (service) {
        expect(service).toEqual(turndownService)
    }

    turndownService.use(plugin)
})

test('#use with multiple plugins calls each fn with instance', () => {
    function plugin1 (service) {
        expect(service).toEqual(turndownService)
    }
    function plugin2 (service) {
        expect(service).toEqual(turndownService)
    }
    turndownService.use([plugin1, plugin2])
})

test('#keep keeps elements as HTML', async () => {
    const input = '<p>Hello <del>world</del><ins>World</ins></p>'

    await expect(turndownService.turndown(input)).resolves.toBe('Hello worldWorld')

    turndownService.keep(['del', 'ins'])
    await expect(turndownService.turndown(input)).resolves.toBe('Hello <del>world</del><ins>World</ins>')
})

test('#keep returns the TurndownService instance for chaining', () => {
    expect(turndownService.keep(['del', 'ins'])).toEqual(turndownService)
})

test('keep rules are overridden by the standard rules', async () => {
    turndownService.keep('p')
    await expect(turndownService.turndown('<p>Hello world</p>')).resolves.toBe('Hello world')
})

test('keeping elements that have a blank textContent but contain significant elements', async () => {
    turndownService.keep('figure')
    await expect(turndownService.turndown('<figure><iframe src="http://example.com"></iframe></figure>')).resolves.toBe('<figure><iframe src="http://example.com"></iframe></figure>')
})

test('keepReplacement can be customised', async () => {
    turndownService = new TurndownService({
        keepReplacement: function (content, node) {
            return '\n\n' + node.outerHTML + '\n\n'
        }
    })

    turndownService.keep(['del', 'ins'])
    await expect(turndownService.turndown('<p>Hello <del>world</del><ins>World</ins></p>')).resolves.toBe('Hello \n\n<del>world</del>\n\n<ins>World</ins>')
})

test('#remove removes elements', async () => {
    const input = '<del>Please redact me</del>'

    await expect(turndownService.turndown(input)).resolves.toBe('Please redact me')

    turndownService.remove('del')
    await expect(turndownService.turndown(input)).resolves.toBe('')
})

test('#remove returns the TurndownService instance for chaining', () => {
    expect(turndownService.remove(['del', 'ins'])).toEqual(turndownService)
})

test('remove elements are overridden by rules', async () => {
	turndownService.remove('p')
	await expect(turndownService.turndown('<p>Hello world</p>')).resolves.toBe('Hello world')
})

test('remove elements are overridden by keep', async () => {
	turndownService.keep(['del', 'ins'])
	turndownService.remove(['del', 'ins'])

	await expect(turndownService.turndown('<p>Hello <del>world</del><ins>World</ins></p>')).resolves.toBe('Hello <del>world</del><ins>World</ins>')
})
