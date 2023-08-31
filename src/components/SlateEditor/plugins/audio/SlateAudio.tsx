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
import { spacing, colors } from '@ndla/core';
import { AudioEmbedData } from '@ndla/types-embed';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import styled from '@emotion/styled';
import { AudioEmbed } from '@ndla/ui';
import { SafeLinkIconButton } from '@ndla/safelink';
import { Link } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { Spinner } from '@ndla/icons';
import { AudioElement } from './types';
import { useAudioMeta } from '../../../../modules/embed/queries';
import { StyledDeleteEmbedButton, StyledFigureButtons } from '../embed/FigureButtons';
import AudioEmbedForm from './AudioEmbedForm';

interface Props extends RenderElementProps {
  element: AudioElement;
  editor: Editor;
  language: string;
}

const AudioWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &[data-type='minimal'] {
    justify-content: flex-end;
    flex-direction: row-reverse;
    gap: ${spacing.xsmall};
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
  &[data-type='minimal'] {
    position: static;
    top: unset;
    right: unset;
  }
`;

const SlateAudio = ({ element, editor, attributes, language, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const isSelected = useSelected();

  const audioMetaQuery = useAudioMeta(element.data?.resourceId!, language, {
    enabled: !!parseInt(element.data?.resourceId ?? ''),
  });

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
    (data: AudioEmbedData) => {
      setIsEditing(false);
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
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <AudioWrapper
        {...attributes}
        contentEditable={false}
        data-selected={isSelected}
        data-type={element.data?.type}
      >
        {audioMetaQuery.isInitialLoading && <Spinner />}
        {audioMetaQuery.data && element.data && (
          <>
            <FigureButtons data-type={element.data.type}>
              {element.data.type !== 'minimal' && (
                <>
                  <SafeLinkIconButton
                    colorTheme="light"
                    to={`/media/${element.data.type === 'podcast' ? 'podcast' : 'audio'}-upload/${
                      element.data.resourceId
                    }/edit/${language}`}
                    target="_blank"
                    title={t('form.editAudio')}
                    aria-label={t('form.editAudio')}
                  >
                    <Link />
                  </SafeLinkIconButton>
                  <StyledDeleteEmbedButton
                    title={t('form.audio.remove')}
                    aria-label={t('form.audio.remove')}
                    colorTheme="danger"
                    onClick={handleRemove}
                    data-cy="remove-element"
                  >
                    <DeleteForever />
                  </StyledDeleteEmbedButton>
                </>
              )}
              {element.data.type !== 'podcast' && (
                <ModalTrigger>
                  <IconButtonV2
                    title={t('form.audio.edit')}
                    aria-label={t('form.audio.edit')}
                    variant="ghost"
                  >
                    <Pencil />
                  </IconButtonV2>
                </ModalTrigger>
              )}
            </FigureButtons>
            <AudioEmbed
              embed={{
                resource: 'audio',
                status: 'success',
                embedData: element.data,
                data: audioMetaQuery.data,
              }}
            />
          </>
        )}
      </AudioWrapper>
      <ModalContent>
        {!!element.data && !!audioMetaQuery.data && (
          <AudioEmbedForm
            audio={audioMetaQuery.data}
            onSave={onSave}
            onCancel={onClose}
            embed={element.data}
          />
        )}
      </ModalContent>
      {children}
    </Modal>
  );
};

export default SlateAudio;
