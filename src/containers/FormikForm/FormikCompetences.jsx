/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import FormikField from '../../components/FormikField';
import { fetchCompetences } from '../../modules/draft/draftApi';
import { FormPill } from '@ndla/forms';
import { AsyncDropdown } from '../../components/Dropdown';

const FormikCompetences = ({ t, articleCompetences }) => {
  // "Hacky" way to make AsyncDropdown work as expected
  const convertToCompetencesWithTitle = competencesWithoutTitle => {
    let newCompetences = [];
    competencesWithoutTitle.map(r => {
      let newObj = {};
      newObj['title'] = r;
      newCompetences.push(newObj);
    });
    return newCompetences;
  };

  const [competences, setCompetences] = useState(articleCompetences);
  const [competencesWithTitle, setCompetencesWithTitle] = useState(
    convertToCompetencesWithTitle(articleCompetences),
  );

  const searchForCompetences = async inp => {
    const result = await fetchCompetences(inp);
    result.results = convertToCompetencesWithTitle(result.results);
    return result;
  };

  const addCompetence = competence => {
    if (competences.indexOf(competence.title) === -1) {
      const temp = competences.slice();
      temp.push(competence.title);
      setCompetences(temp);
      setCompetencesWithTitle(convertToCompetencesWithTitle(temp));
    }
  };

  const removeCompetence = id => {
    const temp = competences.slice();
    temp.splice(id, 1);
    setCompetences(temp);
    setCompetencesWithTitle(convertToCompetencesWithTitle(temp));
  };

  return (
    <Fragment>
      <FormikField name="competences" label={t('form.competences.label')}>
        {({ field }) => (
          <div>
            {competences.map((competence, id) => (
              <FormPill
                id={id.toString()}
                label={competence}
                onClick={removeCompetence}
              />
            ))}

            <AsyncDropdown
              idField="title"
              name="CompetencesSearch"
              labelField="title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              label="label"
              apiAction={searchForCompetences}
              onClick={e => e.stopPropagation()}
              onChange={addCompetence}
              selectedItems={competencesWithTitle}
              multiSelect
              disableSelected
            />
          </div>
        )}
      </FormikField>
    </Fragment>
  );
};

FormikCompetences.propTypes = {
  articleCompetences: PropTypes.arrayOf(PropTypes.string),
};

export default injectT(FormikCompetences);
