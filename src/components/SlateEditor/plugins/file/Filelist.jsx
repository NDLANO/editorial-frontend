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
import { EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../schema';
import EditFile from './EditFile';

class Filelist extends React.Component {
  constructor(props) {
    super(props);
    const { node, t } = props;
    const { nodes } = getSchemaEmbed(node);

    const files = nodes.map(({ title, type, url }, id) => ({
      id,
      title,
      formats: [
        { url, fileType: type, tooltip: `${t(`form.file.download`)} ${title}` },
      ],
    }));

    this.state = { files, editMode: false };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }

  onFileInputChange(e) {
    const { id, value, name } = e.target;
    const { t, node, editor } = this.props;

    const { files } = this.state;
    files[id][name] = value;

    // Update correct tooltip value in state as well
    if (name === 'title') {
      files[id].formats = files[id].formats.map(format => ({
        ...format,
        tooltip: `${t(`form.file.download`)} ${value}`,
      }));
    }

    this.setState({ files });

    const { nodes } = getSchemaEmbed(node);
    const properties = {
      data: {
        nodes: nodes.map(nodeItem => ({
          ...nodeItem,
          // URL as unique identifier for file embed until proper key/id is added
          [name]: files.filter(file => file.formats[0].url === nodeItem.url)[0][
            name
          ],
        })),
      },
    };

    const next = editor.value.change().setNodeByKey(node.key, properties);
    editor.onChange(next);
  }

  toggleEdit(e) {
    e.stopPropagation();
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const { files, editMode } = this.state;
    const { t } = this.props;

    return (
      <Fragment>
        {editMode ? (
          <EditFile
            heading={t(`form.file.label`)}
            files={files}
            onExit={this.toggleEdit}
            onFileListInputChange={this.onFileInputChange}
            submitted={false}
          />
        ) : (
          <div
            role="button"
            className="c-placeholder-editmode"
            tabIndex={0}
            onKeyPress={this.toggleEdit}
            onClick={this.toggleEdit}>
            {files &&
              files.length > 0 && (
                <FileList
                  heading={t(`form.file.label`)}
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
  editor: EditorShape,
  node: Types.node.isRequired,
  locale: PropTypes.string,
};

export default injectT(Filelist);
