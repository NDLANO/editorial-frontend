import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import {
  StyledInfo,
  StyledConceptView,
  StyledLink,
  StyledDescription,
  StyledBreadcrumbs,
} from './SearchStyles';
import { searchClasses } from '../../../SearchContainer';
import formatDate from '../../../../../util/formatDate';
import { toEditConcept } from '../../../../../util/routeHelpers';
import HeaderStatusInformation from '../../../../../components/HeaderWithLanguage/HeaderStatusInformation';

const ContentView = ({
  concept,
  locale,
  title,
  content,
  breadcrumbs,
  setShowForm,
  t,
}) => {
  return (
    <StyledConceptView>
      <h2>
        <StyledLink
          noShadow
          to={toEditConcept(concept.id, concept.title.language)}>
          {title}
        </StyledLink>
        <Button
          css={css`
            line-height: 1;
            font-size: 0.7rem;
            padding: 4px 6px;
            margin-left: 5px;
          `}
          onClick={setShowForm}>
          Edit
        </Button>
      </h2>
      <StyledInfo>
        {`${t('topicArticleForm.info.lastUpdated')} ${formatDate(
          concept.lastUpdated,
        )}`}
      </StyledInfo>
      <div>
        {concept.supportedLanguages.map(lang => {
          return lang !== locale ? (
            <StyledLink
              other
              key={`language_${lang}_${concept.id}`}
              to={toEditConcept(concept.id, lang)}>
              {t(`language.${lang}`)}
            </StyledLink>
          ) : (
            ''
          );
        })}
      </div>
      <StyledDescription>{content}</StyledDescription>
      <StyledBreadcrumbs>
        {breadcrumbs?.map(breadcrumb => (
          <p
            key={breadcrumb.id}
            classname="crumb"
            style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            {breadcrumb.name}
          </p>
        )) || <p classname="crumb" />}
        <HeaderStatusInformation
          statusText={t(`form.status.${concept.status.current.toLowerCase()}`)}
          published={
            concept.status?.current === 'PUBLISHED' ||
            concept.status?.other.includes('PUBLISHED')
          }
          noHelp
          indentLeft
          fontSize={10}
        />
      </StyledBreadcrumbs>
    </StyledConceptView>
  );
};

ContentView.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({
      title: PropTypes.string,
      language: PropTypes.string,
    }),
    content: PropTypes.shape({
      content: PropTypes.string,
    }),
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    subjectIds: PropTypes.arrayOf(PropTypes.string),
    metaImage: PropTypes.shape({
      alt: PropTypes.string,
      url: PropTypes.string,
    }),
    lastUpdated: PropTypes.string,
    status: PropTypes.shape({
      current: PropTypes.string,
      other: PropTypes.string,
    }),
  }),
  locale: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  breadcrumbs: PropTypes.string,
};

export default ContentView;
