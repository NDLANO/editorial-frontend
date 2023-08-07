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
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { SafeLinkIconButton } from '@ndla/safelink';
import { Link } from '@ndla/icons/common';
import { IconButtonV2 } from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { NdlaErrorPayload, onError } from '../../../../util/resolveJsonOrRejectWithError';
import { fetchAudio } from '../../../../modules/audio/audioApi';
import AudioPlayerMounter from './AudioPlayerMounter';
import { StyledFigureButtons } from './FigureButtons';
import { SlateAudio as Audio, LocaleType, AudioEmbed } from '../../../../interfaces';
import EditPodcast, { podcastEmbedFormRules, toPodcastEmbedFormValues } from './EditPodcast';
import validateFormik from '../../../formikValidationSchema';
import Spinner from '../../../Spinner';

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
  border-color: ${(p) =>
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
  const [audioLoading, setAudioLoading] = useState(false);
  const showCopyOutline = isSelectedForCopy;

  const close = useCallback(() => setEditing(false), []);

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
        setAudioLoading(true);
        const audio = await fetchAudio(parseInt(embed.resource_id), language);
        setAudio({
          ...audio,
          title: audio.title?.title || '',
        });
        setAudioLoading(false);
      } catch (error) {
        setAudioLoading(false);
        onError(error as NdlaErrorPayload);
      }
    };

    getAudio();
  }, [embed, language]);

  return (
    <div draggable {...attributes}>
      <Figure id={`${audio.id}`}>
        <div>
          <StyledFigureButtons>
            <SafeLinkIconButton
              variant="ghost"
              colorTheme="light"
              to={`/media/podcast-upload/${embed.resource_id}/edit/${language}`}
              target="_blank"
              title={t('form.editPodcast')}
              aria-label={t('form.editPodcast')}
            >
              <Link />
            </SafeLinkIconButton>
            <IconButtonV2
              title={t('form.podcast.remove')}
              aria-label={t('form.podcast.remove')}
              colorTheme="danger"
              variant="ghost"
              onClick={onRemoveClick}
              data-cy="remove-element"
            >
              <DeleteForever />
            </IconButtonV2>
          </StyledFigureButtons>
          <Modal open={editing} onOpenChange={setEditing}>
            {audio.id ? (
              <ModalTrigger disabled={!audio.id}>
                <SlatePodcastWrapper
                  showCopyOutline={showCopyOutline}
                  hasError={hasError}
                  contentEditable={false}
                  role="button"
                  className="c-placeholder-editomode"
                  draggable
                  tabIndex={0}
                  onKeyPress={() => setEditing(true)}
                  onClick={() => setEditing(true)}
                >
                  <AudioPlayerMounter audio={audio} locale={locale} speech={false} />
                </SlatePodcastWrapper>
              </ModalTrigger>
            ) : (
              audioLoading && <Spinner />
            )}
            <ModalContent>
              <EditPodcast
                close={close}
                embed={embed}
                locale={locale}
                podcast={audio}
                setHasError={setHasError}
                saveEmbedUpdates={saveEmbedUpdates}
              />
            </ModalContent>
          </Modal>
        </div>
      </Figure>
      {children}
    </div>
  );
};

export default SlatePodcast;
