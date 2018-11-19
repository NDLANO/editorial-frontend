/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FormHeader, FormDropdown } from '@ndla/forms';
import { FileStructure, Spinner } from '@ndla/editor';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Additional, Core, ChevronRight } from '@ndla/icons/common';
import { Check } from '@ndla/icons/editor';
import { Cross } from '@ndla/icons/action';
import { colors } from '@ndla/core';
import {
  buttonAddition,
  filterbuttonwrapper,
  listClass,
  AddTitle,
  BreadCrumb,
  Checked,
  ConnectionButton,
  Connections,
  ConnectionsWrapper,
  FilterButton,
  FilterCheckBox,
  FilterListTR,
  FilterTable,
  PrimaryConnectionButton,
  RemoveConnectionButton,
  SubjectName,
  TitleModal,
} from './LearningResourceTaxonomyStyles';
import { CommonFieldPropsShape, TaxonomyShape } from '../../../shapes';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
} from '../../../modules/taxonomy';
import {
  filterToSubjects,
  sortByName,
  connectionTopicsToParent,
} from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';

const FILTER_SUPPLEMENTARY_ID = 'urn:relevance:supplementary';
const FILTER_CORE_ID = 'urn:relevance:core';

class LearningResourceTaxonomy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      structure: [],
      FileStructureFilters: [],
      taxonomy: {
        resourceTypes: [],
        filters: [],
        topics: [],
        relevances: [],
        availableFilters: [],
        availableResourceTypes: [],
      },
    };
    this.renderListItems = this.renderListItems.bind(this);
  }

  async componentDidMount() {
    const { model } = this.props;
    try {
      const [resourceTypes, filters, topics, subjects] = await Promise.all([
        fetchResourceTypes(model.language),
        fetchFilters(model.language),
        fetchTopics(model.language),
        fetchSubjects(model.language),
      ]);
      // Fetch all relevant subjects topics for resource
      const sortedSubjects = subjects
        .filter(subject => subject.name)
        .sort(sortByName);

      const subjectIds = sortedSubjects.map(subject => subject.id);
      const subjectsTopics = await Promise.all(
        subjectIds.map(subjectId => fetchSubjectTopics(subjectId)),
      );

      // Filter out items with no name (is required)
      this.setState({
        taxonomy: {
          availableResourceTypes: resourceTypes.filter(
            resourceType => resourceType.name,
          ),
          availableFilters: filterToSubjects(
            filters.filter(filter => filter.name),
          ),
          filters: filters.filter(filter => filter.name),
          topics: topics.filter(topic => topic.name),
          hasLoadedData: true,
        },
        structure: sortedSubjects.map((subject, index) => {
          const updateSubject = subject;
          updateSubject.subtopics = subjectsTopics[index].length
            ? connectionTopicsToParent(subjectsTopics[index], subject.id)
            : [];
          return updateSubject;
        }),
      });
    } catch (e) {
      handleError(e);
    }
  }

  getOnChangeFunction() {
    const { commonFieldProps } = this.props;
    const defaultDropdownProps = {
      obligatory: true,
      textField: 'name',
      valueField: 'id',
      ...commonFieldProps,
    };

    const { onChange } = defaultDropdownProps.bindInput(
      defaultDropdownProps.name,
    );

    return onChange;
  }

  setPrimaryConnection(id) {
    const { topics } = this.props.model;
    const onChange = this.getOnChangeFunction();

    onChange({
      target: {
        name: 'topics',
        value: topics.map(topic => {
          const returnTopic = topic;
          returnTopic.primary = returnTopic.id === id;
          return returnTopic;
        }),
      },
    });
  }

  retriveBreadCrumbs(topic) {
    let topicPaths = topic.path
      .split('/')
      .splice(1)
      .map(url => `urn:${url}`);

    const subject = this.state.structure.find(
      structureSubject => structureSubject.id === topicPaths[0],
    );
    topicPaths = topicPaths.splice(1);
    let error;
    const returnPaths = [];

    returnPaths.push({
      name: subject.name,
      id: subject.id,
    });
    let { subtopics } = subject;
    topicPaths.forEach(pathId => {
      subtopics = subtopics.find(subtopic => subtopic.id === pathId);
      returnPaths.push({
        name: subtopics.name,
        id: subtopics.id,
      });
      ({ subtopics } = subtopics);
    });

    return error ? [] : returnPaths;
  }

  removeConnection(id) {
    const onChange = this.getOnChangeFunction();
    const updatedTopics = this.props.model.topics.filter(
      topic => topic.id !== id,
    );
    onChange({
      target: { name: 'topics', value: updatedTopics },
    });
  }

  selectedResourceTypeValue() {
    const { resourceTypes } = this.props.model;
    if (!resourceTypes.length) {
      return '';
    }
    const withParentId = resourceTypes.find(
      resourceType => resourceType.parentId,
    );
    if (withParentId) {
      return `${withParentId.parentId},${withParentId.id}`;
    }
    // return first match (multiple selections not possible..)
    return resourceTypes[0].id;
  }

  updateFilter(filter, relevanceId, remove) {
    const updatedFilters = this.props.model.filter.filter(
      modelFilter => modelFilter.id !== filter.id,
    );
    if (!remove) {
      updatedFilters.push({ ...filter, relevanceId });
    }

    const onChange = this.getOnChangeFunction();

    onChange({
      target: { name: 'filter', value: updatedFilters },
    });
  }

  renderConnections() {
    return (
      <ConnectionsWrapper>
        {this.props.model.topics.map(topic => (
          <Connections key={topic.id}>
            <PrimaryConnectionButton
              primary={topic.primary}
              onClick={() => this.setPrimaryConnection(topic.id)}>
              Primærkobling
            </PrimaryConnectionButton>
            <BreadCrumb style={{ flexGrow: 1 }}>
              {this.retriveBreadCrumbs(topic).map(path => (
                <Fragment key={`${topic.id}${path.id}`}>
                  <span>{path.name}</span>
                  <ChevronRight />
                </Fragment>
              ))}
            </BreadCrumb>
            <RemoveConnectionButton
              type="button"
              onClick={() => this.removeConnection(topic.id)}>
              <Cross />
            </RemoveConnectionButton>
          </Connections>
        ))}
      </ConnectionsWrapper>
    );
  }

  renderListItems({ paths, level, isOpen, id }) {
    const { availableFilters } = this.state.taxonomy;
    const { t } = this.props;

    if (level === 0) {
      if (!availableFilters[paths[0]] || !isOpen) {
        return null;
      }
      return (
        <div className={cx('filestructure')}>
          <AddTitle show>{t('taxonomy.topics.filterTopic')}:</AddTitle>
          {availableFilters[paths[0]].map(filter => (
            <ConnectionButton
              type="button"
              key={filter.id}
              className={
                this.state.FileStructureFilters.some(
                  FileStructureFilter => FileStructureFilter === filter.id,
                )
                  ? 'checkboxItem--checked'
                  : ''
              }
              onClick={() => {
                const currentIndex = this.state.FileStructureFilters.findIndex(
                  FileStructureFilter => FileStructureFilter === filter.id,
                );
                if (currentIndex === -1) {
                  this.setState(prevState => {
                    const { FileStructureFilters } = prevState;
                    FileStructureFilters.push(filter.id);
                    return {
                      FileStructureFilters,
                    };
                  });
                } else {
                  this.setState(prevState => {
                    const { FileStructureFilters } = prevState;
                    FileStructureFilters.splice(currentIndex, 1);
                    return {
                      FileStructureFilters,
                    };
                  });
                }
              }}>
              <span />
              <span>{filter.name}</span>
            </ConnectionButton>
          ))}
        </div>
      );
    }

    const currentIndex = this.props.model.topics.findIndex(
      topic => topic.id === id,
    );

    return (
      <div className={cx('filestructure')}>
        {currentIndex === -1 ? (
          <Button
            outline
            className={buttonAddition}
            onClick={() => {
              const { model } = this.props;
              const modelTopics = model.topics;
              const addTopic = this.state.taxonomy.topics.find(
                taxonomyTopic => taxonomyTopic.id === id,
              );
              addTopic.primary = modelTopics.length === 0;
              modelTopics.push(addTopic);

              const onChange = this.getOnChangeFunction();

              onChange({
                target: { name: 'topics', value: modelTopics },
              });
              this.setState({
                modalIsOpen: false,
              });
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

  renderSubjectFilters() {
    const {
      t,
      model: { filter, topics },
    } = this.props;
    const { taxonomy, structure } = this.state;
    const availableSubjects = {};
    topics.forEach(topic => {
      availableSubjects[`urn:${topic.path.split('/')[1]}`] = true;
    });
    return (
      <FilterTable>
        <tbody>
          {Object.keys(availableSubjects).map((filterSubjectKey, index) => {
            const subjectName = structure.find(
              structureItem => structureItem.id === filterSubjectKey,
            ).name;

            return (
              <Fragment key={filterSubjectKey}>
                <tr>
                  <td>
                    <SubjectName firstSubject={index === 0}>
                      {subjectName}:
                    </SubjectName>
                  </td>
                </tr>
                {taxonomy.availableFilters[filterSubjectKey].map(
                  currentFilter => {
                    const useFilter = filter.find(
                      resourceFilter => resourceFilter.id === currentFilter.id,
                    );
                    const active = useFilter !== undefined;
                    return (
                      <FilterListTR key={currentFilter.id} active={active}>
                        <td>
                          <FilterCheckBox
                            type="button"
                            onClick={() =>
                              this.updateFilter(
                                currentFilter,
                                FILTER_CORE_ID,
                                active,
                              )
                            }
                            className={active ? 'checkboxItem--checked' : ''}>
                            <span />
                            <span>{currentFilter.name}</span>
                          </FilterCheckBox>
                        </td>
                        <td>
                          <div className={filterbuttonwrapper}>
                            <FilterButton
                              type="button"
                              selected={
                                useFilter &&
                                useFilter.relevanceId ===
                                  FILTER_SUPPLEMENTARY_ID
                              }
                              onClick={() =>
                                this.updateFilter(
                                  currentFilter,
                                  FILTER_SUPPLEMENTARY_ID,
                                )
                              }>
                              <Additional className="c-icon--22" />{' '}
                              {t('taxonomy.filters.additional')}
                            </FilterButton>
                            <FilterButton
                              type="button"
                              selected={
                                useFilter &&
                                useFilter.relevanceId === FILTER_CORE_ID
                              }
                              onClick={() =>
                                this.updateFilter(currentFilter, FILTER_CORE_ID)
                              }>
                              <Core className="c-icon--22" />{' '}
                              {t('taxonomy.filters.core')}
                            </FilterButton>
                          </div>
                        </td>
                      </FilterListTR>
                    );
                  },
                )}
              </Fragment>
            );
          })}
        </tbody>
      </FilterTable>
    );
  }

  render() {
    const {
      taxonomy: { availableResourceTypes, availableFilters, hasLoadedData },
      modalIsOpen,
      FileStructureFilters,
      structure,
    } = this.state;
    const { t, model, taxonomyIsLoading } = this.props;

    if (taxonomyIsLoading || !hasLoadedData) {
      return <Spinner />;
    }

    return (
      <Fragment>
        <FormHeader
          title={t('taxonomy.resourceTypes.title')}
          subTitle={t('taxonomy.resourceTypes.subTitle')}
        />
        <FormDropdown
          value={this.selectedResourceTypeValue()}
          onChange={e => {
            const options = e.target.value.split(',');
            const selectedResource = availableResourceTypes.find(
              resourceType => resourceType.id === options[0],
            );
            const val = [
              {
                name: selectedResource.name,
                id: selectedResource.id,
              },
            ];
            if (options.length > 1) {
              const subType = selectedResource.subtypes.find(
                subtype => subtype.id === options[1],
              );
              val.push({
                id: subType.id,
                name: subType.name,
                parentId: selectedResource.id,
              });
            }
            const onChange = this.getOnChangeFunction();
            onChange({
              target: { name: 'resourceTypes', value: val },
            });
          }}>
          <option value="">{t('taxonomy.resourceTypes.placeholder')}</option>
          {availableResourceTypes.map(
            resourceType =>
              resourceType.subtypes ? (
                resourceType.subtypes.map(subtype => (
                  <option
                    value={`${resourceType.id},${subtype.id}`}
                    key={subtype.id}>
                    {resourceType.name} - {subtype.name}
                  </option>
                ))
              ) : (
                <option key={resourceType.id} value={resourceType.id}>
                  {resourceType.name}
                </option>
              ),
          )}
        </FormDropdown>
        <FormHeader
          title={t('taxonomy.topics.title')}
          subTitle={t('taxonomy.topics.subTitle')}
        />
        {this.renderConnections()}
        <Button onClick={() => this.setState({ modalIsOpen: true })}>
          Opprett emnetilknytning
        </Button>
        <Modal
          backgroundColor="white"
          animation="subtle"
          size="large"
          narrow
          minHeight="85vh"
          controllable
          onClose={() => this.setState({ modalIsOpen: false })}
          isOpen={modalIsOpen}>
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
                  openedPaths={[]}
                  structure={structure}
                  toggleOpen={this.handleOpenToggle}
                  renderListItems={this.renderListItems}
                  listClass={listClass}
                  FileStructureFilters={FileStructureFilters}
                  filters={availableFilters}
                />
              </ModalBody>
            </Fragment>
          )}
        </Modal>
        {model.topics.length > 0 && (
          <Fragment>
            <FormHeader
              title={t('taxonomy.filters.title')}
              subTitle={t('taxonomy.filters.subTitle')}
            />
            {this.renderSubjectFilters()}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

LearningResourceTaxonomy.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  taxonomy: TaxonomyShape,
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
    resourceTypes: PropTypes.arrayOf(PropTypes.shape({})),
    filter: PropTypes.arrayOf(PropTypes.shape({})),
    topics: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  taxonomyIsLoading: PropTypes.bool,
};

export default injectT(LearningResourceTaxonomy);
