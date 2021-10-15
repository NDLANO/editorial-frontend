import React, { useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { spacing, colors, fonts } from '@ndla/core';
import styled from '@emotion/styled';
import css from '@emotion/css';
import { SubjectTopic, SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import FolderItem from './folderComponents/FolderItem';
import MakeDndList from './MakeDNDList';
import Fade from './Fade';

interface ItemTitleButtonProps {
  isVisible?: boolean;
  hasSubtopics?: boolean;
  lastItemClickable?: boolean;
  isSubject?: boolean;
  arrowDirection?: number;
}

const itemTitleArrow = css`
  &:before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 9px solid ${colors.text.primary};
    margin-right: ${spacing.xsmall};
  }
`;

const itemTitleLinked = css`
  &:before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid ${colors.brand.light};
    border-left: 2px solid ${colors.brand.light};
    border-bottom-left-radius: 2px;
    margin-right: ${spacing.xsmall};
    margin-left: 7px;
  }
`;

const ItemTitleButton = styled.button<ItemTitleButtonProps>`
  ${fonts.sizes(16, 1)};
  font-weight: ${fonts.weight.semibold};
  border: 0;
  background: 0;
  color: ${props => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
  display: flex;
  align-items: center;
  text-align: left;
  white-space: nowrap;
  font-style: ${props => !props.isVisible && 'italic'};

  ${props => props.hasSubtopics && itemTitleArrow};
  ${props =>
    props.lastItemClickable &&
    css`
      cursor: pointer;
    `};
  ${props => !props.hasSubtopics && !props.isSubject && itemTitleLinked};

  &:before {
    transition: transform 200ms ease;
    transform: rotate(${props => props.hasSubtopics && props.arrowDirection}deg);
  }
`;

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
      key={fullPath}
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
            pathToString={fullPath}
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
                  key={`${fullPath}/${t.id}`}
                  allSubjects={allSubjects}
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
