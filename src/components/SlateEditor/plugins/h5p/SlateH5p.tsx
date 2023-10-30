/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { spacing, colors } from '@ndla/core';
import { H5pMetaData } from '@ndla/types-embed';
import { Modal, ModalTrigger } from '@ndla/modal';
import styled from '@emotion/styled';
import { H5pEmbed } from '@ndla/ui';
import { Link } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { Spinner } from '@ndla/icons';
import { Pencil } from '@ndla/icons/action';
import { H5pElement } from './types';
import { useH5pMeta } from '../../../../modules/embed/queries';
import { StyledDeleteEmbedButton, StyledFigureButtons } from '../embed/FigureButtons';
import EditH5P from './EditH5P';

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

export type EditingState = 'h5p' | 'metadata' | undefined;

const SlateH5p = ({ element, editor, attributes, language, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState<EditingState>(element.isFirstEdit ? 'h5p' : undefined);
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

  const onOpenChange = (open: boolean) => setIsEditing(open ? 'h5p' : undefined);

  return (
    <Modal open={!!isEditing} onOpenChange={onOpenChange}>
      <H5pWrapper {...attributes} data-selected={isSelected}>
        {h5pMetaQuery.isLoading ? (
          <Spinner />
        ) : embed ? (
          <div contentEditable={false}>
            <FigureButtons>
              {embed.status === 'success' && (
                <ModalTrigger>
                  <>
                    <IconButtonV2
                      colorTheme="light"
                      onClick={() => setIsEditing('metadata')}
                      title={t('form.h5p.metadata.edit')}
                      aria-label={t('form.h5p.metadata.edit')}
                    >
                      <Pencil />
                    </IconButtonV2>
                    <IconButtonV2
                      colorTheme="light"
                      onClick={() => setIsEditing('h5p')}
                      title={t('form.editH5p')}
                      aria-label={t('form.editH5p')}
                    >
                      <Link />
                    </IconButtonV2>
                  </>
                </ModalTrigger>
              )}
              <StyledDeleteEmbedButton
                title={t('form.h5p.remove')}
                aria-label={t('form.h5p.remove')}
                colorTheme="danger"
                onClick={handleRemove}
                data-testid="remove-h5p-element"
              >
                <DeleteForever />
              </StyledDeleteEmbedButton>
            </FigureButtons>
            <H5pEmbed embed={embed} />
          </div>
        ) : null}
        <EditH5P
          language={language}
          embed={embed}
          element={element}
          editor={editor}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        {children}
      </H5pWrapper>
    </Modal>
  );
};

export default SlateH5p;
