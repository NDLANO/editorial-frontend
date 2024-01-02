/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, useField, useFormikContext } from 'formik';
import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import { Eye } from '@ndla/icons/editor';
import { IAuthor } from '@ndla/types-backend/draft-api';
import LearningResourceFootnotes, { FootnoteType } from './LearningResourceFootnotes';
import { learningResourcePlugins } from './learningResourcePlugins';
import { learningResourceRenderers } from './learningResourceRenderers';
import AlertModal from '../../../../components/AlertModal';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import FormikField from '../../../../components/FormikField';
import HowToHelper from '../../../../components/HowTo/HowToHelper';
import LastUpdatedLine from '../../../../components/LastUpdatedLine/LastUpdatedLine';
import { TYPE_AUDIO } from '../../../../components/SlateEditor/plugins/audio/types';
import { learningResourceActions } from '../../../../components/SlateEditor/plugins/blockPicker/actions';
import { TYPE_CODEBLOCK } from '../../../../components/SlateEditor/plugins/codeBlock/types';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_IMAGE,
} from '../../../../components/SlateEditor/plugins/embed/types';
import { TYPE_FILE } from '../../../../components/SlateEditor/plugins/file/types';
import { FootnoteElement } from '../../../../components/SlateEditor/plugins/footnote';
import { TYPE_FOOTNOTE } from '../../../../components/SlateEditor/plugins/footnote/types';
import { TYPE_GRID } from '../../../../components/SlateEditor/plugins/grid/types';
import { TYPE_H5P } from '../../../../components/SlateEditor/plugins/h5p/types';
import { TYPE_TABLE } from '../../../../components/SlateEditor/plugins/table/types';
import RichTextEditor from '../../../../components/SlateEditor/RichTextEditor';
import { DRAFT_HTML_SCOPE } from '../../../../constants';
import { isFormikFormDirty } from '../../../../util/formHelper';
import { toCreateLearningResource, toEditMarkup } from '../../../../util/routeHelpers';
import { findNodesByType } from '../../../../util/slateHelpers';
import { IngressField, TitleField } from '../../../FormikForm';
import { HandleSubmitFunc, LearningResourceFormType } from '../../../FormikForm/articleFormHooks';
import { useSession } from '../../../Session/SessionProvider';

const StyledFormikField = styled(FormikField)`
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 64px;
`;

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StyledContentDiv = styled(FormikField)`
  position: static;
`;

const MarkdownButton = styled(IconButtonV2)`
  color: ${colors.brand.light};

  &[data-active='true'] {
    color: ${colors.brand.primary};
  }
`;

const findFootnotes = (content: Descendant[]): FootnoteType[] =>
  findNodesByType(content, TYPE_FOOTNOTE)
    .map((e) => e as FootnoteElement)
    .filter((footnote) => Object.keys(footnote.data).length > 0)
    .map((footnoteElement) => footnoteElement.data);

const visualElements = [TYPE_H5P, TYPE_EMBED_BRIGHTCOVE, TYPE_AUDIO, TYPE_EMBED_EXTERNAL, TYPE_EMBED_IMAGE];

const actions = [TYPE_TABLE, TYPE_CODEBLOCK, TYPE_FILE, TYPE_GRID].concat(visualElements);
const actionsToShowInAreas = {
  details: actions,
  aside: actions,
  framedContent: actions,
  'table-cell': [TYPE_EMBED_IMAGE],
  'grid-cell': [TYPE_EMBED_IMAGE],
};

// Plugins are checked from last to first
interface Props {
  articleLanguage: string;
  articleId?: number;
  handleSubmit: HandleSubmitFunc<LearningResourceFormType>;
  initialHTML: string;
}

const LearningResourceContent = ({ articleLanguage, articleId, handleSubmit: _handleSubmit, initialHTML }: Props) => {
  const { t } = useTranslation();
  const [creatorsField] = useField<IAuthor[]>('creators');
  const [preview, setPreview] = useState(false);

  const { dirty, initialValues, values, status, setStatus } = useFormikContext<LearningResourceFormType>();

  const isFormikDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
        initialHTML,
      }),
    [values, initialValues, dirty, initialHTML],
  );

  const [isNormalizedOnLoad, setIsNormalizedOnLoad] = useState(isFormikDirty);
  const [isTouched, setIsTouched] = useState(false);
  const isCreatePage = toCreateLearningResource() === window.location.pathname;

  useEffect(() => {
    setTimeout(() => {
      if (status.status === 'revertVersion') {
        setIsNormalizedOnLoad(false);
        setIsTouched(true);
        setStatus({ ...status, status: undefined });
      } else if (!isTouched) {
        setIsNormalizedOnLoad(isFormikDirty);
        setIsTouched(true);
      }
    }, 100);
  }, [isFormikDirty, isTouched, setStatus, status, status.status]);

  return (
    <>
      <TitleField />
      <StyledFormikField name="published">
        {({ field, form }) => (
          <StyledDiv>
            <LastUpdatedLine
              creators={creatorsField.value}
              published={field.value}
              allowEdit={true}
              onChange={(date) => {
                form.setFieldValue(field.name, date);
              }}
            />
            <IconContainer>
              <MarkdownButton
                aria-label={t('form.markdown.button')}
                title={t('form.markdown.button')}
                variant="stripped"
                colorTheme="light"
                data-active={preview}
                onClick={() => setPreview(!preview)}
              >
                <Eye />
              </MarkdownButton>
              <HowToHelper pageId="Markdown" tooltip={t('form.markdown.helpLabel')} />
            </IconContainer>
          </StyledDiv>
        )}
      </StyledFormikField>
      <IngressField preview={preview} />
      <AlertModal
        title={t('editorFooter.changeHeader')}
        label={t('editorFooter.changeHeader')}
        show={isNormalizedOnLoad && !isCreatePage}
        text={t('form.content.normalizedOnLoad')}
        actions={[
          {
            text: t('alertModal.continue'),
            onClick: () => setIsNormalizedOnLoad(false),
          },
        ]}
        onCancel={() => setIsNormalizedOnLoad(false)}
        severity="warning"
      />
      <StyledContentDiv name="content" label={t('form.content.label')} noBorder key={values.revision}>
        {(fieldProps) => <ContentField articleLanguage={articleLanguage} articleId={articleId} {...fieldProps} />}
      </StyledContentDiv>
    </>
  );
};

interface ContentFieldProps extends FieldProps<Descendant[]> {
  articleId?: number;
  articleLanguage: string;
}

const ContentField = ({ articleId, field: { name, onChange, value }, articleLanguage }: ContentFieldProps) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { isSubmitting } = useFormikContext<LearningResourceFormType>();

  const blockPickerOptions = useMemo(() => ({ actionsToShowInAreas }), []);

  const onSlateChange = useCallback(
    (val: Descendant[]) => {
      onChange({
        target: {
          value: val,
          name,
        },
      });
    },
    [onChange, name],
  );

  const editorPlugins = useMemo(
    () => learningResourcePlugins.concat(learningResourceRenderers(articleLanguage)),
    [articleLanguage],
  );

  return (
    <>
      <FieldHeader title={t('form.content.label')}>
        {articleId && userPermissions?.includes(DRAFT_HTML_SCOPE) && (
          <EditMarkupLink to={toEditMarkup(articleId, articleLanguage ?? '')} title={t('editMarkup.linkTitle')} />
        )}
      </FieldHeader>
      <RichTextEditor
        actions={learningResourceActions}
        language={articleLanguage}
        blockpickerOptions={blockPickerOptions}
        placeholder={t('form.content.placeholder')}
        value={value}
        submitted={isSubmitting}
        plugins={editorPlugins}
        data-testid="learning-resource-content"
        onChange={onSlateChange}
      />
      {!isSubmitting && <LearningResourceFootnotes footnotes={findFootnotes(value)} />}
    </>
  );
};

export default memo(LearningResourceContent);
