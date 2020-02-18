/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import { FormPill } from '@ndla/forms';
import { fetchCompetences } from '../../modules/draft/draftApi';
import { AsyncDropdown } from '../../components/Dropdown';

const FormikCompetencesContent = ({ t, articleCompetences, field }) => {
  const convertToCompetencesWithTitle = competencesWithoutTitle => {
    return competencesWithoutTitle.map(c => ({ title: c }));
  };

  const [competences, setCompetences] = useState(articleCompetences);

  const searchForCompetences = async inp => {
    const result = await fetchCompetences(inp);
    result.results = convertToCompetencesWithTitle(result.results);
    return result;
  };

  const updateFormik = (formikField, newData) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const addCompetence = competence => {
    if (!competences.includes(competence.title)) {
      const temp = [...competences, competence.title];
      setCompetences(temp);
      updateFormik(field, temp);
    }
  };

  const createNewCompetence = newCompetence => {
    if (!competences.includes(newCompetence.trim())) {
      const temp = [...competences, newCompetence.trim()];
      setCompetences(temp);
      updateFormik(field, temp);
    }
  };

  const removeCompetence = index => {
    const reduced_array = competences.filter((_, idx) => idx !== parseInt(index));
    setCompetences(reduced_array);
    updateFormik(field, reduced_array);
  };

  return (
    <Fragment>
      {competences.map((competence, index) => (
        <FormPill
          id={index.toString()}
          label={competence}
          onClick={removeCompetence}
          key={index}
        />
      ))}

      <AsyncDropdown
        idField="title"
        name="CompetencesSearch"
        labelField="title"
        placeholder={t('form.competences.placeholder')}
        label="label"
        apiAction={searchForCompetences}
        onClick={e => e.stopPropagation()}
        onChange={addCompetence}
        selectedItems={convertToCompetencesWithTitle(competences)}
        multiSelect
        disableSelected
        onCreate={createNewCompetence}
      />
    </Fragment>
  );
};

FormikCompetencesContent.propTypes = {
  articleCompetences: PropTypes.arrayOf(PropTypes.string),
  field: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default injectT(FormikCompetencesContent);
