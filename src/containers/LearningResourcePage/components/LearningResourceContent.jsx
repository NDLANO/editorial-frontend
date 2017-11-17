/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { TextField } from '../../../components/Fields';
import RichBlockTextField from '../../../components/RichBlockTextField';
import Accordion from '../../../components/Accordion';
import LearningResourceIngress from './LearningResourceIngress';
import schema from '../../../components/SlateEditor/schema';
import footnotePlugin from '../../../components/SlateEditor/plugins/footnote';
import createEmbedPlugin from '../../../components/SlateEditor/plugins/embed';
import createBodyBoxPlugin from '../../../components/SlateEditor/plugins/bodybox';
import createAsidePlugin from '../../../components/SlateEditor/plugins/aside';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import pasteContentPlugin from '../../../components/SlateEditor/plugins/pasteContent';
import blockPickerPlugin from '../../../components/SlateEditor/plugins/blockPicker';
import { createEmptyState } from '../../../util/articleContentConverter';

import {
  editListPlugin,
  blockquotePlugin,
  editTablePlugin,
} from '../../../components/SlateEditor/plugins/externalPlugins';
import createTablePlugin from '../../../components/SlateEditor/plugins/table';

import { classes } from './LearningResourceForm';
import { CommonFieldPropsShape } from '../../../shapes';

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
    this.addSection = this.addSection.bind(this);

    this.plugins = [
      footnotePlugin(),
      createEmbedPlugin(),
      createBodyBoxPlugin(),
      createAsidePlugin(),
      createLinkPlugin(),
      headingPlugin(),
      blockquotePlugin,
      editListPlugin,
      createTablePlugin(),
      editTablePlugin,
      pasteContentPlugin(),
      blockPickerPlugin(this.addSection),
    ];
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  addSection() {
    const { commonFieldProps: { bindInput } } = this.props;
    const { value, onChange } = bindInput('content');
    const newblocks = [].concat(value);
    newblocks.push({ state: createEmptyState(), index: value.length });
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
        {...classes('placeholder')}
        style={{
          opacity: '0.333',
        }}>
        {t('form.content.placeholder')}
      </span>
    );

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.contentSection')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('form.title.label')}
          name="title"
          title
          noBorder
          placeholder={t('form.title.label')}
          {...commonFieldProps}
        />
        <LearningResourceIngress t={t} commonFieldProps={commonFieldProps} />
        <RichBlockTextField
          slateSchema={schema}
          label={t('form.content.label')}
          placeholder={contentPlaceholder}
          name="content"
          plugins={this.plugins}
          {...commonFieldProps}
        />
        {children}
      </Accordion>
    );
  }
}

LearningResourceContent.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
};

export default injectT(LearningResourceContent);
