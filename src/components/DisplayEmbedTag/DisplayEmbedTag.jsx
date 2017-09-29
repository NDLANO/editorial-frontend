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
import DisplayBrightcoveTag from './DisplayBrightcoveTag';
import DisplayExternal from './DisplayExternal';
import DisplayOembed from './DisplayOembed';
import { EmbedShape } from '../../shapes';

const DisplayEmbedTag = ({ embedTag, className }) => {
  switch (embedTag.resource) {
    case 'image':
      return <DisplayImageTag embedTag={embedTag} className={className} />;
    case 'brightcove':
      return <DisplayBrightcoveTag embedTag={embedTag} className={className} />;
    case 'external':
      return <DisplayExternal url={embedTag.url} />;
    case 'h5p':
      return <DisplayOembed url={embedTag.url} />;
    default:
      return <p>{`Mediatype ${embedTag.resource} is not supported yet.`}</p>;
  }
};

DisplayEmbedTag.propTypes = {
  embedTag: EmbedShape.isRequired,
  className: PropTypes.string,
};

DisplayEmbedTag.defaultProps = {
  className: '',
};

export default DisplayEmbedTag;
