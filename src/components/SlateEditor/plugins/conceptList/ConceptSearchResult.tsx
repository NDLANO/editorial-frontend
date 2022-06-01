import styled from '@emotion/styled';
import { ConceptNotion, Spinner } from '@ndla/ui';
import { spacing } from '@ndla/core';
import { ConceptNotionType } from '@ndla/ui/lib/Notion/ConceptNotion';
import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import config from '../../../../config';
import { Embed } from '../../../../interfaces';
import { searchConcepts } from '../../../../modules/concept/conceptApi';
import { parseEmbedTag } from '../../../../util/embedTagHelpers';

interface ConceptQuery {
  tags: string;
  language: string;
  'page-size': number;
}

const StyledContentWrapper = styled.div`
  & > figure:first-of-type {
    margin-top: ${spacing.medium};
  }
  & li {
    display: block;
  }
`;

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

const getType = (type: string | undefined) => {
  if (type === 'brightcove') {
    return 'video';
  }
  if (
    type === 'image' ||
    type === 'external' ||
    type === 'iframe' ||
    type === 'h5p' ||
    type === 'video'
  ) {
    return type;
  }
  return undefined;
};

interface Props {
  tag?: string;
  language: string;
  showResultCount?: boolean;
  subjectId?: string;
}

const ConceptSearchResult = ({ tag, language, showResultCount, subjectId }: Props) => {
  const [concepts, setConcepts] = useState<ConceptNotionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState<number>();

  const { t } = useTranslation();

  const search = async (query: ConceptQuery) => {
    searchConcepts(query)
      .then(data => {
        const { results, totalCount } = data;
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

        setLoading(false);
        setResultCount(totalCount);
        setConcepts(parsedConcepts);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tag) {
      const subject = subjectId
        ? {
            subjects: [subjectId],
          }
        : {};

      const query = {
        ...subject,
        tags: tag,
        language: language,
        'page-size': 200,
      };
      setLoading(true);
      search(query);
    }
  }, [tag, language, subjectId]);

  return (
    <StyledContentWrapper contentEditable={false}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {showResultCount && isNumber(resultCount) && (
            <div>{`${t('searchPage.totalCount')}: ${resultCount}`}</div>
          )}
          <ul>
            {concepts.map(concept => {
              return (
                <li key={concept.id}>
                  <ConceptNotion
                    concept={concept}
                    disableScripts={true}
                    type={getType(concept.visualElement?.resource)}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </StyledContentWrapper>
  );
};

export default ConceptSearchResult;
