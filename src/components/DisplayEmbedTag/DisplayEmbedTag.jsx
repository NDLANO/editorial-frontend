/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import DisplayImageTag from './DisplayImageTag';
import DisplayVideoTag from './DisplayVideoTag';

const DisplayEmbedTag = ({ embedTag, className, deletedOnSave }) => {
  if (!embedTag) {
    return null;
  }

  switch (embedTag.resource) {
    case 'image':
      return (
        <DisplayImageTag
          embedTag={embedTag}
          className={className}
          deletedOnSave={deletedOnSave}
        />
      );
    case 'brightcove':
      return (
        <DisplayVideoTag
          embedTag={embedTag}
          className={className}
          deletedOnSave={deletedOnSave}
        />
      );
    default:
      return <p>{`Mediatype ${embedTag.resource} is not supported yet.`}</p>;
  }
};

DisplayEmbedTag.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string,
    resource: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  deletedOnSave: PropTypes.bool,
};

DisplayEmbedTag.defaultProps = {
  className: '',
  deletedOnSave: false,
};

export default DisplayEmbedTag;
