/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, fonts, misc, colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import {
  NotionDialogContent,
  NotionHeaderWithoutExitButton,
  NotionDialogLicenses,
  NotionDialogText,
  NotionDialogTags,
} from '@ndla/notion';
import { ImageLink } from '@ndla/ui';
import { getLicenseByAbbreviation, LicenseByline } from '@ndla/licenses';
import { Remarkable } from 'remarkable';
import { IConcept } from '@ndla/types-concept-api';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { getSrcSets } from '../../util/imageEditorUtil';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { fetchSubject } from '../../modules/taxonomy/subjects';
import { Embed } from '../../interfaces';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';
import { fetchImage } from '../../modules/image/imageApi';

const StyledBody = styled.div`
  margin: 0 ${spacing.normal} ${spacing.small};
  .c-tabs {
    margin-left: 0;
    margin-right: 0;
  }
  .react-tabs__tab-panel--selected {
    animation-name: fadeInLeft;
    animation-duration: 500ms;
  }
`;

const TagWrapper = styled.div`
  .tags {
    display: flex;
    flex-wrap: wrap;
    margin: ${spacing.small} 0;
    > span {
      padding-right: ${spacing.small};
    }
    .tag {
      background: #f8f8f8;
      margin-right: ${spacing.xsmall};
      padding: 0 ${spacing.xsmall};
      border-radius: ${misc.borderRadius};
      ${fonts.sizes('12px', 1.2)};
      font-family: ${fonts.sans};
      font-weight: ${fonts.weight.semibold};
      display: flex;
      align-items: center;
    }
  }
`;
const LicensesWrapper = styled.div`
  border-top: 1px solid ${colors.brand.tertiary};
  padding-top: ${spacing.small};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: aboslute;
  left: ${spacing.xsmall};
  width: 100%;
  > span {
    margin-right: ${spacing.xsmall};
    color: ${colors.text.light};
    ${fonts.sizes('14px', 1.1)};
    padding-bottom: ${spacing.xsmall};
    font-family: ${fonts.serif};
    padding-bottom: 3px;
    padding-top: 3px;
    margin-top: -4px;
    &:not(:last-child) {
      padding-right: ${spacing.xsmall};
      border-right: 1px solid ${colors.brand.greyLight};
    }
  }
`;

const VisualElementWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAltSpan = styled.span`
  color: grey;
  font-style: italic;
`;

const StyledVisualElementImageInfo = styled.div`
  padding-top: ${spacing.small};
  display: flex;
  flex-direction: column;
  align-items: start;
`;

interface Props {
  concept: IConcept;
  visualElement?: Embed;
}

const PreviewConcept = ({ concept, visualElement }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [image, setImage] = useState<IImageMetaInformationV2 | undefined>(undefined);
  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  useEffect(() => {
    const getSubjects = async () => {
      const subjects = await Promise.all(
        concept.subjectIds?.map(id => fetchSubject({ id, taxonomyVersion })) ?? [],
      );
      setSubjects(subjects);
    };
    getSubjects();
  }, [concept, taxonomyVersion]);

  useEffect(() => {
    if (visualElement?.resource !== 'image') return;
    (async () => {
      await fetchImage(visualElement.resource_id).then(setImage);
    })();
  }, [visualElement]);

  const VisualElement = () => {
    switch (visualElement?.resource) {
      case 'image':
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        const license = getLicenseByAbbreviation(
          image?.copyright.license.license ?? '',
          i18n.language,
        );
        const authors = image?.copyright?.creators || image?.copyright?.rightsholders || [];
        return (
          <StyledVisualElementImageInfo>
            <ImageLink src={visualElement.url!}>
              <img alt={visualElement?.alt} src={visualElement?.url} srcSet={srcSet} />{' '}
            </ImageLink>
            {visualElement?.alt && <StyledAltSpan>{`Alt: ${visualElement.alt}`}</StyledAltSpan>}
            <LicensesWrapper
              css={css`
                border-top: 0;
                padding-bottom: 12px;
                border-bottom: 1px solid ${colors.brand.greyLight};
              `}>
              <LicenseByline licenseRights={license.rights} />
              {authors.map((author, i) => (
                <span key={`author-${i}`}>{author.name}</span>
              ))}
            </LicensesWrapper>
          </StyledVisualElementImageInfo>
        );
      case 'video':
      case 'brightcove':
      case 'external':
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
      <NotionHeaderWithoutExitButton title={concept.title?.title ?? ''} />
      <StyledBody>
        <NotionDialogContent>
          <VisualElementWrapper>
            <VisualElement />
          </VisualElementWrapper>
          <NotionDialogText>
            <span
              dangerouslySetInnerHTML={{
                __html: markdown.render(concept.content?.content ?? ''),
              }}
            />
          </NotionDialogText>
        </NotionDialogContent>
        {concept.tags?.tags.length && (
          <TagWrapper>
            <div className="tags">
              <span>{t('form.categories.label')}:</span>
              {concept?.tags?.tags?.map(tag => (
                <span className="tag" key={`key-${tag}`}>
                  {tag}
                </span>
              ))}
            </div>
          </TagWrapper>
        )}
        <NotionDialogTags
          tags={subjects
            .filter(subject => concept.subjectIds?.includes(subject.id))
            .map(s => s.name)}
        />
        <NotionDialogLicenses
          license={concept.copyright?.license?.license}
          source={
            <span
              dangerouslySetInnerHTML={{
                __html: markdown.render(concept.source),
              }}
            />
          }
          authors={concept.copyright?.creators.map(creator => creator.name)}
        />
      </StyledBody>
    </>
  );
};

export default PreviewConcept;
