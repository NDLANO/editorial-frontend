import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution.js';

var _monaco = typeof monaco === 'undefined' ? self.monaco : monaco; // eslint-disable-line

registerLanguage({
  id: 'html',
  extensions: [
    '.html',
    '.htm',
    '.shtml',
    '.xhtml',
    '.mdoc',
    '.jsp',
    '.asp',
    '.aspx',
    '.jshtm',
  ],
  aliases: ['HTML', 'htm', 'html', 'xhtml'],
  mimetypes: ['text/html', 'text/x-jshtm', 'text/template', 'text/ng-template'],
  loader: function() {
    return _monaco.Promise.wrap(import('./html.js'));
  },
});
