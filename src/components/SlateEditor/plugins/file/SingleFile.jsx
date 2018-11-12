/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { File } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { EmbedFileShape } from '../../../../shapes';
import EditFile from './EditFile';

class SingleFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit(evt) {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const { editMode } = this.state;
    const { t, file, onFileInputChange } = this.props;
    if (!file) {
      return null;
    }

    return (
      <Fragment>
        <EditFile
          heading={t(`form.file.label`)}
          file={file}
          onExit={this.toggleEdit}
          onFileListInputChange={onFileInputChange}
          submitted={false}
          editMode={editMode}
        />
        <div
          role="button"
          className="c-placeholder-editmode"
          tabIndex={0}
          onKeyPress={this.toggleEdit}
          onClick={this.toggleEdit}>
          <File file={file} id="file-embed" />
        </div>
      </Fragment>
    );
  }
}

SingleFile.propTypes = {
  file: EmbedFileShape,
  locale: PropTypes.string,
  onFileInputChange: PropTypes.func.isRequired,
};

export default injectT(SingleFile);
