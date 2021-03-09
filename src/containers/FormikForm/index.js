import BEMHelper from 'react-bem-helper';
import AgreementConnectionForm from './AgreementConnectionForm';
import CopyrightForm from './CopyrightForm';
import FormikIngress from './FormikIngress';
import FormikTitle from './FormikTitle';
import VersionAndNotesPanel from './VersionAndNotesPanel';
import AddNotesForm from './AddNotesForm';
import LicenseForm from './components/LicenseForm';
import AlertModalWrapper from './AlertModalWrapper';
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
  CopyrightForm,
  AlertModalWrapper,
  AgreementConnectionForm,
  DatePicker,
  FormikIngress,
  FormikTitle,
  VersionAndNotesPanel,
  AddNotesForm,
  LicenseForm,
  ActionButton,
  FormikMetaImageSearch,
  Checkbox,
  ContributorsForm,
  formClasses,
  FormikMetadata,
  AbortButton,
};
