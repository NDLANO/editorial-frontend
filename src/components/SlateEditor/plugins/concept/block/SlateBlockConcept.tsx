/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import { DeleteForever, Check, Warning } from '@ndla/icons/editor';
import { Link as LinkIcon } from '@ndla/icons/common';
import { ConceptNotion } from '@ndla/ui';
import { IConcept } from '@ndla/types-backend/concept-api';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IconButtonV2 } from '@ndla/button';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { getYoutubeEmbedUrl } from '../../../../../util/videoUtil';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import config from '../../../../../config';
import { Embed } from '../../../../../interfaces';
import { PUBLISHED } from '../../../../../constants';
import { StyledFigureButtons } from '../../embed/FigureButtons';

const StyledTooltip = styled(Tooltip)`
  margin-right: auto;
`;

interface Props {
  concept: IConcept;
  isBlockView?: boolean;
  handleRemove: () => void;
}

const getType = (
  type: 'image' | 'external' | 'iframe' | 'brightcove' | 'video' | 'h5p' | undefined,
) => {
  if (type === 'brightcove') {
    return 'video';
  }
  return type;
};
const SlateBlockConcept = ({ concept, handleRemove, isBlockView }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  const visualElement = useMemo(() => {
    const embed: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);
    if (!embed) return;
    switch (embed?.resource) {
      case 'image': {
        const imageUrl = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
        return {
          resource: embed.resource,
          url: embed.url,
          image: {
            src: imageUrl,
            alt: embed.alt,
          },
        };
      }
      case 'external':
      case 'iframe':
        return {
          resource: embed.resource,
          url: embed.url ?? '',
          title: embed.title,
        };
      case 'brightcove': {
        const videoUrl = `https://players.brightcove.net/${embed.account}/${embed.player}_default/index.html?videoId=${embed.videoid}`;
        return {
          resource: embed.resource,
          url: videoUrl,
          title: embed.title,
        };
      }
      case 'video':
      case 'h5p':
        return {
          resource: embed.resource,
          url: embed?.url?.includes('youtube') ? getYoutubeEmbedUrl(embed?.url) : embed.url,
          title: embed.title,
        };
      default:
        return;
    }
  }, [concept.visualElement]);

  const image = concept.metaImage && {
    src: concept.metaImage.url,
    alt: concept.metaImage.alt,
  };

  return (
    <>
      <ConceptNotion
        concept={{
          ...concept,
          text: concept.content?.content || '',
          title: concept.title.title,
          image,
          visualElement,
        }}
        hideIconsAndAuthors
        type={getType(visualElement?.resource)}
        disableScripts={true}
      />
      <StyledFigureButtons>
        <Tooltip tooltip={t('form.concept.removeConcept')}>
          <IconButtonV2
            aria-label={t('form.concept.removeConcept')}
            variant="ghost"
            colorTheme="danger"
            onClick={handleRemove}
          >
            <DeleteForever />
          </IconButtonV2>
        </Tooltip>
        <Tooltip tooltip={t('form.concept.edit')}>
          <SafeLinkIconButton
            aria-label={t('form.concept.edit')}
            variant="ghost"
            colorTheme="light"
            to={`/concept/${concept.id}/edit/${concept.content?.language ?? i18n.language}`}
            target="_blank"
          >
            <LinkIcon />
          </SafeLinkIconButton>
        </Tooltip>
        {(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
          <StyledTooltip tooltip={t('form.workflow.published')}>
            <Check />
          </StyledTooltip>
        )}
        {concept?.status.current !== PUBLISHED && (
          <Tooltip
            tooltip={t('form.workflow.currentStatus', {
              status: t(`form.status.${concept?.status.current.toLowerCase()}`),
            })}
          >
            <Warning />
          </Tooltip>
        )}
      </StyledFigureButtons>
    </>
  );
};

export default SlateBlockConcept;
