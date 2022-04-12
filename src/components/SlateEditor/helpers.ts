import { TYPE_ASIDE } from './plugins/aside/types';
import { TYPE_BODYBOX } from './plugins/bodybox/types';
import { TYPE_CODEBLOCK } from './plugins/codeBlock/types';
import { TYPE_CONCEPT_INLINE } from './plugins/concept/inline/types';
import { TYPE_DETAILS } from './plugins/details/types';
import { TYPE_EMBED } from './plugins/embed/types';
import { TYPE_FILE } from './plugins/file/types';
import { TYPE_FOOTNOTE } from './plugins/footnote/types';
import { TYPE_LINK, TYPE_CONTENT_LINK } from './plugins/link/types';
import { TYPE_MATHML } from './plugins/mathml/types';
import { TYPE_RELATED } from './plugins/related/types';
import { TYPE_SPAN } from './plugins/span/types';
import { TYPE_TABLE } from './plugins/table/types';

export const inlines = [
  TYPE_CONCEPT_INLINE,
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
