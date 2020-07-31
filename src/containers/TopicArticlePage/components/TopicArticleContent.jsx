/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { connect } from 'formik';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { Eye } from '@ndla/icons/editor';
import headingPlugin from '../../../components/SlateEditor/plugins/heading';
import createNoEmbedsPlugin from '../../../components/SlateEditor/plugins/noEmbed';
import TopicArticleVisualElement from './TopicArticleVisualElement';
import { schema } from '../../../components/SlateEditor/editorSchema';
import LastUpdatedLine from './../../../components/LastUpdatedLine';
import ToggleButton from '../../../components/ToggleButton';
import HowToHelper from '../../../components/HowTo/HowToHelper';
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
import { EditMarkupLink } from '../../../components/EditMarkupLink';
import { FormikIngress } from '../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../constants';
import { toEditMarkup } from '../../../util/routeHelpers';
import toolbarPlugin from '../../../components/SlateEditor/plugins/SlateToolbar';

const byLineStyle = css`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 64px;
`;

const createPlugins = language => {
  return [
    createNoEmbedsPlugin(),
    createLinkPlugin(language),
    headingPlugin(),

    // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
    // Blockquote and editList actions need to be triggered before paragraph action, else
    // unwrapping (jumping out of block) will not work.
    blockquotePlugin,
    editListPlugin,
    paragraphPlugin(),
    toolbarPlugin(),
  ];
};

const TopicArticleContent = props => {
  const {
    t,
    userAccess,
    formik: {
      values: { id, language, creators, published, visualElement },
    },
  } = props;
  const [preview, setPreview] = useState(false);
  const plugins = useMemo(() => {
    return createPlugins(language);
  }, [language]);

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
          <>
            <LastUpdatedLine
              name={field.name}
              creators={creators}
              published={published}
              onChange={date => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <Tooltip tooltip={t('form.markdown.button')}>
                <ToggleButton
                  active={preview}
                  onClick={() => setPreview(!preview)}>
                  <Eye />
                </ToggleButton>
              </Tooltip>
              <HowToHelper
                pageId="Markdown"
                tooltip={t('form.markdown.helpLabel')}
              />
            </IconContainer>
          </>
        )}
      </FormikField>
      <FormikIngress preview={preview} />
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
