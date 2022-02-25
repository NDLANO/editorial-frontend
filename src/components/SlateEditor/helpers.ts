import { TYPE_ASIDE } from './plugins/aside/types';
import { TYPE_BODYBOX } from './plugins/bodybox/utils';
import { TYPE_CODEBLOCK } from './plugins/codeBlock/types';
import { TYPE_CONCEPT } from './plugins/concept';
import { TYPE_DETAILS } from './plugins/details/types';
import { TYPE_EMBED } from './plugins/embed';
import { TYPE_FILE } from './plugins/file';
import { TYPE_FOOTNOTE } from './plugins/footnote';
import { TYPE_CONTENT_LINK, TYPE_LINK } from './plugins/link';
import { TYPE_MATHML } from './plugins/mathml';
import { TYPE_RELATED } from './plugins/related';
import { TYPE_SPAN } from './plugins/span';
import { TYPE_TABLE } from './plugins/table/utils';

export const inlines = [
  TYPE_CONCEPT,
  TYPE_FOOTNOTE,
  TYPE_LINK,
  TYPE_CONTENT_LINK,
  TYPE_MATHML,
  TYPE_SPAN,
];

export const blocks = [
  TYPE_ASIDE,
  TYPE_BODYBOX,
  TYPE_CODEBLOCK,
  TYPE_DETAILS,
  TYPE_EMBED,
  TYPE_FILE,
  TYPE_RELATED,
  TYPE_TABLE,
];
