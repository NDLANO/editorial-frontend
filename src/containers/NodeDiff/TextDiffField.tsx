import { useTranslation } from 'react-i18next';
import { DiffField, DiffInnerField } from './DiffField';
import { DiffResult } from './diffUtils';
import FieldWithTitle from './FieldWithTitle';

interface Props {
  fieldName: string;
  result: DiffResult<string[] | string | undefined>;
}

const TextDiffField = ({ fieldName, result }: Props) => {
  const { t } = useTranslation();
  return (
    <DiffField>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        <DiffInnerField left type={result.diffType}>
          {result.original ?? ''}
        </DiffInnerField>
      </FieldWithTitle>
      <FieldWithTitle title={t(`diff.fields.${fieldName}.title`)}>
        <DiffInnerField type={result.diffType}>{result.other ?? ''}</DiffInnerField>
      </FieldWithTitle>
    </DiffField>
  );
};
export default TextDiffField;
