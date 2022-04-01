import { ConceptNotion } from '@ndla/ui';
import { ConceptNotionType } from '@ndla/ui/lib/Notion/ConceptNotion';
import { useEffect, useState } from 'react';
import config from '../../../../config';
import { Embed } from '../../../../interfaces';
import { searchConcepts } from '../../../../modules/concept/conceptApi';
import { parseEmbedTag } from '../../../../util/embedTagHelpers';

interface Props {
  tag?: string;
  language: string;
}

interface ConceptQuery {
  tags: string;
  language: string;
  'page-size': number;
}

const getVisualElement = (embed: Embed) => {
  if (embed.resource === 'h5p') {
    return {
      resource: embed.resource,
      url: embed.url,
      title: embed.title,
    };
  }
  if (embed.resource === 'brightcove') {
    return {
      resource: embed.resource,
      url: `https://players.brightcove.net/${config.brightCoveAccountId}/${config.brightcovePlayerId}_default/index.html?videoId=${embed.videoid}`,
      title: embed.title,
    };
  }
  if (embed.resource === 'external') {
    return {
      resource: embed.resource,
      url: embed.url,
      title: embed.title,
    };
  }
  if (embed.resource === 'image') {
    return {
      resource: embed.resource,
      image: {
        src: `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`,
        alt: embed.alt,
      },
    };
  }
};

const ConceptSearchResult = ({ tag, language }: Props) => {
  const [concepts, setConcepts] = useState<ConceptNotionType[]>([]);

  const search = async (query: ConceptQuery) => {
    const data = await searchConcepts(query);
    const { results } = data;
    const parsedConcepts = results.map(concept => {
      const embed = concept.visualElement?.visualElement;
      const embedData = parseEmbedTag(embed);
      const visualElement = embedData ? getVisualElement(embedData) : {};

      const image = concept.metaImage && {
        src: concept.metaImage.url,
        alt: concept.metaImage.alt,
      };

      return {
        ...concept,
        visualElement: visualElement,
        image,
        text: concept.content.content,
        title: concept.title.title,
      };
    });

    setConcepts(parsedConcepts);
  };

  useEffect(() => {
    if (tag) {
      const query = {
        tags: tag,
        language: language,
        'page-size': 8,
      };
      search(query);
    }
  }, [tag, language]);

  return (
    <div>
      {concepts.map(concept => {
        return <ConceptNotion concept={concept}></ConceptNotion>;
      })}
    </div>
  );
};

export default ConceptSearchResult;
