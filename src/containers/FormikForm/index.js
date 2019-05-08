import BEMHelper from 'react-bem-helper';
import FormikAgreementConnection from './FormikAgreementConnection';
import FormikCopyright from './FormikCopyright';
import FormikIngress from './FormikIngress';
import FormikWorkflow from './FormikWorkflow';
import FormikAddNotes from './FormikAddNotes';
import FormikLicense from './components/FormikLicense.jsx';
import FormikHeader from './FormikHeader';
import FormikAlertModalWrapper from './FormikAlertModalWrapper';
import FormikActionButton from './components/FormikActionButton';
import FormikMetaImageSearch from './FormikMetaImageSearch';
import FormikDatePicker from './components/FormikDatePicker';
import FormikCheckbox from './components/FormikCheckbox';

const formClasses = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

export {
  FormikCopyright,
  FormikAlertModalWrapper,
  FormikAgreementConnection,
  FormikDatePicker,
  FormikIngress,
  FormikWorkflow,
  FormikAddNotes,
  FormikLicense,
  FormikHeader,
  FormikActionButton,
  FormikMetaImageSearch,
  FormikCheckbox,
  formClasses,
};
