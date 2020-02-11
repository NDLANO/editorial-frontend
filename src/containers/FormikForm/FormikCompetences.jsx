/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import FormikField from '../../components/FormikField';
import MultiSelectDropdown from '../../components/Dropdown/MultiSelectDropdown';
import {fetchCompetences} from "../../modules/draft/draftApi";
import {DropdownInput, DropdownMenu, FormPill, FormPills} from '@ndla/forms';
import {appLocales} from "../../i18n";

const FormikCompetences = ({ t, tags }) => {

  const [result, setResult] = useState({totalCount:0, competences:[]});
  const [competences, setCompetences] = useState(["a", "b", "c"]);

  const searchForCompetences = async inp => {
    const result = await fetchCompetences(inp);
    setResult(result["totalCount"], result["results"])
  };

  const removeItem = id => {
    const temp = competences.slice();
    temp.splice( id, 1);
    setCompetences(temp);
  };

  return (
    <Fragment>
      <FormikField
        name="competences"
        label={t('form.competences.label')}>
        {({ field }) => (
          <div>
            {competences.map((competence, id) => (
                <FormPill id={id} label={competence} onClick={removeItem}/>
              ))}
            <MultiSelectDropdown showCreateOption {...field} data={tags} />
          </div>
        )}

      </FormikField>
    </Fragment>
  );
};

FormikCompetences.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(FormikCompetences);