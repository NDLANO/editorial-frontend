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
    const { blocks, value, onValueChange, onEmbedClose } = this.props;

    const blockToInsert = defaultEmbedBlock(embed);
    const newblocks = [].concat(blocks);
    const currentValue = blocks[value.index];
    const change = currentValue.value.change().insertBlock(blockToInsert);
    newblocks[value.index] = {
      ...newblocks[value.index],
      value: change.value,
    };
    onValueChange('content', newblocks);
    onEmbedClose();
  }

  render() {
    const { isOpen, resource, onEmbedClose } = this.props;
    return (
      <Lightbox
        display={isOpen}
        fullscreen={resource === 'h5p'}
        big
        onClose={onEmbedClose}>
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
  onValueChange: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  onEmbedClose: PropTypes.func.isRequired,
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      value: Types.value.isRequired,
    }),
  ),
  value: PropTypes.shape({
    index: PropTypes.number.isRequired,
    value: Types.value.isRequired,
  }),
};

export default SlateEmbedPicker;
