import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { File } from '@ndla/ui';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import SlateInputField from '../embed/SlateInputField';
import { Portal } from '../../../Portal';
import { EmbedFileShape } from '../../../../shapes';

class EditFile extends Component {
  render() {
    const {
      t,
      file,
      onExit,
      onFileListInputChange,
      submitted,
      editMode,
    } = this.props;
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
          <Modal
            controllable
            isOpen
            onClose={onExit}
            size="large"
            backgroundColor="white"
            minHeight="85vh">
            {onCloseModal => (
              <Fragment>
                <ModalHeader>
                  <ModalCloseButton
                    title={t('dialog.close')}
                    onClick={onCloseModal}
                  />
                </ModalHeader>
                <ModalBody>
                  <div
                    ref={embedEl => {
                      this.embedEl = embedEl;
                    }}>
                    <File file={file} id="file-embed" />
                    <SlateInputField
                      id={file.id}
                      name="title"
                      noBorder={false}
                      label={t('form.file.title.label')}
                      type="text"
                      value={file.title}
                      onChange={onFileListInputChange}
                      placeholder={t('form.file.title.placeholder')}
                      submitted={submitted}
                    />
                  </div>
                </ModalBody>
              </Fragment>
            )}
          </Modal>
        </Portal>
      </Fragment>
    );
  }
}

EditFile.propTypes = {
  file: EmbedFileShape,
  onExit: PropTypes.func.isRequired,
  onFileListInputChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
};

EditFile.defaultProps = {
  submitted: false,
};

export default injectT(EditFile);
