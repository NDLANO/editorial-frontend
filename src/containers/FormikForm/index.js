import BEMHelper from 'react-bem-helper';
import FormikAgreementConnection from './FormikAgreementConnection';
import FormikCopyright from './FormikCopyright';
import FormikIngress from './FormikIngress';
import FormikWorkflow from './FormikWorkflow';
import FormikAddNotes from './FormikAddNotes';
import FormikHeader from './FormikHeader';
import FormikLanguage from './FormikLanguage';
import FormikLicense from './components/FormikLicense';
import FormikAlertModalWrapper from './FormikAlertModalWrapper';
import FormikActionButton from './components/FormikActionButton';
import FormikMetaImageSearch from './FormikMetaImageSearch';
import FormikDatePicker from './components/FormikDatePicker';

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
  FormikLanguage,
  formClasses,
};
