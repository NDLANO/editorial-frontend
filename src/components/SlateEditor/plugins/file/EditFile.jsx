import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import { File } from '@ndla/ui';

import SlateInputField from '../embed/SlateInputField';
import Overlay from '../../../Overlay';
import { Portal } from '../../../Portal';

const classes = BEMHelper('c-file-list');

class EditFile extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();
    const embedRect = embedEl.getBoundingClientRect();
    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    placeholderEl.style.height = `${embedRect.height + 40}px`;
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top - 30}px`;
    embedEl.style.left = `${placeholderRect.left + 60}px`;
    embedEl.style.width = `${placeholderRect.width - 140}px`;
  }

  render() {
    const {
      t,
      heading,
      files,
      onExit,
      onFileListInputChange,
      submitted,
    } = this.props;
    return (
      <Fragment>
        <Overlay onExit={onExit} key="filesOverlay" />
        <div
          key="filesPlaceholder"
          className="c-audio-box"
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}
        />
        <Portal isOpened key="filePortal">
          <div
            ref={embedEl => {
              this.embedEl = embedEl;
            }}>
            <section {...classes()}>
              <h1 {...classes('heading')}>{heading}</h1>
              <ul {...classes('files')}>
                {files.map(file => [
                  <File
                    key={`file-${file.id}-${file.formats[0].url}`}
                    file={file}
                    id="file-embed"
                  />,
                  <SlateInputField
                    key={`fileTitle-${file.formats[0].url}`}
                    id={file.id}
                    name="title"
                    label={t('form.file.title.label')}
                    type="text"
                    value={file.title}
                    className="c-field--no-margin-top--padding-bottom"
                    onChange={onFileListInputChange}
                    placeholder={t('form.file.title.placeholder')}
                    submitted={submitted}
                  />,
                ])}
              </ul>
            </section>
          </div>
        </Portal>
      </Fragment>
    );
  }
}

EditFile.propTypes = {
  heading: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      formats: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          fileType: PropTypes.string.isRequired,
          tooltip: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onExit: PropTypes.func.isRequired,
  onFileListInputChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};

export default injectT(EditFile);
