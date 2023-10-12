/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { Editor, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { spacing, colors } from '@ndla/core';
import { H5pEmbedData, H5pMetaData } from '@ndla/types-embed';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import styled from '@emotion/styled';
import { H5pEmbed } from '@ndla/ui';
import { Link } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { Spinner } from '@ndla/icons';
import { H5pElement } from './types';
import { useH5pMeta } from '../../../../modules/embed/queries';
import { StyledDeleteEmbedButton, StyledFigureButtons } from '../embed/FigureButtons';
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
  > div {
    width: 100%;
  }
  &[data-selected='true'] {
    figure {
      outline: 2px solid ${colors.brand.primary};
    }
  }
`;

const FigureButtons = styled(StyledFigureButtons)`
  right: ${spacing.small};
  top: ${spacing.medium};
  z-index: 1;
`;

const StyledModalContent = styled(ModalContent)`
  padding: 0;
  width: 100% !important;
  height: 100%;
  max-height: 95%;
  overflow: hidden;
`;

const StyledModalBody = styled.div`
  display: flex;
  height: 100%;
`;

const SlateH5p = ({ element, editor, attributes, language, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(!!element.isFirstEdit);
  const isSelected = useSelected();

  const h5pMetaQuery = useH5pMeta(element.data?.path!, element.data?.url!, {
    enabled: !!element.data?.path,
  });
  const embed: H5pMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!h5pMetaQuery.error || !h5pMetaQuery.data ? 'error' : 'success',
            data: h5pMetaQuery.data!,
            embedData: element.data,
            resource: 'h5p',
          }
        : undefined,
    [h5pMetaQuery.data, h5pMetaQuery.error, element.data],
  );

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onSave = useCallback(
    (params: OnSelectObject) => {
      if (!params.path) {
        return;
      }
      setIsEditing(false);
      const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
      const url = `${config.h5pApiUrl}${params.path}?locale=${getH5pLocale(
        language,
      )}&cssUrl=${cssUrl}`;
      const embedData: H5pEmbedData = {
        resource: 'h5p',
        path: params.path,
        title: params.title,
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
    [editor, element, language],
  );

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <H5pWrapper {...attributes} data-selected={isSelected}>
        {h5pMetaQuery.isInitialLoading ? (
          <Spinner />
        ) : embed ? (
          <div contentEditable={false}>
            <FigureButtons>
              {embed.status === 'success' && (
                <ModalTrigger>
                  <IconButtonV2
                    colorTheme="light"
                    onClick={() => setIsEditing(true)}
                    title={t('form.editH5p')}
                    aria-label={t('form.editH5p')}
                  >
                    <Link />
                  </IconButtonV2>
                </ModalTrigger>
              )}
              <StyledDeleteEmbedButton
                title={t('form.audio.remove')}
                aria-label={t('form.audio.remove')}
                colorTheme="danger"
                onClick={handleRemove}
                data-testid="remove-element"
              >
                <DeleteForever />
              </StyledDeleteEmbedButton>
            </FigureButtons>
            <H5pEmbed embed={embed} />
          </div>
        ) : null}
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
        {children}
      </H5pWrapper>
    </Modal>
  );
};

export default SlateH5p;
