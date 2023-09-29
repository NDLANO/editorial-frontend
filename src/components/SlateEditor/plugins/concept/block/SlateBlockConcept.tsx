/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import { Remarkable } from 'remarkable';
import { ConceptNotion } from '@ndla/ui';
import { IConcept } from '@ndla/types-backend/concept-api';
import { useTranslation } from 'react-i18next';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { getYoutubeEmbedUrl } from '../../../../../util/videoUtil';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import config from '../../../../../config';
import { Embed } from '../../../../../interfaces';

interface Props {
  concept: IConcept;
}

const getType = (
  type: 'image' | 'external' | 'iframe' | 'brightcove' | 'video' | 'h5p' | undefined,
) => {
  if (type === 'brightcove') {
    return 'video';
  }
  return type;
};
const SlateBlockConcept = ({ concept }: Props) => {
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
  );
};

export default SlateBlockConcept;
