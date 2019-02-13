import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution.js';
import { createLanguageConfiguration } from './html.js';
import { fetchAllRules } from './rulesApi.js';

const _monaco = typeof monaco === 'undefined' ? self.monaco : monaco; // eslint-disable-line

registerLanguage({
  id: 'html',
  extensions: ['.html'],
  aliases: ['HTML', 'html'],
  mimetypes: ['text/html'],
  loader: async function() {
    const rules = await fetchAllRules();

    const VALID_TAGS = [
      'embed',
      ...rules.htmlRules.tags,
      ...Object.keys(rules.htmlRules.attributes),
      ...Object.keys(rules.mathmlRules.attributes),
    ].sort((a, b) => b.length - a.length);

    return createLanguageConfiguration(VALID_TAGS);
  },
});
