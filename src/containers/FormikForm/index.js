import BEMHelper from 'react-bem-helper';
import FormikAgreementConnection from './FormikAgreementConnection';
import FormikCopyright from './FormikCopyright';
import FormikIngress from './FormikIngress';
import FormikWorkflow from './FormikWorkflow';
import FormikAddNotes from './FormikAddNotes';
import FormikLicense from './components/FormikLicense.jsx';
import FormikHeader from './FormikHeader';
import FormikAlertModalWrapper from './FormikAlertModalWrapper';

const formClasses = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

export {
  FormikCopyright,
  FormikAlertModalWrapper,
  FormikAgreementConnection,
  FormikIngress,
  FormikWorkflow,
  FormikAddNotes,
  FormikLicense,
  FormikHeader,
  formClasses,
};
