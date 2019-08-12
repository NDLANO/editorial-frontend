/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Structure } from '@ndla/editor';
import { FieldHeader } from '@ndla/forms';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { fetchTopicConnections } from '../../modules/taxonomy';
import ActiveTopicConnections from './ActiveTopicConnections';
import { StructureShape, TopicShape } from '../../shapes';
import HowToHelper from '../HowTo/HowToHelper';
import StructureButtons from '../../containers/LearningResourcePage/components/taxonomy/StructureButtons';

const StyledTitleModal = styled('h1')`
  color: ${colors.text.primary};
`;

class TopicConnections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedPaths: [],
      activeFilters: [],
    };
    this.handleOpenToggle = this.handleOpenToggle.bind(this);
    this.addTopic = this.addTopic.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  handleOpenToggle({ path, isSubject, id }) {
    const { allowMultipleSubjectsOpen, getSubjectTopics } = this.props;
    this.setState(prevState => {
      let { openedPaths } = prevState;
      const index = openedPaths.indexOf(path);
      if (index === -1) {
        // Has other subjects open and !allowMultipleSubjectsOpen?
        if (isSubject) {
          getSubjectTopics(id);
          if (!allowMultipleSubjectsOpen) {
            openedPaths = [];
          }
        }

        openedPaths.push(path);
      } else {
        openedPaths.splice(index, 1);
      }
      return {
        openedPaths,
      };
    });
  }

  async addTopic(id, closeModal) {
    const { activeTopics, allTopics, stageTaxonomyChanges } = this.props;
    const addTopic = allTopics.find(taxonomyTopic => taxonomyTopic.id === id);

    const topicConnections = await fetchTopicConnections(addTopic.id);

    addTopic.topicConnections = topicConnections;

    stageTaxonomyChanges({
      topics: [
        ...activeTopics,
        {
          ...addTopic,
          primary: activeTopics.length === 0,
        },
      ],
    });
    closeModal();
  }

  toggleFilter(id) {
    this.setState(({ activeFilters }) => ({
      activeFilters: activeFilters.includes(id)
        ? activeFilters.filter(activeFilter => activeFilter !== id)
        : [...activeFilters, id],
    }));
  }

  render() {
    const {
      t,
      structure,
      availableFilters,
      activeTopics,
      ...rest
    } = this.props;
    const { activeFilters, openedPaths } = this.state;

    return (
      <Fragment>
        <FieldHeader
          title={t('taxonomy.topics.title')}
          subTitle={t('taxonomy.topics.subTitle')}>
          <HowToHelper
            pageId="TaxonomySubjectConnections"
            tooltip={t('taxonomy.topics.helpLabel')}
          />
        </FieldHeader>
        <ActiveTopicConnections activeTopics={activeTopics} {...rest} />
        <Modal
          backgroundColor="white"
          animation="subtle"
          size="large"
          narrow
          minHeight="85vh"
          activateButton={
            <Button>{t('taxonomy.topics.filestructureButton')}</Button>
          }>
          {closeModal => (
            <Fragment>
              <ModalHeader>
                <ModalCloseButton
                  title={t('taxonomy.topics.filestructureClose')}
                  onClick={closeModal}
                />
              </ModalHeader>
              <ModalBody>
                <StyledTitleModal>
                  {t('taxonomy.topics.filestructureHeading')}:
                </StyledTitleModal>
                <hr />
                <Structure
                  openedPaths={openedPaths}
                  structure={structure}
                  toggleOpen={this.handleOpenToggle}
                  renderListItems={listProps => (
                    <StructureButtons
                      {...listProps}
                      closeModal={closeModal}
                      activeTopics={activeTopics}
                      availableFilters={availableFilters}
                      activeFilters={activeFilters}
                      toggleFilter={this.toggleFilter}
                      addTopic={this.addTopic}
                    />
                  )}
                  activeFilters={activeFilters}
                  filters={availableFilters}
                />
              </ModalBody>
            </Fragment>
          )}
        </Modal>
      </Fragment>
    );
  }
}

TopicConnections.propTypes = {
  isOpened: PropTypes.bool,
  structure: PropTypes.arrayOf(StructureShape),
  activeTopics: PropTypes.arrayOf(TopicShape),
  allTopics: PropTypes.arrayOf(
    PropTypes.shape({
      contentUri: PropTypes.string,
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      path: PropTypes.string,
    }),
  ),
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  availableFilters: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      }),
    ),
  ),
  allowMultipleSubjectsOpen: PropTypes.bool,
  stageTaxonomyChanges: PropTypes.func,
  getSubjectTopics: PropTypes.func,
};

export default injectT(TopicConnections);
