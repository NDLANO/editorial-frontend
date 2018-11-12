/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import { EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../schema';
import SingleFile from './SingleFile';

const fileListClasses = BEMHelper('c-file-list');

class FileList extends React.Component {
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

    this.state = { files };
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

  render() {
    const { files } = this.state;
    const { t } = this.props;
    if (files.length === 0) {
      return null;
    }
    return (
      <section {...fileListClasses()}>
        <h1 {...fileListClasses('heading')}>{t(`form.file.label`)}</h1>
        <ul {...fileListClasses('files')}>
          {files.map(file => (
            <SingleFile
              key={`file-${file.id}-${file.formats[0].url}`}
              file={file}
              onFileInputChange={this.onFileInputChange}
            />
          ))}
        </ul>
      </section>
    );
  }
}

FileList.propTypes = {
  editor: EditorShape,
  node: Types.node.isRequired,
  locale: PropTypes.string,
};

export default injectT(FileList);
