import PropTypes from 'prop-types';
import { LOCALE_VALUES } from './constants';

export const ResourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  path: PropTypes.string.isRequired,
});

export const ResourceTypeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
});

export const DraftStatusShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const UserShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const SubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  path: PropTypes.string,
});

export const AudioResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.shape({
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
});

export const SeriesResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.shape({
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.shape({
    description: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  episodes: PropTypes.array.isRequired,
  coverPhoto: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
  }).isRequired,
});

export const ImageResultShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.shape({
    title: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }).isRequired,
  metaUrl: PropTypes.string.isRequired,
  previewUrl: PropTypes.string.isRequired,
});

export const ContentResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.shape({ title: PropTypes.string }).isRequired,
  metaDescription: PropTypes.shape({ metaDescription: PropTypes.string }),
  metaImage: PropTypes.shape({
    alt: PropTypes.string,
    url: PropTypes.string,
    language: PropTypes.string,
  }),
  contexts: PropTypes.arrayOf(
    PropTypes.shape({
      learningResourceType: PropTypes.string,
      resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
    }),
  ),
});

export const ArticleResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  articleType: PropTypes.string.isRequired,
});

export const SearchResultShape = PropTypes.shape({
  results: PropTypes.arrayOf(
    PropTypes.oneOfType([ContentResultShape, ImageResultShape, AudioResultShape]),
  ),
  totalCount: PropTypes.number,
  pageSize: PropTypes.number,
});

export const MessageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  message: PropTypes.string,
  statusCode: PropTypes.string,
  translationKey: PropTypes.string,
  severity: PropTypes.string,
  action: PropTypes.shape({
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
});

export const CopyrightObjectShape = PropTypes.shape({
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  copyright: PropTypes.shape({
    creators: PropTypes.array.isRequired,
  }).isRequired,
});

export const NoteShape = PropTypes.shape({
  note: PropTypes.string,
  user: PropTypes.string,
  status: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
});

export const ArticleShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  notes: PropTypes.arrayOf(NoteShape),
  language: PropTypes.string,
  grepCodes: PropTypes.arrayOf(PropTypes.string),
  revision: PropTypes.number,
});

export const NewArticleShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  notes: PropTypes.arrayOf(NoteShape),
  language: PropTypes.string,
});

export const ConceptShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  content: PropTypes.string,
  articleIds: PropTypes.arrayOf(PropTypes.number),
});

export const ImageShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
});

export const EmbedShape = PropTypes.shape({
  resource: PropTypes.string.isRequired,
  url: PropTypes.string,
  videoid: PropTypes.string,
  resource_id: PropTypes.string,
  caption: PropTypes.string,
  alt: PropTypes.string,
});

export const FileShape = PropTypes.shape({
  resource: PropTypes.string.isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string,
});

export const MetaImageShape = PropTypes.shape({
  resource: PropTypes.string,
  resource_id: PropTypes.string,
  caption: PropTypes.string,
  alt: PropTypes.string,
});

export const FootnoteShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
  edition: PropTypes.string.isRequired,
  publisher: PropTypes.string.isRequired,
  type: PropTypes.string,
});

export const LinkShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  checkbox: PropTypes.bool,
});

export const PluginShape = PropTypes.shape({
  schema: PropTypes.object.isRequired,
});

export const EditorShape = PropTypes.shape({
  onChange: PropTypes.func.isRequired,
  props: PropTypes.shape({
    submitted: PropTypes.bool,
    slateStore: PropTypes.shape({
      getState: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }),
});

export const TaxonomyShape = PropTypes.shape({
  taxonomy: PropTypes.shape({
    resourceTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    topics: PropTypes.arrayOf(PropTypes.object).isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
});

export const LicensesArrayOf = PropTypes.arrayOf(
  PropTypes.shape({
    description: PropTypes.string,
    license: PropTypes.string,
  }),
);

export const AudioShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  audioFile: PropTypes.shape({
    mimeType: PropTypes.string,
    url: PropTypes.string,
  }),
  copyright: PropTypes.shape({
    creators: PropTypes.arrayOf(PropTypes.object),
    license: PropTypes.shape({ license: PropTypes.string }),
  }),
});

export const EmbedFileShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  formats: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      fileType: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
    }),
  ).isRequired,
});

export const PossibleStatusShape = PropTypes.shape({
  CREATED: PropTypes.arrayOf(PropTypes.string),
  PROPOSAL: PropTypes.arrayOf(PropTypes.string),
  AWAITING_QUALITY_ASSURANCE: PropTypes.arrayOf(PropTypes.string),
  DRAFT: PropTypes.arrayOf(PropTypes.string),
  USER_TEST: PropTypes.arrayOf(PropTypes.string),
  IMPORTED: PropTypes.arrayOf(PropTypes.string),
  QUALITY_ASSURED: PropTypes.arrayOf(PropTypes.string),
  PUBLISHED: PropTypes.arrayOf(PropTypes.string),
  AWAITING_UNPUBLISHING: PropTypes.arrayOf(PropTypes.string),
  UNPUBLISHED: PropTypes.arrayOf(PropTypes.string),
  ARCHIVED: PropTypes.arrayOf(PropTypes.string),
  QUEUED_FOR_PUBLISHING: PropTypes.arrayOf(PropTypes.string),
});

export const LocationShape = PropTypes.shape({
  search: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  hash: PropTypes.string,
}).isRequired;

export const HistoryShape = PropTypes.shape({
  push: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  block: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  length: PropTypes.number.isRequired,
  location: LocationShape,
  go: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired,
  createHref: PropTypes.func.isRequired,
});

export const MetadataShape = PropTypes.shape({
  grepCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  visible: PropTypes.bool.isRequired,
});

export const TopicConnectionShape = PropTypes.shape({
  connectionId: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool,
  paths: PropTypes.arrayOf(PropTypes.string),
  targetId: PropTypes.string,
  type: PropTypes.string,
});

export const TopicShape = PropTypes.shape({
  connectionId: PropTypes.string,
  contentUri: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  paths: PropTypes.arrayOf(PropTypes.string).isRequired,
  primary: PropTypes.bool,
  topicConnections: PropTypes.arrayOf(TopicConnectionShape),
});

export const AvailableFiltersShape = PropTypes.objectOf(
  PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      subjectId: PropTypes.string,
    }),
  ),
);

export const StructureShape = PropTypes.shape({
  contentUri: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  path: PropTypes.string,
});

export const SupportedToolbarElementsShape = PropTypes.shape({
  mark: PropTypes.arrayOf(PropTypes.string),
  block: PropTypes.arrayOf(PropTypes.string),
  inline: PropTypes.arrayOf(PropTypes.string),
});

export const FormikShape = PropTypes.shape({
  values: PropTypes.shape({}), //Can be arbitrary values
  handleBlur: PropTypes.func,
  errors: PropTypes.shape({}),
  touched: PropTypes.shape({}),
  setFieldValue: PropTypes.func,
});

export const RoutePropTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  location: LocationShape,
  history: HistoryShape.isRequired,
};

export const LocaleShape = PropTypes.oneOf(LOCALE_VALUES);

export const SearchParamsShape = PropTypes.shape({
  query: PropTypes.string,
  subjects: PropTypes.string,
  'resource-types': PropTypes.string,
  'draft-status': PropTypes.string,
  'audio-type': PropTypes.string,
  status: PropTypes.string,
  users: PropTypes.string,
  language: PropTypes.string,
  fallback: PropTypes.bool,
});
