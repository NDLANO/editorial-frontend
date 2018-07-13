/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import { FileList } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import EditFiles from './EditFiles';

class Filelist extends React.Component {
  constructor(props) {
    super(props);
    const { node: { data } } = props;

    const files =
      data &&
      data.get('nodes') &&
      data.get('nodes').map(({ title, type, url }) => ({
        title,
        formats: [{ url, fileType: type }],
      }));

    this.state = { files, editMode: false };
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  onFileInputChange(e) {
    const { value, name } = e.target;

    this.setState(prevState => ({
      audio: {
        ...prevState.audio,
        [name]: value,
      },
    }));
    this.props.onFigureInputChange(e);
  }

  toggleEdit(e) {
    e.stopPropagation();
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const { files } = this.state;
    const { t, submitted } = this.props;

    return (
      <Fragment>
        {this.state.editMode ? (
          <EditFiles
            heading={t`form.file.title`}
            files={files}
            onExit={this.toggleEdit}
            onFileListInputChange={this.onFileInputChange}
            submitted={submitted}
          />
        ) : (
          <div
            role="button"
            style={{ cursor: 'pointer' }}
            tabIndex={0}
            onKeyPress={this.toggleEdit}
            onClick={this.toggleEdit}>
            {files &&
              files.length > 0 && (
                <FileList
                  heading={t`form.file.title`}
                  id="file-embed"
                  files={files}
                />
              )}
          </div>
        )}
      </Fragment>
    );
  }
}

Filelist.propTypes = {
  node: Types.node.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  locale: PropTypes.string,
};

export default injectT(Filelist);
