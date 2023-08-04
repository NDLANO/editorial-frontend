/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState, MouseEvent, useCallback } from 'react';
import { RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Figure } from '@ndla/ui';
import { colors } from '@ndla/core';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';

import EditAudio, { audioEmbedFormRules, toAudioEmbedFormValues } from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { SlateAudio as Audio, LocaleType, AudioEmbed } from '../../../../interfaces';
import { fetchAudio } from '../../../../modules/audio/audioApi';
import { NdlaErrorPayload, onError } from '../../../../util/resolveJsonOrRejectWithError';
import validateFormik from '../../../formikValidationSchema';

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: AudioEmbed;
  language: string;
  locale: LocaleType;
  onRemoveClick: (event: MouseEvent) => void;
  saveEmbedUpdates: (updates: Record<string, string>) => void;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

interface SlateAudioWrapperProps {
  hasError?: boolean;
  showCopyOutline?: boolean;
}

const SlateAudioWrapper = styled.div<SlateAudioWrapperProps>`
  border-style: solid;
  border-width: 2px;
  border-color: ${(p) =>
    p.showCopyOutline ? colors.brand.primary : p.hasError ? colors.support.red : 'transparent'};
`;

const SlateAudio = ({
  attributes,
  embed,
  language,
  locale,
  onRemoveClick,
  active,
  isSelectedForCopy,
  saveEmbedUpdates,
  children,
}: Props) => {
  const { t } = useTranslation();
  const speech = embed.type === 'minimal';
  const [error, _setHasError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [audio, setAudio] = useState<Audio>({} as Audio);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);

  const setHasError = useCallback((hasError: boolean) => _setHasError(hasError), []);

  useEffect(() => {
    if (!editMode) {
      _setHasError(
        !!Object.keys(
          validateFormik(toAudioEmbedFormValues(embed, embed.type), audioEmbedFormRules, t),
        ).length,
      );
    }
  }, [editMode, embed, t]);

  useEffect(() => {
    const getAudio = async () => {
      try {
        const audio = await fetchAudio(parseInt(embed.resource_id), language);
        setAudio({
          ...audio,
          title: audio.title?.title || '',
        });
      } catch (error) {
        onError(error as NdlaErrorPayload);
      }
    };

    getAudio();
  }, [embed, language]);

  const toggleEdit = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  return (
    <div draggable {...attributes}>
      <Figure id={`${audio.id}`}>
        {!speech && (
          <FigureButtons
            tooltip={t('form.audio.remove')}
            onRemoveClick={onRemoveClick}
            embed={embed}
            figureType="audio"
            language={language}
          />
        )}
        <Modal open={editMode} onOpenChange={setEditMode}>
          {audio.id && (
            <ModalTrigger>
              <SlateAudioWrapper
                showCopyOutline={showCopyOutline}
                hasError={!!error}
                contentEditable={false}
                role="button"
                draggable
                className="c-placeholder-editmode"
                tabIndex={0}
              >
                <AudioPlayerMounter audio={audio} locale={locale} speech={speech} />
              </SlateAudioWrapper>
            </ModalTrigger>
          )}
          <ModalContent>
            <EditAudio
              saveEmbedUpdates={saveEmbedUpdates}
              setHasError={setHasError}
              audio={audio}
              embed={embed}
              onExit={toggleEdit}
              type={embed.type || 'standard'}
            />
          </ModalContent>
        </Modal>
      </Figure>
      {children}
    </div>
  );
};

export default SlateAudio;
