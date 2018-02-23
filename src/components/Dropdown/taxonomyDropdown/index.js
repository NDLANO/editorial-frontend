import BEMHelper from 'react-bem-helper';
import DropdownTag from './DropdownTag';
import DropdownTagPropertyItem from './DropdownTagPropertyItem';
import InputItems from './InputItems';
import TaxonomyDropdown from './TaxonomyDropdown';
import TaxonomyDropdownInput from './TaxonomyDropdownInput';

const tagClasses = new BEMHelper({
  name: 'tag',
  prefix: 'c-',
});

export {
  tagClasses,
  DropdownTag,
  DropdownTagPropertyItem,
  InputItems,
  TaxonomyDropdown,
  TaxonomyDropdownInput,
};

export default TaxonomyDropdown;
