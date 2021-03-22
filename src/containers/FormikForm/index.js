import BEMHelper from 'react-bem-helper';
import AgreementConnectionField from './AgreementConnectionField';
import CopyrightFieldGroup from './CopyrightFieldGroup';
import FormikIngress from './IngressField';
import TitleField from './TitleField';
import VersionAndNotesPanel from './VersionAndNotesPanel';
import AddNotesField from './AddNotesField';
import LicenseField from './components/LicenseField';
import AlertModalWrapper from './AlertModalWrapper';
import ActionButton from './components/ActionButton';
import MetaImageSearch from './MetaImageSearch';
import DatePicker from './components/DatePicker';
import Checkbox from './components/Checkbox';
import ContributorsField from './components/ContributorsField';
import MetaDataField from './MetaDataField';
import AbortButton from './components/AbortButton';

const formClasses = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

export {
  CopyrightFieldGroup,
  AlertModalWrapper,
  AgreementConnectionField,
  DatePicker,
  FormikIngress,
  TitleField,
  VersionAndNotesPanel,
  AddNotesField,
  LicenseField,
  ActionButton,
  MetaImageSearch,
  Checkbox,
  ContributorsField,
  formClasses,
  MetaDataField,
  AbortButton,
};
