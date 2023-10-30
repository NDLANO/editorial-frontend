/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactEditor } from 'slate-react';
import { Editor, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useCallback, useState } from 'react';
import { H5pEmbedData, H5pMetaData } from '@ndla/types-embed';
import { ModalContent } from '@ndla/modal';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { TextAreaV2 } from '@ndla/forms';
import { H5pElement } from './types';
import H5PElement, { OnSelectObject } from '../../../H5PElement/H5PElement';
import config from '../../../../config';
import { getH5pLocale } from '../../../H5PElement/h5pApi';
import { EditingState } from './SlateH5p';
import FormikFieldDescription from '../../../FormikField/FormikFieldDescription';

const StyledModalBody = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 50px;
  gap: 30px;
`;

const StyledModalContent = styled(ModalContent)`
  padding: 0;
  width: 100% !important;
  height: 100%;
  max-height: 95%;
  overflow: hidden;
`;

const StyledMetadataModalContent = styled(ModalContent)``;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 10px;
`;

interface Props {
  element: H5pElement;
  embed: H5pMetaData | undefined;
  isEditing: EditingState;
  setIsEditing: (value: EditingState) => void;
  language: string;
  editor: Editor;
}

const EditH5P = ({ isEditing, setIsEditing, language, editor, element, embed }: Props) => {
  const { t } = useTranslation();
  const [alttext, setAlttext] = useState(embed?.embedData.alt);
  const onSave = useCallback(
    (params: OnSelectObject) => {
      if (!params.path) {
        return;
      }
      setIsEditing(undefined);
      const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
      const url = `${config.h5pApiUrl}${params.path}?locale=${getH5pLocale(
        language,
      )}&cssUrl=${cssUrl}`;
      const embedData: H5pEmbedData = {
        resource: 'h5p',
        path: params.path,
        title: params.title,
        alt: alttext,
        url,
      };
      const properties = {
        data: embedData,
      };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [alttext, editor, element, language, setIsEditing],
  );

  const onSaveMetadata = useCallback(() => {
    if (!embed?.embedData) {
      return;
    }

    setIsEditing(undefined);
    ReactEditor.focus(editor);
    const data: H5pEmbedData = {
      resource: 'h5p',
      path: embed.embedData.path,
      url: embed.embedData.url,
      title: embed?.embedData.title,
      alt: alttext,
    };
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  }, [alttext, editor, element, embed?.embedData, setIsEditing]);

  const onClose = () => {
    setIsEditing(undefined);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => setAlttext(e.target.value);
  const onCancel = () => {
    setIsEditing(undefined);
    setAlttext(embed?.embedData.alt);
    onClose();
  };

  switch (isEditing) {
    case 'metadata':
      return (
        <StyledMetadataModalContent size="small">
          <StyledModalBody>
            <div>
              <label>{t('form.h5p.metadata.edit')}</label>
              <FormikFieldDescription description={t('form.h5p.metadata.description')} />
            </div>
            <TextAreaV2
              name="alt"
              label={t('form.h5p.metadata.alttext')}
              value={alttext}
              onChange={onChange}
              type="text"
              placeholder={t('form.h5p.metadata.alttext')}
              white
            />
            <ButtonWrapper>
              <ButtonV2 onClick={onCancel}>{t('form.h5p.metadata.cancel')}</ButtonV2>
              <ButtonV2 onClick={onSaveMetadata} disabled={alttext === embed?.embedData.alt}>
                {t('form.h5p.metadata.save')}
              </ButtonV2>
            </ButtonWrapper>
          </StyledModalBody>
        </StyledMetadataModalContent>
      );
    case 'h5p':
      return (
        <StyledModalContent size="large">
          <StyledModalBody>
            <H5PElement
              canReturnResources
              h5pUrl={embed?.embedData.url}
              onClose={onClose}
              locale={language}
              onSelect={onSave}
            />
          </StyledModalBody>
        </StyledModalContent>
      );
    default:
      return null;
  }
};

export default EditH5P;
