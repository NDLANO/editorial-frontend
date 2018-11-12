import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { File } from '@ndla/ui';
import SlateInputField from '../embed/SlateInputField';
import { Portal } from '../../../Portal';
import { EmbedFileShape } from '../../../../shapes';
import Lightbox from '../../../Lightbox';

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
          <Lightbox big onClose={onExit}>
            <div
              ref={embedEl => {
                this.embedEl = embedEl;
              }}>
              <File file={file} id="file-embed" />
              <SlateInputField
                key={`fileTitle-${file.formats[0].url}`}
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
          </Lightbox>
        </Portal>
      </Fragment>
    );
  }
}

EditFile.propTypes = {
  file: EmbedFileShape,
  onExit: PropTypes.func.isRequired,
  onFileListInputChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

export default injectT(EditFile);
