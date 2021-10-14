import React, { useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { spacing, colors } from '@ndla/core';
import styled from '@emotion/styled';
import css from '@emotion/css';
import { SubjectTopic, SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { ItemTitleButton } from './structure/ItemNameBar';
import FolderItem from './folderComponents/FolderItem';
import Fade from './structure/Fade';
import MakeDndList from './structure/MakeDNDList';

interface StyledItemBarProps {
  level: number;
  highlight?: boolean;
}

const StyledItemBar = styled.div<StyledItemBarProps>`
  display: flex;
  justify-content: space-between;
  padding: 0 ${spacing.small} 0 calc(${props => props.level} * 17px + ${spacing.small});
  height: 40px;
  border-bottom: 1px solid ${colors.brand.greyLighter};
  background: ${props => props.highlight && colors.brand.light};

  &:hover {
    background: ${props => (props.highlight ? colors.brand.light : '#f1f5f8')};
  }
`;

interface StyledStructureItemProps {
  greyedOut?: boolean;
  connectionId?: string;
}

const StyledStructureItem = styled.li<StyledStructureItemProps>`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  ${props =>
    props.greyedOut &&
    css`
      > div > button {
        color: rgb(32, 88, 143, 0.5);
      }
    `};
`;

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

interface Props {
  id: string;
  topic: SubjectTopic;
  openedPaths: string[];
  toggleOpen: (topicId: string) => void;
  locale: string;
  level: number;
  onTopicSelect: (topic: SubjectTopic) => void;
  topicResourcesLoading: boolean;
  resourceSectionRef: React.MutableRefObject<HTMLDivElement | null>;
  path: string;
  parent: string;
  subjectId: string;
  onDragEnd: (result: DropResult, topics: SubjectTopic[]) => Promise<void>;
  connectionId: string;
  parentActive: boolean;
  allSubjects: SubjectType[];
}

const StructureTopic = ({
  topic,
  locale,
  level,
  onTopicSelect,
  path,
  topicResourcesLoading,
  resourceSectionRef,
  openedPaths,
  toggleOpen,
  parent,
  subjectId,
  parentActive,
  onDragEnd,
  allSubjects,
}: Props) => {
  const fullPath = `${path}/${topic.id}`;
  const onTopicClick = () => {
    toggleOpen(fullPath);
    onTopicSelect(topic);
  };
  const isOpen = openedPaths.includes(fullPath);
  const isActive = openedPaths[openedPaths.length - 1] === fullPath;
  const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

  useEffect(() => {
    if (isActive) {
      onTopicSelect(topic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledStructureItem
      connectionId={topic.connectionId}
      id={topic.id}
      key={topic.id}
      greyedOut={!parentActive && !isActive}>
      <StyledItemBar level={level} highlight={isActive}>
        <ItemTitleButton
          type="button"
          id={topic.id}
          hasSubtopics={hasSubtopics}
          isSubject={false}
          lastItemClickable={true}
          arrowDirection={isOpen ? 90 : 0}
          onClick={onTopicClick}
          isVisible={topic.metadata?.visible}>
          {/* {renderBeforeTitle?.({ id: taxonomyId, title, contentUri, isSubject })} */}
          {topic.name}
        </ItemTitleButton>
        {isActive && (
          <FolderItem
            id={topic.id}
            parent={parent}
            subjectId={subjectId}
            pathToString={''}
            key={topic.id}
            name={topic.name}
            metadata={topic.metadata}
            isMainActive={isOpen}
            structure={allSubjects}
            resourcesLoading={topicResourcesLoading}
            jumpToResources={() => resourceSectionRef?.current?.scrollIntoView()}
            locale={locale}
          />
        )}
      </StyledItemBar>
      {hasSubtopics && isOpen && topic.subtopics && (
        <StructureWrapper>
          <Fade show={true} fadeType="fadeInTop">
            <MakeDndList
              disableDND={!isActive || topic.subtopics.length < 2}
              dragHandle
              onDragEnd={res => onDragEnd(res, topic.subtopics!)}>
              {topic.subtopics.map(t => (
                <StructureTopic
                  parentActive={isActive}
                  connectionId={t.connectionId}
                  id={t.id}
                  subjectId={subjectId}
                  parent={topic.id}
                  path={fullPath}
                  openedPaths={openedPaths}
                  resourceSectionRef={resourceSectionRef}
                  topicResourcesLoading={topicResourcesLoading}
                  onTopicSelect={onTopicSelect}
                  topic={t}
                  toggleOpen={toggleOpen}
                  locale={locale}
                  level={level + 1}
                  onDragEnd={onDragEnd}
                />
              ))}
            </MakeDndList>
          </Fade>
        </StructureWrapper>
      )}
    </StyledStructureItem>
  );
};

export default StructureTopic;
