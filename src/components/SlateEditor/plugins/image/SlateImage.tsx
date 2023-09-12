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
import { useCallback, useState } from 'react';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { colors, spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { Spinner } from '@ndla/icons';
import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { SafeLinkIconButton } from '@ndla/safelink';
import { Link } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { ImageEmbedData } from '@ndla/types-embed';
import { ImageEmbed } from '@ndla/ui';
import { ImageElement } from './types';
import { useImageMeta } from '../../../../modules/embed/queries';
import { StyledDeleteEmbedButton, StyledFigureButtons } from '../embed/FigureButtons';
import EditImage from './EditImage';

interface Props extends RenderElementProps {
  element: ImageElement;
  editor: Editor;
  language: string;
  allowDecorative?: boolean;
}

const ImageWrapper = styled.div`
  position: relative;
  &[data-selected='true'][data-error='false'] {
    figure {
      outline: 2px solid ${colors.brand.primary};
    }
  }
  &[data-error='true'] {
    figure {
      outline: 2px solid ${colors.support.red};
    }
  }
  &[data-align='left'] {
    display: inline;
  }
`;

const FigureButtons = styled(StyledFigureButtons)`
  &[data-align='left'],
  &[data-align='right'] {
    margin-top: ${spacing.nsmall};
  }
`;

const SlateImage = ({
  element,
  editor,
  language,
  allowDecorative,
  attributes,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const isSelected = useSelected();

  const imageMetaQuery = useImageMeta(element.data?.resourceId!, language, {
    enabled: !!parseInt(element.data?.resourceId ?? ''),
  });

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onSave = useCallback(
    (data: ImageEmbedData) => {
      setEditMode(false);
      const properties = {
        data,
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
    [editor, element],
  );

  return (
    <Modal open={editMode} onOpenChange={setEditMode}>
      <ImageWrapper
        data-error={element.data && !element.data?.alt && !allowDecorative}
        data-selected={isSelected}
        data-align={element.data?.align}
        contentEditable={false}
        {...attributes}
      >
        {imageMetaQuery.isInitialLoading && <Spinner />}
        {element.data && imageMetaQuery.data && (
          <>
            <FigureButtons data-white data-align={element.data.align}>
              <ModalTrigger>
                <IconButtonV2
                  aria-label={t('form.image.editImage')}
                  title={t('form.image.editImage')}
                  colorTheme="light"
                >
                  <Pencil />
                </IconButtonV2>
              </ModalTrigger>
              <SafeLinkIconButton
                colorTheme="light"
                to={`/media/image-upload/${element.data.resourceId}/edit/${language}`}
                target="_blank"
                title={t('form.editOriginalImage')}
                aria-label={t('form.editOriginalImage')}
              >
                <Link />
              </SafeLinkIconButton>
              <StyledDeleteEmbedButton
                title={t('form.image.removeImage')}
                aria-label={t('form.image.removeImage')}
                colorTheme="danger"
                onClick={handleRemove}
                data-cy="remove-element"
              >
                <DeleteForever />
              </StyledDeleteEmbedButton>
            </FigureButtons>
            <ImageEmbed
              key={`${element.data.resourceId}-${element.data.size}`}
              embed={{
                data: imageMetaQuery.data,
                embedData: element.data,
                status: 'success',
                resource: 'image',
              }}
            />
            <ModalContent modalMargin="none">
              <EditImage
                image={imageMetaQuery.data}
                embed={element.data}
                setEditModus={setEditMode}
                language={language}
                saveEmbedUpdates={onSave}
              />
            </ModalContent>
          </>
        )}
      </ImageWrapper>
      {children}
    </Modal>
  );
};

export default SlateImage;
