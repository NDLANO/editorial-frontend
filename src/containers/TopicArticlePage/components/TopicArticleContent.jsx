/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { connect } from 'formik';
import { css } from '@emotion/core';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import createNoEmbedsPlugin from '../../../components/SlateEditor/plugins/noEmbed';
import TopicArticleVisualElement from './TopicArticleVisualElement';
import { schema } from '../../../components/SlateEditor/editorSchema';
import LastUpdatedLine from './../../../components/LastUpdatedLine';
import {
  renderBlock,
  renderMark,
  renderInline,
} from '../../../components/SlateEditor/slateRendering';
import blockquotePlugin from '../../../components/SlateEditor/plugins/blockquotePlugin';
import { editListPlugin } from '../../../components/SlateEditor/plugins/externalPlugins';
import paragraphPlugin from '../../../components/SlateEditor/plugins/paragraph';
import createLinkPlugin from '../../../components/SlateEditor/plugins/link';
import FormikField from '../../../components/FormikField';
import RichTextEditor from '../../../components/SlateEditor/RichTextEditor';
import { EditMarkupLink } from '../../LearningResourcePage/components/EditMarkupLink';
import { FormikIngress } from '../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../constants';
import { toEditMarkup } from '../../../util/routeHelpers';
import toolbarPlugin from '../../../components/SlateEditor/plugins/SlateToolbar';

const byLineStyle = css`
  display: flex;
  margin-top: 0;
`;

const TopicArticleContent = props => {
  const {
    t,
    userAccess,
    formik: {
      values: { id, language, creators, published, visualElement },
    },
  } = props;
  const [plugins, setPlugins] = useState([]);
  useEffect(() => {
    if (plugins.length === 0) {
      setPlugins([
        createNoEmbedsPlugin(),
        headingPlugin(),

        // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
        // Blockquote and editList actions need to be triggered before paragraph action, else
        // unwrapping (jumping out of block) will not work.
        blockquotePlugin,
        editListPlugin,
        createLinkPlugin(language),
        paragraphPlugin(),
        toolbarPlugin(),
      ]);
    }
  });

  return (
    <Fragment>
      <FormikField
        label={t('form.title.label')}
        name="title"
        title
        noBorder
        placeholder={t('form.title.label')}
      />
      <FormikField name="published" css={byLineStyle}>
        {({ field, form }) => (
          <LastUpdatedLine
            name={field.name}
            creators={creators}
            published={published}
            onChange={date => {
              form.setFieldValue(field.name, date);
            }}
          />
        )}
      </FormikField>
      <FormikIngress />
      <TopicArticleVisualElement visualElement={visualElement} />
      <FormikField name="content" label={t('form.content.label')} noBorder>
        {({ field, form: { isSubmitting } }) => (
          <Fragment>
            <FieldHeader title={t('form.content.label')}>
              {id && userAccess && userAccess.includes(DRAFT_HTML_SCOPE) && (
                <EditMarkupLink
                  to={toEditMarkup(id, language)}
                  title={t('editMarkup.linkTitle')}
                />
              )}
            </FieldHeader>
            <RichTextEditor
              placeholder={t('form.content.placeholder')}
              id={field.name}
              submitted={isSubmitting}
              renderBlock={renderBlock}
              renderInline={renderInline}
              renderMark={renderMark}
              plugins={plugins}
              schema={schema}
              {...field}
            />
          </Fragment>
        )}
      </FormikField>
    </Fragment>
  );
};

TopicArticleContent.propTypes = {
  userAccess: PropTypes.string,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      id: PropTypes.number,
      language: PropTypes.string,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
      creators: PropTypes.array,
      visualElement: PropTypes.object,
    }),
    initialValues: PropTypes.shape({
      id: PropTypes.number,
      published: PropTypes.string,
      title: PropTypes.string,
      updatePublished: PropTypes.bool,
    }),
  }),
};

export default connect(injectT(TopicArticleContent));
