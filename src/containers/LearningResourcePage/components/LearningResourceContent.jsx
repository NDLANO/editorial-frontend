/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getLocale } from '../../../modules/locale/locale';
import { TextField } from '../../../components/Fields';
import RichBlockTextField from '../../../components/RichBlockTextField';
import LearningResourceIngress from './LearningResourceIngress';
import {
  renderNode,
  schema,
  renderMark,
} from '../../../components/SlateEditor/editorSchema';
import footnotePlugin from '../../../components/SlateEditor/plugins/footnote';
import createEmbedPlugin from '../../../components/SlateEditor/plugins/embed';
import createBodyBoxPlugin from '../../../components/SlateEditor/plugins/bodybox';
import createAsidePlugin from '../../../components/SlateEditor/plugins/aside';
import createDetailsPlugin from '../../../components/SlateEditor/plugins/detailsbox';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import blockPickerPlugin from '../../../components/SlateEditor/plugins/blockPicker';
import relatedPlugin from '../../../components/SlateEditor/plugins/related';
import filePlugin from '../../../components/SlateEditor/plugins/file';
import conceptPlugin from '../../../components/SlateEditor/plugins/concept';
import { createEmptyValue } from '../../../util/articleContentConverter';
import pasteHandler from '../../../components/SlateEditor/plugins/pasteHandler';
import blockquotePlugin from '../../../components/SlateEditor/plugins/blockquotePlugin';
import paragraphPlugin from '../../../components/SlateEditor/plugins/paragraph';
import mathmlPlugin from '../../../components/SlateEditor/plugins/mathml';

import {
  editListPlugin,
  editTablePlugin,
} from '../../../components/SlateEditor/plugins/externalPlugins';
import createTablePlugin from '../../../components/SlateEditor/plugins/table';

import { formClasses } from '../../Form';
import { CommonFieldPropsShape } from '../../../shapes';

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    const { locale } = props;
    this.addSection = this.addSection.bind(this);
    this.plugins = [
      footnotePlugin(),
      createEmbedPlugin(locale),
      createBodyBoxPlugin(),
      createAsidePlugin(),
      createDetailsPlugin(),
      createLinkPlugin(),
      conceptPlugin(),
      headingPlugin(),
      // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
      // Blockquote and editList actions need to be triggered before paragraph action, else
      // unwrapping (jumping out of block) will not work.
      blockquotePlugin,
      editListPlugin,
      paragraphPlugin(),

      createTablePlugin(),
      editTablePlugin,
      relatedPlugin(),
      filePlugin(),
      mathmlPlugin(),
      blockPickerPlugin(this.addSection),
      pasteHandler(),
    ];
  }

  addSection() {
    const {
      commonFieldProps: { bindInput },
    } = this.props;
    const { value, onChange } = bindInput('content');
    const newblocks = [].concat(value);
    newblocks.push({ value: createEmptyValue(), index: value.length });
    onChange({
      target: {
        name: 'content',
        value: newblocks,
      },
    });
  }

  render() {
    const { t, commonFieldProps, children } = this.props;
    const contentPlaceholder = (
      <span
        {...formClasses('placeholder')}
        style={{
          opacity: '0.333',
        }}>
        {t('form.content.placeholder')}
      </span>
    );

    return (
      <Fragment>
        <TextField
          label={t('form.title.label')}
          name="title"
          title
          noBorder
          placeholder={t('form.title.label')}
          data-cy="learning-resource-title"
          {...commonFieldProps}
        />
        <LearningResourceIngress t={t} commonFieldProps={commonFieldProps} />
        <div {...formClasses('add-media-links')}>
          <Link to="/media/audio-upload/new" target="_blank">
            {t('form.addNewAudio')}
          </Link>
          <Link to="/media/image-upload/new" target="_blank">
            {t('form.addNewImage')}
          </Link>
        </div>
        <RichBlockTextField
          slateSchema={schema}
          renderNode={renderNode}
          renderMark={renderMark}
          label={t('form.content.label')}
          placeholder={contentPlaceholder}
          name="content"
          data-cy="learning-resource-content"
          plugins={this.plugins}
          {...commonFieldProps}
        />
        {children}
      </Fragment>
    );
  }
}

LearningResourceContent.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(LearningResourceContent));
