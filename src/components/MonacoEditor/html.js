import htmlRules from './html-rules.json';
const VALID_TAGS = [
  ...htmlRules.tags,
  ...Object.keys(htmlRules.attributes),
].sort((a, b) => b.length - a.length);
console.log(VALID_TAGS);

const _monaco = typeof monaco === 'undefined' ? self.monaco : monaco; //eslint-disable-line

const EMPTY_ELEMENTS = ['br', 'embed'];

export const conf = {
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
      [
        /(<)((?:[\w-]+:)?[\w-]+)(\s*)(\/>)/,
        ['delimiter', 'tag', '', 'delimiter'],
      ],
      [
        new RegExp('(<)(' + VALID_TAGS.join('|') + ')'),
        ['delimiter', { token: 'tag', next: '@otherTag' }],
      ],
      [
        /(<)((?:[\w-]+:)?[\w-]+)/,
        ['delimiter', { token: 'invalidtag', next: '@otherTag' }],
      ],
      [
        new RegExp('(</)(' + VALID_TAGS.join('|') + ')'),
        ['delimiter', { token: 'tag', next: '@otherTag' }],
      ],
      [
        /(<\/)((?:[\w-]+:)?[\w-]+)/,
        ['delimiter', { token: 'invalidtag', next: '@otherTag' }],
      ],
      [/</, 'delimiter'],
      [/[^<]+/],
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
