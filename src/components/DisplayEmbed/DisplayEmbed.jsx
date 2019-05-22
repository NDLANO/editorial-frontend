/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EmbedShape } from '../../shapes';
import SlateImage from '../SlateEditor/plugins/embed/SlateImage';
import EditVisualElementImage from './EditVisualElementImage';
import DisplayExternalVisualElement from './DisplayExternalVisualElement';
import SlateVideo from '../SlateEditor/plugins/embed/SlateVideo';

const DisplayEmbed = ({
  embed,
  changeVisualElement,
  onRemoveClick,
  className,
  onChange,
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
        <SlateVideo
          embed={embed}
          className={className}
          onRemoveClick={onRemoveClick}
          figureClass={{ className: 'c-editor__figure' }}
          onFigureInputChange={e =>
            onChange({
              target: { name: 'visualElement.caption', value: e.target.value },
            })
          }
        />
      );
    case 'external':
      return (
        <DisplayExternalVisualElement
          embed={embed}
          changeVisualElement={changeVisualElement}
          onRemoveClick={onRemoveClick}
          onFigureInputChange={e =>
            onChange({
              target: { name: 'visualElement.caption', value: e.target.value },
            })
          }
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
  onRemoveClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

DisplayEmbed.defaultProps = {
  className: '',
};

export default DisplayEmbed;
