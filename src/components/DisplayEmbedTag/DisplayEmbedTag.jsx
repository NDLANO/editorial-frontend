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

const DisplayEmbedTag = ({ embedTag, className }) => {
  if (!embedTag) {
    return null;
  }

  switch (embedTag.resource) {
    case 'image':
      return <DisplayImageTag embedTag={embedTag} className={className} />;
    case 'brightcove':
      return <DisplayVideoTag embedTag={embedTag} className={className} />;
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
};

DisplayEmbedTag.defaultProps = {
  className: '',
};

export default DisplayEmbedTag;
