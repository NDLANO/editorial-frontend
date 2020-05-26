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
import SlateImage from '../../components/SlateEditor/plugins/embed/SlateImage';
import EditVisualElementImage from './EditVisualElementImage';
import DisplayExternalVisualElement from '../../components/DisplayEmbed/DisplayExternalVisualElement';
import SlateVideo from '../../components/SlateEditor/plugins/embed/SlateVideo';

const DisplayVisualElement = ({
  embed,
  changeVisualElement,
  onRemoveClick,
  className,
  onChange,
  language,
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
          language={language}
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
              target: { name: 'visualElementCaption', value: e.target.value },
            })
          }
          language={language}
        />
      );
    case 'external':
    case 'iframe':
      return (
        <DisplayExternalVisualElement
          embed={embed}
          changeVisualElement={changeVisualElement}
          onRemoveClick={onRemoveClick}
          onFigureInputChange={e =>
            onChange({
              target: { name: 'visualElementCaption', value: e.target.value },
            })
          }
          language={language}
        />
      );
    default:
      return <p>{`Mediatype ${embed.resource} is not supported yet.`}</p>;
  }
};

DisplayVisualElement.propTypes = {
  embed: EmbedShape.isRequired,
  className: PropTypes.string,
  changeVisualElement: PropTypes.func,
  onRemoveClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  language: PropTypes.string,
};

DisplayVisualElement.defaultProps = {
  className: '',
};

export default DisplayVisualElement;
