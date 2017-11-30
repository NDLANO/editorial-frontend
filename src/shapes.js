import PropTypes from 'prop-types';

export const AudioResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
});

export const ImageResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  altText: PropTypes.string,
  metaUrl: PropTypes.string.isRequired,
  previewUrl: PropTypes.string.isRequired,
});

export const ArticleResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  articleType: PropTypes.string.isRequired,
});

export const SearchResultShape = PropTypes.shape({
  results: PropTypes.arrayOf(
    PropTypes.oneOfType([
      ArticleResultShape,
      AudioResultShape,
      ImageResultShape,
    ]),
  ).isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
});

export const MessageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  message: PropTypes.string,
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
    authors: PropTypes.array.isRequired,
  }).isRequired,
});

export const ArticleShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
});

export const AudioShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
});

export const ImageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});

export const EmbedShape = PropTypes.shape({
  resource: PropTypes.string.isRequired,
  url: PropTypes.string,
  videoid: PropTypes.string,
  resource_id: PropTypes.string,
  caption: PropTypes.string,
  alt: PropTypes.string,
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
  checkbox: PropTypes.bool.isRequired,
});

export const SchemaShape = PropTypes.shape({
  fields: PropTypes.object.isRequired,
  isValid: PropTypes.bool.isRequired,
});

export const CommonFieldPropsShape = PropTypes.shape({
  schema: SchemaShape,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
});

export const PluginShape = PropTypes.shape({
  schema: PropTypes.object.isRequired,
});

export const EditorShape = PropTypes.shape({
  onChange: PropTypes.func.isRequired,
  props: PropTypes.shape({
    submitted: PropTypes.bool.isRequired,
    slateStore: PropTypes.shape({
      getState: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }),
});
