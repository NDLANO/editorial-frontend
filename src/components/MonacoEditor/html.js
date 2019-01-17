// Allow for running under nodejs/requirejs in tests
var _monaco = typeof monaco === 'undefined' ? self.monaco : monaco; //eslint-disable-line
var EMPTY_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];
export var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^`~!@$^&*()=+[{\]}\\|;:'",.<>/\s]+)/g,
  comments: {
    blockComment: ['<!--', '-->'],
  },
  brackets: [['<!--', '-->'], ['<', '>'], ['{', '}'], ['(', ')']],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
  ],
  onEnterRules: [
    {
      beforeText: new RegExp(
        '<(?!(?:' +
          EMPTY_ELEMENTS.join('|') +
          '))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$',
        'i',
      ),
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
      action: { indentAction: _monaco.languages.IndentAction.IndentOutdent },
    },
    {
      beforeText: new RegExp(
        '<(?!(?:' +
          EMPTY_ELEMENTS.join('|') +
          '))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$',
        'i',
      ),
      action: { indentAction: _monaco.languages.IndentAction.Indent },
    },
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*<!--\\s*#region\\b.*-->'),
      end: new RegExp('^\\s*<!--\\s*#endregion\\b.*-->'),
    },
  },
};
export var language = {
  defaultToken: '',
  tokenPostfix: '.html',
  ignoreCase: true,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      [/<!DOCTYPE/, 'metatag', '@doctype'],
      [/<!--/, 'comment', '@comment'],
      [
        /(<)((?:[\w-]+:)?[\w-]+)(\s*)(\/>)/,
        ['delimiter', 'tag', '', 'delimiter'],
      ],
      [
        /(<)((?:[\w-]+:)?[\w-]+)/,
        ['delimiter', { token: 'tag', next: '@otherTag' }],
      ],
      [
        /(<\/)((?:[\w-]+:)?[\w-]+)/,
        ['delimiter', { token: 'tag', next: '@otherTag' }],
      ],
      [/</, 'delimiter'],
      [/[^<]+/],
    ],
    doctype: [[/[^>]+/, 'metatag.content'], [/>/, 'metatag', '@pop']],
    comment: [
      [/-->/, 'comment', '@pop'],
      [/[^-]+/, 'comment.content'],
      [/./, 'comment.content'],
    ],
    otherTag: [
      [/\/?>/, 'delimiter', '@pop'],
      [/"([^"]*)"/, 'attribute.value'],
      [/'([^']*)'/, 'attribute.value'],
      [/[\w-]+/, 'attribute.name'],
      [/=/, 'delimiter'],
      [/[ \t\r\n]+/],
    ],
  },
};
