import React, { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { spacing, colors, fonts } from '@ndla/core';
//@ts-ignore
import { Spinner } from '@ndla/ui';
import { Star } from '@ndla/icons/editor';
import css from '@emotion/css';
import styled from '@emotion/styled';
import FolderItem from './folderComponents/FolderItem';
import Fade from './Fade';
import MakeDndList from './MakeDNDList';
import { SubjectTopic, SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { useDraft } from '../../modules/draft/draftQueries';

export type RenderBeforeFunction = (input: {
  id: string;
  title: string;
  isSubject: boolean;
  contentUri?: string;
}) => React.ReactNode;

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

interface RoundIconProps {
  smallIcon: React.ReactNode;
  clicked?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

const RoundIcon = ({ smallIcon, ...rest }: RoundIconProps & React.HTMLProps<HTMLButtonElement>) => (
  <StyledIcon {...rest}>{smallIcon}</StyledIcon>
);

interface Props {
  id: string;
  item: SubjectTopic | SubjectType;
  openedPaths: string[];
  toggleOpen: (topicId: string) => void;
  locale: string;
  level: number;
  onTopicSelect: (topic?: SubjectTopic) => void;
  topicResourcesLoading: boolean;
  resourceSectionRef: React.MutableRefObject<HTMLDivElement | null>;
  path: string;
  parent: string;
  subjectId: string;
  onDragEnd: (result: DropResult, topics: SubjectTopic[]) => Promise<void>;
  connectionId: string;
  parentActive: boolean;
  allSubjects: SubjectType[];
  isRoot?: boolean;
  favoriteSubjectIds?: string[];
  toggleFavorite?: () => void;
  nodes?: SubjectTopic[];
  isLoading?: boolean;
  renderBeforeTitle?: RenderBeforeFunction;
}

const StructureNode = ({
  id,
  item,
  openedPaths,
  toggleOpen,
  locale,
  level,
  onTopicSelect,
  path,
  parent,
  subjectId,
  topicResourcesLoading,
  resourceSectionRef,
  onDragEnd,
  connectionId,
  parentActive,
  allSubjects,
  isRoot,
  favoriteSubjectIds,
  toggleFavorite,
  isLoading,
  nodes,
  renderBeforeTitle,
}: Props) => {
  const isOpen = openedPaths.includes(path);
  const isActive = openedPaths[openedPaths.length - 1] === path;
  const hasSubtopics = isRoot ? true : nodes && nodes.length > 0;
  const [articleType, setArticleType] = useState('');

  const resourceId = item?.contentUri?.split(':')[2];
  // useDraft(parseInt(resourceId), locale, {
  //   enabled: !!item.contentUri,
  //   onSuccess: draft => setArticleType(draft.articleType),
  // });

  // if (articleType) {
  //   console.log(articleType);
  // }

  useEffect(() => {
    if (isActive && !isRoot) {
      onTopicSelect(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTopicClick = (topic: SubjectTopic) => {
    toggleOpen(path);
    onTopicSelect(isRoot ? undefined : item);
  };

  return (
    <StyledStructureItem
      connectionId={item.connectionId}
      id={item.id}
      key={path}
      greyedOut={!parentActive && !isActive}>
      <StyledItemBar level={level} highlight={isActive}>
        {favoriteSubjectIds && (
          <RoundIcon
            onClick={toggleFavorite}
            smallIcon={
              favoriteSubjectIds.includes(item.id) ? (
                <Star color={colors.favoriteColor} />
              ) : (
                <Star color={colors.brand.greyDark} />
              )
            }
          />
        )}
        <ItemTitleButton
          type="button"
          id={item.id}
          hasSubtopics={hasSubtopics}
          isSubject={false}
          lastItemClickable={true}
          arrowDirection={isOpen ? 90 : 0}
          onClick={() => onTopicClick(item)}
          isVisible={item.metadata?.visible}>
          {renderBeforeTitle?.({
            id,
            title: item.name,
            contentUri: item.contentUri,
            isSubject: !!isRoot,
          })}
          {item.name}
        </ItemTitleButton>
        {isActive && (
          <FolderItem
            id={item.id}
            parent={parent}
            subjectId={subjectId}
            pathToString={path}
            key={item.id}
            name={item.name}
            metadata={item.metadata}
            isMainActive={isOpen}
            structure={allSubjects}
            resourcesLoading={topicResourcesLoading}
            jumpToResources={() => resourceSectionRef?.current?.scrollIntoView()}
            locale={locale}
          />
        )}
        {isLoading && (
          <span>
            <Spinner size="normal" margin="4px 26px" />
          </span>
        )}
      </StyledItemBar>
      {hasSubtopics && isOpen && nodes && (
        <StructureWrapper>
          <Fade show={true} fadeType="fadeInTop">
            <MakeDndList
              disableDND={!isActive || nodes.length < 2}
              dragHandle
              onDragEnd={res => onDragEnd(res, nodes!)}>
              {nodes.map(t => (
                <StructureNode
                  renderBeforeTitle={renderBeforeTitle}
                  key={`${path}/${t.id}`}
                  allSubjects={allSubjects}
                  parentActive={isActive}
                  connectionId={t.connectionId}
                  id={t.id}
                  subjectId={subjectId}
                  parent={item.id}
                  path={`${path}/${t.id}`}
                  openedPaths={openedPaths}
                  resourceSectionRef={resourceSectionRef}
                  topicResourcesLoading={topicResourcesLoading}
                  onTopicSelect={onTopicSelect}
                  item={t}
                  nodes={t.subtopics}
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

export default StructureNode;
