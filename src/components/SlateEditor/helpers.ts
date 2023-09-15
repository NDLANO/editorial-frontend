import { TYPE_ASIDE } from './plugins/aside/types';
import { TYPE_AUDIO } from './plugins/audio/types';
import { TYPE_BLOGPOST } from './plugins/blogPost/types';
import { TYPE_BODYBOX } from './plugins/bodybox/types';
import { TYPE_CAMPAIGN_BLOCK } from './plugins/campaignBlock/types';
import { TYPE_CODEBLOCK } from './plugins/codeBlock/types';
import { TYPE_CONCEPT_INLINE } from './plugins/concept/inline/types';
import { TYPE_DETAILS } from './plugins/details/types';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from './plugins/embed/types';
import { TYPE_FILE } from './plugins/file/types';
import { TYPE_FOOTNOTE } from './plugins/footnote/types';
import { TYPE_GRID } from './plugins/grid/types';
import { TYPE_KEY_FIGURE } from './plugins/keyFigure/types';
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
  TYPE_AUDIO,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
  TYPE_FILE,
  TYPE_RELATED,
  TYPE_TABLE,
  TYPE_BLOGPOST,
  TYPE_GRID,
  TYPE_KEY_FIGURE,
  TYPE_CAMPAIGN_BLOCK,
  TYPE_EMBED_IMAGE,
];
