/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import AgreementForm from './components/AgreementForm';

const CreateAgreement = ({ upsertAgreement, ...rest }) => (
  <AgreementForm agreement={{}} onUpdate={upsertAgreement} {...rest} />
);

CreateAgreement.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  upsertAgreement: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

export default CreateAgreement;
