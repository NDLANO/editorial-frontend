/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { spacing, fonts, misc } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import {
  NotionDialogContent,
  NotionHeaderWithoutExitButton,
  NotionDialogLicenses,
  NotionDialogText,
  NotionDialogTags,
} from '@ndla/notion';
import { Remarkable } from 'remarkable';
import { getSrcSets } from '../../util/imageEditorUtil';
import { SubjectType, Concept } from '../../interfaces';
import { fetchSubject } from '../../modules/taxonomy/taxonomyApi';

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

interface Props {
  concept: Concept;
}

const PreviewConcept: FC<Props & tType> = ({ concept, t }) => {
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  useEffect(() => {
    getSubjects();
  }, [concept.id]);

  const getSubjects = async () => {
    const subjects = await Promise.all(
      concept.subjectIds?.map(id => fetchSubject(id)),
    );
    setSubjects(subjects);
  };

  const VisualElement = () => {
    const visualElement = concept.visualElement;
    switch (visualElement?.resource) {
      case 'image':
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        return (
          <img
            alt={visualElement?.alt}
            src={visualElement?.url}
            srcSet={srcSet}
          />
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
      <NotionHeaderWithoutExitButton
        title={concept.title}
        subtitle={concept.metaDescription}
      />
      <StyledBody>
        <NotionDialogContent>
          <VisualElement />
          <NotionDialogText>
            <span
              dangerouslySetInnerHTML={{
                __html: markdown.render(concept.content),
              }}
            />
          </NotionDialogText>
        </NotionDialogContent>
        <TagWrapper>
          <div className="tags">
            <span>{t('form.categories.label')}:</span>
            {concept.tags.map(tag => (
              <span className="tag" key={`key-${tag}`}>
                {tag}
              </span>
            ))}
          </div>
        </TagWrapper>
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

export default injectT(PreviewConcept);
