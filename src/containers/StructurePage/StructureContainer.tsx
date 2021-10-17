import { Taxonomy } from '@ndla/icons/editor';
//@ts-ignore
import { OneColumn, Spinner } from '@ndla/ui';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Switch } from '@ndla/switch';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import styled from '@emotion/styled';
import Accordion from '../../components/Accordion';
import ErrorBoundary from '../../components/ErrorBoundary';
import InlineAddButton from '../../components/InlineAddButton';
import { useUpdateUserDataMutation, useUserData } from '../../modules/draft/draftQueries';
import { ButtonAppearance } from '../../components/Accordion/types';
import { REMEMBER_FAVOURITE_SUBJECTS, TAXONOMY_ADMIN_SCOPE } from '../../constants';
import { LocaleContext, UserAccessContext } from '../App/App';
import Footer from '../App/components/Footer';
import { useSubjects } from '../../modules/taxonomy/subjects';
import { SubjectTopic, SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import StructureResources from './resourceComponents/StructureResources';
import { getPathsFromUrl, removeLastItemFromUrl } from '../../util/routeHelpers';
import { useAddSubjectMutation } from '../../modules/taxonomy/subjects/subjectsQueries';
import StructureRoot from './StructureRoot';
import StructureErrorIcon from './folderComponents/StructureErrorIcon';

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

export interface StructureRouteParams {
  subject?: string;
  subtopics?: string;
  topic?: string;
}

const StructureContainer = ({ location, match }: RouteComponentProps<StructureRouteParams>) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const userAccess = useContext(UserAccessContext);
  const history = useHistory();
  const [editStructureHidden, setEditStructureHidden] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<SubjectTopic | undefined>(undefined);
  const [topicResourcesLoading, setTopicResourcesLoading] = useState(false);
  const resourceSection = useRef<HTMLDivElement>(null);

  const { data: { favoriteSubjects } = {}, isLoading: userDataLoading } = useUserData();
  const { data: subjectData, isLoading: subjectsLoading } = useSubjects(locale, undefined, {
    select: subjects => subjects.sort((a, b) => a.name?.localeCompare(b.name)),
    placeholderData: [],
  });
  const addSubjectMutation = useAddSubjectMutation();
  const updateUserDataMutation = useUpdateUserDataMutation();

  useEffect(() => {
    const initialShowFavorites = window.localStorage.getItem(REMEMBER_FAVOURITE_SUBJECTS);
    setShowFavorites(initialShowFavorites === 'true');
  }, []);

  const getFavoriteSubjects = (subjects: SubjectType[], favoriteSubjectIds: string[]) => {
    return subjects.filter(e => favoriteSubjectIds.includes(e.id));
  };

  const subjects = showFavorites
    ? getFavoriteSubjects(subjectData!, favoriteSubjects!)
    : subjectData!;

  const toggleFavorite = (subjectId: string) => {
    if (!favoriteSubjects) {
      return;
    }
    const updatedFavorites = favoriteSubjects.includes(subjectId)
      ? favoriteSubjects.filter(s => s !== subjectId)
      : [...favoriteSubjects, subjectId];
    updateUserDataMutation.mutate({ favoriteSubjects: updatedFavorites });
  };

  const toggleStructure = () => {
    setEditStructureHidden(!editStructureHidden);
  };
  const toggleShowFavorites = () => {
    window.localStorage.setItem(REMEMBER_FAVOURITE_SUBJECTS, (!showFavorites).toString());
    setShowFavorites(!showFavorites);
  };

  const handleStructureToggle = (path: string) => {
    const { url, params } = match;
    const { search } = location;
    const currentPath = url.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    const deleteSearch = !!params.subject && !newPath.includes(params.subject);
    history.replace(`/structure/${newPath.concat(deleteSearch ? '' : search)}`);
  };

  const addSubject = async (name: string) => {
    addSubjectMutation.mutate({ name });
  };

  const isTaxonomyAdmin = userAccess?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ErrorBoundary>
      <OneColumn>
        <Accordion
          handleToggle={toggleStructure}
          header={
            <>
              <Taxonomy className="c-icon--medium" />
              {t('taxonomy.editStructure')}
            </>
          }
          appearance={ButtonAppearance.TAXONOMY}
          addButton={
            isTaxonomyAdmin && (
              <InlineAddButton title={t('taxonomy.addSubject')} action={addSubject} />
            )
          }
          toggleSwitch={
            <Switch
              onChange={toggleShowFavorites}
              checked={showFavorites}
              label={t('taxonomy.favorites')}
              id={'favorites'}
              // @ts-ignore
              style={{ color: colors.white, width: '15.2em' }}
            />
          }
          hidden={editStructureHidden}>
          <>
            {userDataLoading || subjectsLoading ? (
              <Spinner />
            ) : (
              <StructureWrapper>
                {subjects!.map(subject => (
                  <StructureRoot
                    renderBeforeTitle={isTaxonomyAdmin ? StructureErrorIcon : undefined}
                    allSubjects={subjectData ?? []}
                    openedPaths={getPathsFromUrl(match.url)}
                    resourceSectionRef={resourceSection}
                    topicResourcesLoading={topicResourcesLoading}
                    onTopicSelect={setCurrentTopic}
                    favoriteSubjectIds={favoriteSubjects}
                    key={subject.id}
                    subject={subject}
                    toggleOpen={handleStructureToggle}
                    toggleFavorite={() => toggleFavorite(subject.id)}
                    locale={locale}
                  />
                ))}
              </StructureWrapper>
            )}
          </>
        </Accordion>
        {currentTopic && (
          <StructureResources
            setResourcesLoading={setTopicResourcesLoading}
            locale={locale}
            resourceRef={resourceSection}
            currentTopic={currentTopic}
            updateCurrentTopic={setCurrentTopic}
            grouped={currentTopic.metadata?.customFields['topic-resources'] ?? 'grouped'}
          />
        )}
      </OneColumn>
      <Footer showLocaleSelector />
    </ErrorBoundary>
  );
};

export default withRouter(StructureContainer);
