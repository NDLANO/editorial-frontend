import BEMHelper from 'react-bem-helper';
import AgreementConnectionForm from './AgreementConnectionForm';
import CopyrightForm from './CopyrightForm';
import FormikIngress from './IngressForm';
import FormikTitle from './TitleForm';
import VersionAndNotesPanel from './VersionAndNotesPanel';
import AddNotesForm from './AddNotesForm';
import LicenseField from './components/LicenseField';
import AlertModalWrapper from './AlertModalWrapper';
import ActionButton from './components/ActionButton';
import MetaImageSearch from './MetaImageSearch';
import DatePicker from './components/DatePicker';
import Checkbox from './components/Checkbox';
import ContributorsField from './components/ContributorsField';
import FormikMetadata from './MetaDataForm';
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
  LicenseField,
  ActionButton,
  MetaImageSearch,
  Checkbox,
  ContributorsField,
  formClasses,
  FormikMetadata,
  AbortButton,
};
