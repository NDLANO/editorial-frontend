import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import { searchClasses } from '../../../SearchContainer';
import formatDate from '../../../../../util/formatDate';
import { toEditConcept } from '../../../../../util/routeHelpers';
import HeaderStatusInformation from '../../../../../components/HeaderWithLanguage/HeaderStatusInformation';

const StyledInfo = styled.div`
  color: ${colors.text.light};
  line-height: 1rem;
  font-size: 0.7rem;
`;

const ContentView = ({ concept, locale, title, content, breadcrumbs, t }) => {
  console.log('contentview 2');
  return (
    <div {...searchClasses('content')}>
      <div {...searchClasses('header')}>
        <Link
          {...searchClasses('link')}
          to={toEditConcept(concept.id, concept.title.language)}>
          <h2 {...searchClasses('title')}>{title}</h2>
          <StyledInfo>
            {`${t('topicArticleForm.info.lastUpdated')} ${formatDate(
              concept.lastUpdated,
            )}`}
          </StyledInfo>
        </Link>
        {concept.supportedLanguages.map(lang => {
          return lang !== locale ? (
            <span
              key={`${lang}_search_content`}
              {...searchClasses('other-link')}>
              <Link
                {...searchClasses('link')}
                to={toEditConcept(concept.id, lang)}>
                {t(`language.${lang}`)}
              </Link>
            </span>
          ) : (
            ''
          );
        })}
      </div>
      <p {...searchClasses('description')}>{content}</p>
      <div {...searchClasses('breadcrumbs')} style={{ marginTop: '-20px' }}>
        {breadcrumbs?.map(breadcrumb => (
          <p
            key={breadcrumb.id}
            {...searchClasses('breadcrumb')}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            {breadcrumb.name}
          </p>
        )) || <p {...searchClasses('breadcrumb')} />}
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
      </div>
    </div>
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
