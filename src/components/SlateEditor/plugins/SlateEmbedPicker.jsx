import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';
import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../schema';
import { alttextsI18N, captionsI18N } from '../../../util/i18nFieldFinder';

class SlateEmbedPicker extends React.Component {
  constructor() {
    super();
    this.onEmbedAdd = this.onEmbedAdd.bind(this);
  }

  onEmbedAdd(embed) {
    const { blocks, state, onStateChange, onEmbedClose, embedTag } = this.props;
    let blockToInsert;
    switch (embedTag.resource) {
      case 'image': {
        const data = {
          caption: captionsI18N(embed.captions, 'nb', true),
          alt: alttextsI18N(embed.alttexts, 'nb', true),
          id: embed.id,
          resource: 'image',
        };
        blockToInsert = defaultEmbedBlock(data);
        break;
      }
      case 'brightcove': {
        const data = {
          caption: embed.name,
          id: embed.id,
          resource: 'brightcove',
        };
        blockToInsert = defaultEmbedBlock(data);
        break;
      }
      case 'audio': {
        const data = {
          id: embed.id.toString(),
          resource: 'audio',
        };
        blockToInsert = defaultEmbedBlock(data);
        break;
      }
      default:
    }
    if (blockToInsert) {
      const newblocks = [].concat(blocks);
      const currentState = blocks[state.index];
      const nextState = currentState.state
        .transform()
        .insertBlock(blockToInsert)
        .apply();
      newblocks[state.index] = {
        ...newblocks[state.index],
        state: nextState,
      };
      onStateChange('content', newblocks);
      onEmbedClose();
    }
  }

  render() {
    const { isOpen, embedTag, onEmbedClose } = this.props;
    if (!embedTag || !embedTag.resource) {
      return null;
    }
    return (
      <Lightbox display={isOpen} big onClose={onEmbedClose}>
        <VisualElementSearch
          embedTag={embedTag}
          handleVisualElementChange={this.onEmbedAdd}
        />
      </Lightbox>
    );
  }
}

SlateEmbedPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onStateChange: PropTypes.func.isRequired,
  embedTag: PropTypes.shape({
    resource: PropTypes.string,
  }),
  onEmbedClose: PropTypes.func.isRequired,
  blocks: PropTypes.array.isRequired,
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
  }),
};

export default SlateEmbedPicker;
