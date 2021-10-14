import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { partition, sortBy } from 'lodash';
import { colors, spacing, fonts } from '@ndla/core';
import { Star } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import css from '@emotion/css';
import { SubjectTopic, SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import {
  useSubjectTopics,
  useUpdateSubjectTopic,
} from '../../modules/taxonomy/subjects/subjectsQueries';
import StructureTopic from './StructureTopic';
import { groupTopics } from '../../util/taxonomyHelpers';
import FolderItem from './folderComponents/FolderItem';
import Spinner from './Spinner';
import MakeDNDList from './structure/MakeDNDList';
import { SUBJECT_TOPICS } from '../../queryKeys';
import { useUpdateTopicSubTopic } from '../../modules/taxonomy/topics/topicQueries';
import Fade from './structure/Fade';

interface Props {
  subject: SubjectType;
  toggleOpen: (path: string) => void;
  openedPaths: string[];
  favoriteSubjectIds?: string[];
  toggleFavorite: Function;
  locale: string;
  onTopicSelect: (topic: SubjectTopic) => void;
  topicResourcesLoading: boolean;
  resourceSectionRef: React.MutableRefObject<HTMLDivElement | null>;
  allSubjects: SubjectType[];
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

interface ItemTitleButtonProps {
  isVisible?: boolean;
  hasSubtopics?: boolean;
  lastItemClickable?: boolean;
  isSubject?: boolean;
  arrowDirection?: number;
}

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

const StyledIcon = styled.button`
  display: flex;
  align-items: center;

  border: 0;
  background: transparent;

  svg:hover {
    fill: ${colors.favoriteColor};
    cursor: pointer;
  }
`;

interface StyledItemBarProps {
  level?: number;
  highlight?: boolean;
}

const StyledItemBar = styled.div<StyledItemBarProps>`
  display: flex;
  /* justify-content: space-between; */
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

const StructureSubject = ({
  favoriteSubjectIds,
  subject,
  openedPaths,
  toggleOpen,
  toggleFavorite,
  locale,
  onTopicSelect,
  topicResourcesLoading,
  resourceSectionRef,
  allSubjects,
}: Props) => {
  const { data: topicsData, isLoading } = useSubjectTopics(subject.id, locale, {
    enabled: openedPaths[0] === subject.id,
    select: allTopics => {
      return groupTopics(allTopics);
    },
  });
  const isActive = openedPaths[openedPaths.length - 1] === subject.id;
  const isOpen = openedPaths.includes(subject.id);

  const qc = useQueryClient();
  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries([SUBJECT_TOPICS, subject.id, locale]);
    const prevData = qc.getQueryData<SubjectTopic[]>([SUBJECT_TOPICS, subject.id, locale]);
    const [toUpdate, other] = partition(prevData, t => t.connectionId === id);
    const updatedTopic: SubjectTopic = { ...toUpdate[0], rank: newRank };
    const updated = other.map(t => (t.rank >= updatedTopic.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedTopic], 'rank');
    qc.setQueryData<SubjectTopic[]>([SUBJECT_TOPICS, subject.id, locale], newArr);
    return prevData;
  };
  const { mutateAsync: updateTopicSubtopic } = useUpdateTopicSubTopic({
    onMutate: data => onUpdateRank(data.id, data.body.rank!),
  });
  const { mutateAsync: updateSubjectTopic } = useUpdateSubjectTopic({
    onMutate: data => onUpdateRank(data.id, data.body.rank!),
  });

  const onDragEnd = async (
    { draggableId, source, destination }: DropResult,
    topics: SubjectTopic[],
  ) => {
    if (!destination) {
      return;
    }
    const currentRank = topics[source.index].rank;
    const destinationRank = topics[destination.index].rank;
    if (currentRank === destinationRank) return;
    const newRank = currentRank > destinationRank ? destinationRank : destinationRank + 1;
    const updateFunc = draggableId.includes('topic-subtopic')
      ? updateTopicSubtopic
      : updateSubjectTopic;
    await updateFunc(
      { id: draggableId, body: { rank: newRank } },
      { onSettled: () => qc.invalidateQueries([SUBJECT_TOPICS, subject.id, locale]) },
    );
  };
  return (
    <>
      <StyledStructureItem greyedOut={openedPaths.length > 0 && !isActive}>
        <StyledItemBar highlight={isActive} level={0}>
          {favoriteSubjectIds && (
            <RoundIcon
              onClick={() => toggleFavorite()}
              smallIcon={
                favoriteSubjectIds.includes(subject.id) ? (
                  <Star color={colors.favoriteColor} />
                ) : (
                  <Star color={colors.brand.greyDark} />
                )
              }
            />
          )}
          <ItemTitleButton
            type="button"
            id={subject.id}
            hasSubtopics={true}
            isSubject={true}
            lastItemClickable={true}
            arrowDirection={isOpen ? 90 : 0}
            onClick={() => toggleOpen(subject.id)}
            isVisible={subject.metadata?.visible}>
            {/* {renderBeforeTitle?.({ id: taxonomyId, title, contentUri, isSubject })} */}
            {subject.name}
          </ItemTitleButton>
          {/* {children} */}
          {isActive && (
            <FolderItem
              id={subject.id}
              subjectId={subject.id}
              pathToString={''}
              key={subject.id}
              name={subject.name}
              metadata={subject.metadata}
              isMainActive={isActive}
              structure={allSubjects}
              resourcesLoading={topicResourcesLoading}
              jumpToResources={resourceSectionRef?.current?.scrollIntoView}
              locale={locale}
            />
          )}
        </StyledItemBar>
      </StyledStructureItem>
      {isLoading && (
        <span>
          <Spinner size="normal" margin="4px 26px" />
        </span>
      )}
      {isOpen && topicsData && (
        <StructureWrapper>
          <Fade show={true} fadeType="fadeInTop">
            <MakeDNDList
              disableDND={!isActive || topicsData.length < 2}
              dragHandle
              onDragEnd={result => onDragEnd(result, topicsData)}>
              {topicsData.map(topic => (
                <StructureTopic
                  allSubjects={allSubjects}
                  connectionId={topic.connectionId}
                  id={topic.id}
                  onDragEnd={onDragEnd}
                  subjectId={subject.id}
                  path={subject.id}
                  parent={subject.id}
                  openedPaths={openedPaths}
                  toggleOpen={toggleOpen}
                  onTopicSelect={onTopicSelect}
                  resourceSectionRef={resourceSectionRef}
                  topicResourcesLoading={topicResourcesLoading}
                  topic={topic}
                  locale={locale}
                  level={1}
                  parentActive={isActive}
                />
              ))}
            </MakeDNDList>
          </Fade>
        </StructureWrapper>
      )}
    </>
  );
};

interface RoundIconProps {
  smallIcon: React.ReactNode;
  clicked?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

const RoundIcon = ({ smallIcon, ...rest }: RoundIconProps & React.HTMLProps<HTMLButtonElement>) => (
  <StyledIcon {...rest}>{smallIcon}</StyledIcon>
);

export default StructureSubject;
