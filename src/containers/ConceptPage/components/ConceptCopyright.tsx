/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import FormikField from '../../../components/FormikField/FormikField';
import CopyrightFieldGroup from '../../FormikForm/CopyrightFieldGroup';

interface Props {
  label: string;
  description: string;
}

const ConceptCopyright = ({ label, description }: Props) => {
  return (
    <>
      <CopyrightFieldGroup enableLicenseNA={true} />
      <FormikField label={label} name="source" description={description} />
    </>
  );
};

export default ConceptCopyright;
