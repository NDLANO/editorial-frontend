import BEMHelper from 'react-bem-helper';
import FormikAgreementConnection from './FormikAgreementConnection';
import FormikCopyright from './FormikCopyright';
import FormikIngress from './FormikIngress';
import FormikTitle from './FormikTitle';
import VersionAndNotesPanel from './VersionAndNotesPanel';
import FormikAddNotes from './FormikAddNotes';
import FormikLicense from './components/FormikLicense';
import FormikAlertModalWrapper from './FormikAlertModalWrapper';
import FormikActionButton from './components/FormikActionButton';
import FormikMetaImageSearch from './FormikMetaImageSearch';
import FormikDatePicker from './components/FormikDatePicker';
import FormikCheckbox from './components/FormikCheckbox';
import FormikContributors from './components/FormikContributors';
import FormikMetadata from './FormikMetadata';
import FormikAbortButton from './components/FormikAbortButton';

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
  FormikTitle,
  VersionAndNotesPanel,
  FormikAddNotes,
  FormikLicense,
  FormikActionButton,
  FormikMetaImageSearch,
  FormikCheckbox,
  FormikContributors,
  formClasses,
  FormikMetadata,
  FormikAbortButton,
};
