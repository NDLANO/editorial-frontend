import BEMHelper from 'react-bem-helper';
import FormikAgreementConnection from './FormikAgreementConnection';
import FormikCopyright from './FormikCopyright';
import FormikIngress from './FormikIngress';
import FormikTitle from './FormikTitle';
import VersionAndNotesPanel from './VersionAndNotesPanel';
import FormikAddNotes from './FormikAddNotes';
import LicenseForm from './components/LicenseForm';
import FormikAlertModalWrapper from './FormikAlertModalWrapper';
import ActionButton from './components/ActionButton';
import FormikMetaImageSearch from './FormikMetaImageSearch';
import DatePicker from './components/DatePicker';
import Checkbox from './components/Checkbox';
import ContributorsForm from './components/ContributorsForm';
import FormikMetadata from './FormikMetadata';
import AbortButton from './components/AbortButton';

const formClasses = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

export {
  FormikCopyright,
  FormikAlertModalWrapper,
  FormikAgreementConnection,
  DatePicker,
  FormikIngress,
  FormikTitle,
  VersionAndNotesPanel,
  FormikAddNotes,
  LicenseForm,
  ActionButton,
  FormikMetaImageSearch,
  Checkbox,
  ContributorsForm,
  formClasses,
  FormikMetadata,
  AbortButton,
};
