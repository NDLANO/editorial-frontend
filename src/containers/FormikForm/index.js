import BEMHelper from 'react-bem-helper';
import FormikAgreementConnection from './FormikAgreementConnection';
import FormikCopyright from './FormikCopyright';
import FormikIngress from './FormikIngress';
import FormikWorkflow from './FormikWorkflow';
import FormikAddNotes from './FormikAddNotes';
import FormikLicense from './components/FormikLicense.jsx';
import FormikHeader from './FormikHeader';

const formClasses = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

export {
  FormikCopyright,
  FormikAgreementConnection,
  FormikIngress,
  FormikWorkflow,
  FormikAddNotes,
  FormikLicense,
  FormikHeader,
  formClasses,
};
