/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';

interface Props {
  name: string;
  label?: string;
  noBorder?: boolean;
}

const FormFieldLabel = ({ label, noBorder, name }: Props) => {
  if (!label) {
    return null;
  }
  if (!noBorder) {
    return <label htmlFor={name}>{label}</label>;
  }
  return (
    <>
      <label className="u-hidden" htmlFor={name}>
        {label}
      </label>
    </>
  );
};

FormFieldLabel.propTypes = {
  noBorder: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default FormFieldLabel;
