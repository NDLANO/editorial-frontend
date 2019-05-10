/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import DisplayBrightcoveTag from './DisplayBrightcoveTag';
import DisplayExternal from './DisplayExternal';
import { EmbedShape } from '../../shapes';
import SlateImage from '../SlateEditor/plugins/embed/SlateImage';
import EditVisualElementImage from './EditVisualElementImage';

const DisplayEmbed = ({
  embed,
  changeVisualElement,
  onRemoveClick,
  className,
}) => {
  switch (embed.resource) {
    case 'image':
      return (
        <SlateImage
          embed={embed}
          className={className}
          onRemoveClick={onRemoveClick}
          renderEditComponent={props => <EditVisualElementImage {...props} />}
          visualElement
        />
      );
    case 'brightcove':
      return (
        <DisplayBrightcoveTag
          embed={embed}
          className={className}
          onRemoveClick={onRemoveClick}
        />
      );
    case 'external':
      return (
        <DisplayExternal
          embed={embed}
          changeVisualElement={changeVisualElement}
          onRemoveClick={onRemoveClick}
        />
      );
    default:
      return <p>{`Mediatype ${embed.resource} is not supported yet.`}</p>;
  }
};

DisplayEmbed.propTypes = {
  embed: EmbedShape.isRequired,
  className: PropTypes.string,
  changeVisualElement: PropTypes.func,
};

DisplayEmbed.defaultProps = {
  className: '',
};

export default DisplayEmbed;
