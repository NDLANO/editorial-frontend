/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { State } from 'slate';
import { injectT } from 'ndla-i18n';
import { TextField } from '../../../components/Fields';
import RichBlockTextField from '../../../components/RichBlockTextField';
import Accordion from '../../../components/Accordion';
import LearningResourceIngress from './LearningResourceIngress';
import schema from '../../../components/SlateEditor/schema';
import createEmbedPlugin from '../../../components/SlateEditor/embedPlugin';
import { CommonFieldPropsShape } from '../../../shapes';

const plugins = [createEmbedPlugin()];

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }
  removeIngress() {
    const { bindInput } = this.props;
    const ingress = bindInput('introduction');

    ingress.onChange({
      name: ingress.name,
      value: undefined,
    });
  }

  render() {
    const { t, bindInput, commonFieldProps } = this.props;
    const ingressBindInput = bindInput('introduction');
    const ingress = {
      ...ingressBindInput,
      value:
        ingressBindInput.value instanceof State
          ? ingressBindInput.value
          : undefined,
    };
    const contentPlaceholder = (
      <span
        style={{
          position: 'absolute',
          left: '9em',
          top: '4em',
          opacity: '0.333',
        }}>
        {t('learningResourceForm.fields.content.placeholder')}
      </span>
    );
    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('learningResourceForm.content')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('learningResourceForm.fields.title.label')}
          name="title"
          title
          noBorder
          placeholder={t('learningResourceForm.fields.title.label')}
          {...commonFieldProps}
        />
        <div
          ref={ingressRef => {
            this.ingressRef = ingressRef;
          }}>
          <LearningResourceIngress
            commonFieldProps={commonFieldProps}
            {...ingress}
          />
        </div>
        <RichBlockTextField
          slateSchema={schema}
          label={t('learningResourceForm.fields.content.label')}
          placeholder={contentPlaceholder}
          name="content"
          ingress={ingress}
          ingressRef={this.ingressRef}
          plugins={plugins}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceContent.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
  bindInput: PropTypes.func.isRequired,
};

export default injectT(LearningResourceContent);
