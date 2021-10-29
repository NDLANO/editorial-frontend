/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, RefObject, useMemo, useState } from 'react';
import { FieldHeader } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { connect } from 'formik';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Tooltip from '@ndla/tooltip';
import { Eye } from '@ndla/icons/editor';
import { headingPlugin } from '../../../../components/SlateEditor/plugins/heading';
import { noEmbedPlugin } from '../../../../components/SlateEditor/plugins/noEmbed';
import VisualElementField from '../../../FormikForm/components/VisualElementField';
import LastUpdatedLine from './../../../../components/LastUpdatedLine/LastUpdatedLine';
import ToggleButton from '../../../../components/ToggleButton';
import HowToHelper from '../../../../components/HowTo/HowToHelper';

import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { listPlugin } from '../../../../components/SlateEditor/plugins/list';
import { conceptPlugin } from '../../../../components/SlateEditor/plugins/concept';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import { linkPlugin } from '../../../../components/SlateEditor/plugins/link';
import { mathmlPlugin } from '../../../../components/SlateEditor/plugins/mathml';
import FormikField from '../../../../components/FormikField';
import RichTextEditor from '../../../../components/SlateEditor/RichTextEditor';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import { IngressField, TitleField } from '../../../FormikForm';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { toEditMarkup } from '../../../../util/routeHelpers';
import { textTransformPlugin } from '../../../../components/SlateEditor/plugins/textTransform';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { divPlugin } from '../../../../components/SlateEditor/plugins/div';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { TopicArticleFormikType } from '../../../FormikForm/articleFormHooks';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import options from '../../../../components/SlateEditor/plugins/blockPicker/options';
import { useSession } from '../../../Session/SessionProvider';

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

const actions = ['table', 'embed', 'code-block', 'file', 'h5p'];
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  bodybox: actions,
  summary: actions,
};

const createPlugins = (language: string, handleSubmitRef: RefObject<() => void>): SlatePlugin[] => {
  // Plugins are checked from last to first
  return [
    sectionPlugin,
    divPlugin,
    paragraphPlugin(
      language,
      options({
        actionsToShowInAreas,
      }),
    ),
    noEmbedPlugin,
    linkPlugin(language),
    headingPlugin,
    // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
    // Blockquote and editList actions need to be triggered before paragraph action, else
    // unwrapping (jumping out of block) will not work.
    blockQuotePlugin,
    listPlugin,
    conceptPlugin(language),
    mathmlPlugin,
    markPlugin,
    dndPlugin,
    toolbarPlugin,
    textTransformPlugin,
    breakPlugin,
    saveHotkeyPlugin(() => handleSubmitRef.current && handleSubmitRef.current()),
  ];
};

interface Props {
  values: TopicArticleFormikType;
  handleBlur: (evt: { target: { name: string } }) => void;
  handleSubmit: () => Promise<void>;
}

const TopicArticleContent = (props: Props) => {
  const { t } = useTranslation();
  const {
    values: { id, language, creators, published },
    handleSubmit,
  } = props;
  const { userAccess } = useSession();
  const [preview, setPreview] = useState(false);
  const handleSubmitRef = React.useRef(handleSubmit);
  const plugins = useMemo(() => {
    return createPlugins(language ?? '', handleSubmitRef);
  }, [language]);

  React.useEffect(() => {
    handleSubmitRef.current = handleSubmit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit]);

  return (
    <Fragment>
      <TitleField handleSubmit={handleSubmit} />
      <FormikField name="published" css={byLineStyle}>
        {({ field, form }) => (
          <>
            <LastUpdatedLine
              name={field.name}
              creators={creators}
              published={published}
              allowEdit={true}
              onChange={date => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <Tooltip tooltip={t('form.markdown.button')}>
                <ToggleButton active={preview} onClick={() => setPreview(!preview)}>
                  <Eye />
                </ToggleButton>
              </Tooltip>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </>
        )}
      </FormikField>
      <IngressField preview={preview} handleSubmit={handleSubmit} />
      <VisualElementField />
      <FormikField name="content" label={t('form.content.label')} noBorder>
        {({ field: { value, name, onChange }, form: { isSubmitting } }) => (
          <Fragment>
            <FieldHeader title={t('form.content.label')}>
              {id && userAccess && userAccess.includes(DRAFT_HTML_SCOPE) && language && (
                <EditMarkupLink to={toEditMarkup(id, language)} title={t('editMarkup.linkTitle')} />
              )}
            </FieldHeader>
            <RichTextEditor
              placeholder={t('form.content.placeholder')}
              value={value}
              submitted={isSubmitting}
              plugins={plugins}
              onChange={value => {
                onChange({
                  target: {
                    value,
                    name,
                  },
                });
              }}
            />
          </Fragment>
        )}
      </FormikField>
    </Fragment>
  );
};

export default connect(TopicArticleContent);
