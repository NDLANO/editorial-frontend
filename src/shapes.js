import PropTypes from 'prop-types';

export const ArticleResultShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }),
  ).isRequired,
  articleType: PropTypes.string.isRequired,
});

export const MessageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
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
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});
