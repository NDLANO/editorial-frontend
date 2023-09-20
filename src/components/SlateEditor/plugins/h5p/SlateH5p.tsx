/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { H5pEmbed } from '@ndla/ui';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { H5pEmbedData, H5pMetaData } from '@ndla/types-embed';
import { Spinner } from '@ndla/icons';
import { IconButtonV2 } from '@ndla/button';
import { DeleteForever, Link } from '@ndla/icons/editor';
import { spacing } from '@ndla/core';
import { H5pElement } from './types';
import { StyledDeleteEmbedButton, StyledFigureButtons } from '../embed/FigureButtons';
import { useH5pMeta } from '../../../../modules/embed/queries';
import H5PElement, { OnSelectObject } from '../../../H5PElement/H5PElement';
import config from '../../../../config';
import { getH5pLocale } from '../../../H5PElement/h5pApi';

interface Props extends RenderElementProps {
  element: H5pElement;
  editor: Editor;
  language: string;
}

const H5pWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledModalContent = styled(ModalContent)`
  padding: 0;
  width: 100% !important;
  height: 100%;
  max-height: 95%;
  overflow: hidden;
`;

const FigureButtons = styled(StyledFigureButtons)`
  right: ${spacing.small};
  top: ${spacing.large};
  z-index: 1;
`;

const StyledModalBody = styled.div`
  display: flex;
  height: 100%;
`;

const SlateH5p = ({ element, editor, attributes, children, language }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const h5pMetaQuery = useH5pMeta(element?.data?.url!, {
    enabled: !!element?.data?.url,
  });

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onSave = (h5p: OnSelectObject) => {
    setIsEditing(false);
    const url = `${config.h5pApiUrl}${h5p.path}`;
    const data: H5pEmbedData = {
      url,
      title: h5p.title,
      path: h5p.path ?? '',
      resource: 'h5p',
    };
    const properties = { data };
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, properties, { at: path });
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const embed: H5pMetaData | undefined = useMemo(() => {
    if (!element.data) return undefined;
    const lang = getH5pLocale(language);
    const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
    const url = `${element.data.url}?locale=${lang}&cssUrl=${cssUrl}`;

    return {
      status: h5pMetaQuery.error || !h5pMetaQuery.data ? 'error' : 'success',
      data: h5pMetaQuery.data!,
      embedData: { ...element.data, url },
      resource: 'h5p',
    };
  }, [element.data, h5pMetaQuery.data, h5pMetaQuery.error, language]);

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <H5pWrapper {...attributes} contentEditable={false}>
        {h5pMetaQuery.isInitialLoading ? (
          <Spinner />
        ) : embed ? (
          <>
            <FigureButtons data-white="true">
              <ModalTrigger>
                <IconButtonV2
                  aria-label={t('form.external.edit', { type: 'h5p' })}
                  title={t('form.external.edit', { type: 'h5p' })}
                  colorTheme="light"
                >
                  <Link />
                </IconButtonV2>
              </ModalTrigger>
              <StyledDeleteEmbedButton
                aria-label={t('form.external.remove', { type: 'h5p' })}
                title={t('form.external.remove', { type: 'h5p' })}
                colorTheme="danger"
                data-cy="remove-element"
                onClick={handleRemove}
              >
                <DeleteForever />
              </StyledDeleteEmbedButton>
            </FigureButtons>
            <H5pEmbed embed={embed} />
          </>
        ) : null}
      </H5pWrapper>
      <StyledModalContent>
        <StyledModalBody>
          <H5PElement
            canReturnResources
            h5pUrl={element.data?.url}
            onClose={() => setIsEditing(false)}
            locale={language}
            onSelect={onSave}
          />
        </StyledModalBody>
      </StyledModalContent>
      {children}
    </Modal>
  );
};

export default SlateH5p;
