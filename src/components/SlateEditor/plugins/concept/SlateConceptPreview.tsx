/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import { spacing, spacingUnit } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { Link as LinkIcon } from '@ndla/icons/common';
import { ImageLink } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { NotionDialogContent, NotionDialogText, NotionDialogLicenses } from '@ndla/notion';
import Tooltip from '@ndla/tooltip';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import IconButton from '../../../IconButton';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import { getYoutubeEmbedUrl } from '../../../../util/videoUtil';
import { parseEmbedTag } from '../../../../util/embedTagHelpers';
import config from '../../../../config';
import { ConceptApiType } from '../../../../modules/concept/conceptApiInterfaces';
import { Embed } from '../../../../interfaces';

const StyledFigureButtons = styled('span')`
  position: absolute;
  top: 0;
  z-index: 1;
  right: -${spacingUnit * 1.5}px;
  margin-right: 40px;
  margin-top: ${spacing.xsmall};

  > * {
    margin-bottom: ${spacing.xsmall};
  }
`;

interface Props {
  concept: ConceptApiType;
  handleRemove: () => void;
  id: number | string;
}
interface ImageWrapperProps {
  children: ReactNode;
  url?: string;
}

const ImageWrapper = ({ children, url }: ImageWrapperProps) =>
  url ? <ImageLink src={url}>{children}</ImageLink> : <>children</>;

const SlateConceptPreview = ({ concept, handleRemove, id }: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  const VisualElement = () => {
    const visualElement: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);
    if (!visualElement) return null;
    switch (visualElement?.resource) {
      case 'image':
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        return (
          <ImageWrapper url={visualElement.url}>
            <img alt={visualElement?.alt} src={visualElement?.url} srcSet={srcSet} />
          </ImageWrapper>
        );
      case 'external':
        return (
          <iframe
            title={visualElement?.title}
            src={
              visualElement?.url?.includes('youtube')
                ? getYoutubeEmbedUrl(visualElement?.url)
                : visualElement?.url
            }
            frameBorder="0"
            scrolling="no"
            height={400}
          />
        );
      case 'brightcove':
        return (
          <iframe
            title={visualElement?.title}
            src={`https://players.brightcove.net/${config.brightCoveAccountId}/${config.brightcovePlayerId}_default/index.html?videoId=${visualElement?.videoid}`}
            frameBorder="0"
            scrolling="no"
            height={400}
          />
        );
      case 'video':
      case 'h5p':
        return (
          <iframe
            title={visualElement?.title}
            src={visualElement?.url}
            frameBorder="0"
            scrolling="no"
            height={400}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NotionDialogContent>
        <VisualElement />
        <NotionDialogText>
          <span
            dangerouslySetInnerHTML={{
              __html: markdown.render(concept.content.content),
            }}
          />
        </NotionDialogText>
      </NotionDialogContent>
      <NotionDialogLicenses
        license={concept.copyright?.license?.license}
        source={concept.source}
        authors={concept.copyright?.creators.map(creator => creator.name)}
      />

      <StyledFigureButtons>
        <Tooltip tooltip={t('form.concept.removeConcept')} align="right">
          <IconButton color="red" type="button" onClick={handleRemove} tabIndex={-1}>
            <DeleteForever />
          </IconButton>
        </Tooltip>
        <Tooltip tooltip={t('form.concept.edit')} align="right">
          <IconButton
            as={Link}
            to={`/concept/${id}/edit/${concept.content.language}`}
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

export default SlateConceptPreview;
