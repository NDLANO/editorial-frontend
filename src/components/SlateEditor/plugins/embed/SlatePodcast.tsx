/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState, MouseEvent, useCallback } from 'react';
import { RenderElementProps } from 'slate-react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Figure } from '@ndla/ui';
import { colors } from '@ndla/core';
import Modal from '@ndla/modal';
import { fetchAudio } from '../../../../modules/audio/audioApi';
import { onError } from '../../../../util/resolveJsonOrRejectWithError';
import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { SlateAudio as Audio, LocaleType, AudioEmbed } from '../../../../interfaces';
import EditPodcast, { podcastEmbedFormRules, toPodcastEmbedFormValues } from './EditPodcast';
import validateFormik from '../../../formikValidationSchema';

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: AudioEmbed;
  language: string;
  locale: LocaleType;
  onRemoveClick: (event: MouseEvent) => void;
  isSelectedForCopy: boolean;
  children: ReactNode;
  saveEmbedUpdates: (updates: Record<string, string>) => void;
}

interface SlatePodcastWrapperProps {
  hasError?: boolean;
  showCopyOutline?: boolean;
}

const SlatePodcastWrapper = styled.div<SlatePodcastWrapperProps>`
  cursor: pointer;
  border-style: solid;
  border-width: 2px;
  border-color: ${p =>
    p.showCopyOutline ? colors.brand.primary : p.hasError ? colors.support.red : 'transparent'};
`;

const SlatePodcast = ({
  attributes,
  embed,
  language,
  locale,
  onRemoveClick,
  saveEmbedUpdates,
  isSelectedForCopy,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [hasError, _setHasError] = useState(false);
  const [audio, setAudio] = useState<Audio>({} as Audio);
  const showCopyOutline = isSelectedForCopy;

  const setHasError = useCallback((hasError: boolean) => _setHasError(hasError), []);

  useEffect(() => {
    if (!editing) {
      _setHasError(
        !!Object.keys(validateFormik(toPodcastEmbedFormValues(embed), podcastEmbedFormRules, t))
          .length,
      );
    }
  }, [editing, embed, t]);

  useEffect(() => {
    const getAudio = async () => {
      try {
        const audio = await fetchAudio(parseInt(embed.resource_id), language);
        setAudio({
          ...audio,
          title: audio.title?.title || '',
        });
      } catch (error) {
        onError(error);
      }
    };

    getAudio();
  }, [embed, language]);

  return (
    <>
      <Modal
        controllable
        backgroundColor="white"
        isOpen={editing}
        labelledBy={'editPodcastEmbed'}
        onClose={() => setEditing(false)}>
        {close => (
          <EditPodcast
            close={close}
            embed={embed}
            locale={locale}
            language={language}
            podcast={audio}
            setHasError={setHasError}
            saveEmbedUpdates={saveEmbedUpdates}
          />
        )}
      </Modal>
      <div draggable {...attributes}>
        <Figure id={`${audio.id}`}>
          <>
            <FigureButtons
              figureType="podcast"
              tooltip={t('form.podcast.remove')}
              onRemoveClick={onRemoveClick}
              embed={embed}
              language={language}
            />
            <SlatePodcastWrapper
              showCopyOutline={showCopyOutline}
              hasError={hasError}
              contentEditable={false}
              role="button"
              className="c-placeholder-editomode"
              draggable
              tabIndex={0}
              onKeyPress={() => setEditing(true)}
              onClick={() => setEditing(true)}>
              {audio.id && <AudioPlayerMounter audio={audio} locale={locale} speech={false} />}
            </SlatePodcastWrapper>
          </>
        </Figure>
        {children}
      </div>
    </>
  );
};

export default SlatePodcast;
