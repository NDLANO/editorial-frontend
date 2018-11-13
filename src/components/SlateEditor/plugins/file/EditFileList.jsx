import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import SlateInputField from '../embed/SlateInputField';
import { Portal } from '../../../Portal';
import { EmbedFileShape } from '../../../../shapes';

class EditFileList extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();

    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${placeholderRect.left}px`;
    embedEl.style.width = `${placeholderRect.width}px`;

    const embedRect = embedEl.getBoundingClientRect();

    placeholderEl.style.height = `${embedRect.height}px`;
  }

  render() {
    const { t, editMode } = this.props;
    if (!editMode) {
      return null;
    }

    return (
      <Fragment>
        <div
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}
        />
        <Portal isOpened>
          <Button>X</Button>
        </Portal>
      </Fragment>
    );
  }
}

EditFileList.propTypes = {
  editMode: PropTypes.bool.isRequired,
};

export default injectT(EditFileList);
