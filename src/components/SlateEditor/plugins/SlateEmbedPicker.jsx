import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';
import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../schema';

class SlateEmbedPicker extends React.Component {
  constructor() {
    super();
    this.onEmbedAdd = this.onEmbedAdd.bind(this);
  }

  onEmbedAdd(embed) {
    const { blocks, state, onStateChange, onEmbedClose } = this.props;

    const blockToInsert = defaultEmbedBlock(embed);
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

  render() {
    const { isOpen, resource, onEmbedClose } = this.props;
    return (
      <Lightbox display={isOpen} big onClose={onEmbedClose}>
        <VisualElementSearch
          selectedResource={resource}
          handleVisualElementChange={this.onEmbedAdd}
        />
      </Lightbox>
    );
  }
}

SlateEmbedPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onStateChange: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  onEmbedClose: PropTypes.func.isRequired,
  blocks: PropTypes.array.isRequired,
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
  }),
};

export default SlateEmbedPicker;
