import { useTranslation } from 'react-i18next';
import { DiffField, DiffInnerField } from './DiffField';
import { DiffResult } from './diffUtils';
import FieldWithTitle from './FieldWithTitle';

interface Props {
  fieldName: string;
  result: DiffResult<boolean>;
}
const BooleanDiffField = ({ result, fieldName }: Props) => {
  const { t } = useTranslation();
  return (
    <DiffField>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        <DiffInnerField left type={result.diffType}>
          {result.original
            ? t(`diff.fields.${fieldName}.isOn`)
            : t(`diff.fields.${fieldName}.isOff`)}
        </DiffInnerField>
      </FieldWithTitle>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        <DiffInnerField type={result.diffType}>
          {result.other ? t(`diff.fields.${fieldName}.isOn`) : t(`diff.fields.${fieldName}.isOff`)}
        </DiffInnerField>
      </FieldWithTitle>
    </DiffField>
  );
};

export default BooleanDiffField;
