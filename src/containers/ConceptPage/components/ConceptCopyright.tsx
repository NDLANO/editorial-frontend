/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField/FormikField';
import CopyrightFieldGroup from '../../FormikForm/CopyrightFieldGroup';

import { ConceptFormValues } from '../conceptInterfaces';

interface Props {
  disableAgreements: boolean;
  label: string;
  description: string;
}

const ConceptCopyright = ({ disableAgreements, label, description }: Props) => {
  const { values } = useFormikContext<ConceptFormValues>();

  return (
    <>
      <CopyrightFieldGroup
        disableAgreements={disableAgreements}
        values={values}
        enableLicenseNA={true}
      />
      <FormikField label={label} name="source" description={description} />
    </>
  );
};

export default ConceptCopyright;
