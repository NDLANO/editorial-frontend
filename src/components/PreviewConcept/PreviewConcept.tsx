/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { spacing, fonts, misc } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import {
  NotionDialogContent,
  NotionHeaderWithoutExitButton,
  NotionDialogLicenses,
  NotionDialogText,
  NotionDialogTags,
} from '@ndla/notion';
import { Remarkable } from 'remarkable';
import { getSrcSets } from '../../util/imageEditorUtil';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { fetchSubject } from '../../modules/taxonomy/subjects';
import { ConceptApiType } from '../../modules/concept/conceptApiInterfaces';
import { VisualElement } from '../../interfaces';

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

const VisualElementWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

interface Props {
  concept: ConceptApiType;
  visualElement?: VisualElement;
}

const PreviewConcept = ({ concept, visualElement }: Props) => {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  useEffect(() => {
    const getSubjects = async () => {
      const subjects = await Promise.all(concept.subjectIds?.map(id => fetchSubject(id)));
      setSubjects(subjects);
    };
    getSubjects();
  }, [concept]);

  const VisualElement = () => {
    switch (visualElement?.resource) {
      case 'image':
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        return <img alt={visualElement?.alt} src={visualElement?.url} srcSet={srcSet} />;
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
      <NotionHeaderWithoutExitButton title={concept.title.title} />
      <StyledBody>
        <NotionDialogContent>
          <VisualElementWrapper>
            <VisualElement />
          </VisualElementWrapper>
          <NotionDialogText>
            <span
              dangerouslySetInnerHTML={{
                __html: markdown.render(concept.content.content),
              }}
            />
          </NotionDialogText>
        </NotionDialogContent>
        {(concept.tags?.tags.length ?? 0) > 0 && (
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
          source={concept.source}
          authors={concept.copyright?.creators.map(creator => creator.name)}
        />
      </StyledBody>
    </>
  );
};

export default PreviewConcept;
