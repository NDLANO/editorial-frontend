/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { Link as LinkIcon } from '@ndla/icons/common';
import { ConceptNotion } from '@ndla/ui';
import { getLicenseCredits } from '@ndla/licenses';
import { IConcept } from '@ndla/types-concept-api';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import IconButton from '../../../../IconButton';
import { getYoutubeEmbedUrl } from '../../../../../util/videoUtil';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import config from '../../../../../config';
import { Embed } from '../../../../../interfaces';

const StyledFigureButtons = styled('span')<{ isBlockView?: boolean }>`
  position: absolute;
  top: 0;
  z-index: 1;
  right: 0;
  ${p => (p.isBlockView ? 'transform: translateX(100%);' : '')}
  margin-top: ${spacing.xsmall};

  > * {
    margin-bottom: ${spacing.xsmall};
  }
`;

interface Props {
  concept: IConcept;
  isBlockView?: boolean;
  handleRemove: () => void;
  id: number | string;
}

const BlockConceptPreview = ({ concept, handleRemove, id, isBlockView }: Props) => {
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
      case 'image':
        const imageUrl = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
        return {
          resource: embed.resource,
          url: embed.url,
          image: {
            src: imageUrl,
            alt: embed.alt,
          },
        };
      case 'external':
      case 'iframe':
        return {
          resource: embed.resource,
          url: embed.url ?? '',
          title: embed.title,
        };
      case 'brightcove':
        const videoUrl = `https://players.brightcove.net/${embed.account}/${embed.player}_default/index.html?videoId=${embed.videoid}`;
        return {
          resource: embed.resource,
          url: videoUrl,
          title: embed.title,
        };

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

  const { creators, rightsholders, processors } = getLicenseCredits(concept.copyright);

  const authors = (creators.length || rightsholders.length
    ? [...creators, ...rightsholders]
    : [...processors]
  ).map(contributor => contributor.name);

  return (
    <>
      <ConceptNotion
        concept={{
          ...concept,
          text: concept.content?.content || '',
          title: concept.title.title,
          image,
          visualElement,
          authors,
        }}
        disableScripts={true}
      />

      <StyledFigureButtons isBlockView={isBlockView}>
        <Tooltip tooltip={t('form.concept.removeConcept')} align="right">
          <IconButton color="red" type="button" onClick={handleRemove} tabIndex={-1}>
            <DeleteForever />
          </IconButton>
        </Tooltip>
        <Tooltip tooltip={t('form.concept.edit')} align="right">
          <IconButton
            as={Link}
            to={`/concept/${id}/edit/${concept.content?.language ?? i18n.language}`}
            target="_blank"
            title={t('form.concept.edit')}
            tabIndex={-1}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </StyledFigureButtons>
    </>
  );
};

export default BlockConceptPreview;
