/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import { Check } from '@ndla/icons/editor';
import { colors } from '@ndla/core';
import { ChevronRight } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { FileStructure } from '@ndla/editor';
import { FormHeader } from '@ndla/forms';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import {
  TitleModal,
  listClass,
  buttonAddition,
  AddTitle,
  Checked,
  BreadCrumb,
  Connections,
  ConnectionsWrapper,
  ErrorLabel,
  ConnectionButton,
  RemoveConnectionButton,
  PrimaryConnectionButton,
} from './LearningResourceTaxonomyStyles';

class TopicConnections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedPaths: [],
      fileStructureFilters: [],
    };
    this.renderListItems = this.renderListItems.bind(this);
    this.handleOpenToggle = this.handleOpenToggle.bind(this);
    this.renderConnections = this.renderConnections.bind(this);
  }

  handleOpenToggle(path, id, level) {
    const { allowMultipleSubjectsOpen } = this.props;
    this.setState(prevState => {
      let { openedPaths } = prevState;
      const index = openedPaths.indexOf(path);
      if (index === -1) {
        // Has other subjects open and !allowMultipleSubjectsOpen?
        if (level === 0 && !allowMultipleSubjectsOpen) {
          openedPaths = [];
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

  renderListItems({ paths, level, isOpen, id, onCloseModal }) {
    const {
      t,
      modelTopics,
      availableFilters,
      taxonomyTopics,
      getOnChangeFunction,
    } = this.props;
    const { fileStructureFilters } = this.state;

    if (level === 0) {
      if (!availableFilters[paths[0]] || !isOpen) {
        return null;
      }
      return (
        <div className={cx('filestructure')}>
          <AddTitle show>{t('taxonomy.topics.filterTopic')}:</AddTitle>
          {availableFilters[paths[0]].map(filter => {
            const isChecked = fileStructureFilters.some(
              activeFilter => activeFilter === filter.id,
            );
            return (
              <ConnectionButton
                type="button"
                key={filter.id}
                className={isChecked ? 'checkboxItem--checked' : ''}
                onClick={() => {
                  const newFilterArray = isChecked
                    ? fileStructureFilters.filter(
                        activeFilter => activeFilter !== filter.id,
                      )
                    : [...fileStructureFilters, filter.id];
                  this.setState({
                    fileStructureFilters: newFilterArray,
                  });
                }}>
                <span />
                <span>{filter.name}</span>
              </ConnectionButton>
            );
          })}
        </div>
      );
    }

    const currentIndex = modelTopics.findIndex(topic => topic.id === id);

    return (
      <div className={cx('filestructure')}>
        {currentIndex === -1 ? (
          <Button
            outline
            className={buttonAddition}
            onClick={() => {
              const addTopic = taxonomyTopics.find(
                taxonomyTopic => taxonomyTopic.id === id,
              );
              addTopic.primary = modelTopics.length === 0;
              modelTopics.push(addTopic);

              const onChange = getOnChangeFunction();

              onChange({
                target: { name: 'topics', value: modelTopics },
              });
              onCloseModal();
            }}>
            {t('taxonomy.topics.filestructureButton')}
          </Button>
        ) : (
          <Checked>
            <Check
              className="c-icon--22"
              style={{ fill: colors.support.green }}
            />{' '}
            <span>{t('taxonomy.topics.addedTopic')}</span>
          </Checked>
        )}
      </div>
    );
  }

  renderConnections() {
    const {
      retriveBreadCrumbs,
      removeConnection,
      setPrimaryConnection,
      modelTopics,
    } = this.props;
    return (
      <ConnectionsWrapper>
        {modelTopics.map(topic => {
          const breadCrumbs = retriveBreadCrumbs(topic);
          if (!breadCrumbs) {
            // Connection not available.
            return (
              <Connections key={topic.id} error>
                <ErrorLabel>Ugyldig tilknytning</ErrorLabel>
                <BreadCrumb>
                  <span>{topic.path}</span>
                </BreadCrumb>
                <RemoveConnectionButton
                  type="button"
                  onClick={() => removeConnection(topic.id)}>
                  <Cross />
                </RemoveConnectionButton>
              </Connections>
            );
          }
          return (
            <Connections key={topic.id}>
              <PrimaryConnectionButton
                primary={topic.primary}
                onClick={() => setPrimaryConnection(topic.id)}>
                Primærkobling
              </PrimaryConnectionButton>
              <BreadCrumb>
                {breadCrumbs.map(path => (
                  <Fragment key={`${topic.id}${path.id}`}>
                    <span>{path.name}</span>
                    <ChevronRight />
                  </Fragment>
                ))}
              </BreadCrumb>
              <RemoveConnectionButton
                type="button"
                onClick={() => removeConnection(topic.id)}>
                <Cross />
              </RemoveConnectionButton>
            </Connections>
          );
        })}
      </ConnectionsWrapper>
    );
  }

  render() {
    const { t, structure, availableFilters } = this.props;
    const { fileStructureFilters, openedPaths } = this.state;
    return (
      <Fragment>
        <FormHeader
          title={t('taxonomy.topics.title')}
          subTitle={t('taxonomy.topics.subTitle')}
        />
        {this.renderConnections()}
        <Modal
          backgroundColor="white"
          animation="subtle"
          size="large"
          narrow
          minHeight="85vh"
          activateButton={<Button>Opprett emnetilknytning</Button>}>
          {onCloseModal => (
            <Fragment>
              <ModalHeader>
                <ModalCloseButton
                  title={t('taxonomy.topics.filestructureClose')}
                  onClick={onCloseModal}
                />
              </ModalHeader>
              <ModalBody>
                <TitleModal>
                  {t('taxonomy.topics.filestructureHeading')}:
                </TitleModal>
                <hr />
                <FileStructure
                  openedPaths={openedPaths}
                  structure={structure}
                  toggleOpen={this.handleOpenToggle}
                  renderListItems={props =>
                    this.renderListItems({ ...props, onCloseModal })
                  }
                  listClass={listClass}
                  fileStructureFilters={fileStructureFilters}
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
  structure: PropTypes.arrayOf(PropTypes.shape()),
  fileStructureFilters: PropTypes.arrayOf(PropTypes.string),
  modelTopics: PropTypes.arrayOf(PropTypes.object),
  taxonomyTopics: PropTypes.arrayOf(PropTypes.object),
  retriveBreadCrumbs: PropTypes.func,
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
  getOnChangeFunction: PropTypes.func,
};

export default injectT(TopicConnections);
