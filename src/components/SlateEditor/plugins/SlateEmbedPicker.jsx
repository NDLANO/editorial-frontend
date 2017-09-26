import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
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
    const change = currentState.state.change().insertBlock(blockToInsert);
    newblocks[state.index] = {
      ...newblocks[state.index],
      state: change.state,
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
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      state: Types.state.isRequired,
    }),
  ),
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    state: Types.state.isRequired,
  }),
};

export default SlateEmbedPicker;
