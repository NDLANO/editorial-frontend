/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ContentLoader } from '@ndla/ui';
import { spacing } from '@ndla/core';
import ObjectSelector from '../../components/ObjectSelector';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';

const StyledDiffOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const StyledOptionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledDiffOption = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  originalHash: string;
  otherHash?: string;
}

interface DiffOptionProps {
  label: string;
  options: { id: string; label: string }[];
  name: string;
  placeholder?: string;
  value: string;
  onChange: (event: FormEvent<HTMLSelectElement>) => void;
  emptyField?: boolean;
}

const DiffOption = ({
  label,
  options,
  name,
  placeholder,
  value,
  onChange,
  emptyField,
}: DiffOptionProps) => {
  return (
    <StyledDiffOption>
      <strong>{label}</strong>
      <ObjectSelector
        emptyField={emptyField}
        onClick={e => e.stopPropagation()}
        options={options}
        onChange={onChange}
        name={name}
        idKey="id"
        labelKey="label"
        placeholder={placeholder}
        value={value}
      />
    </StyledDiffOption>
  );
};

const DiffOptions = ({ originalHash, otherHash }: Props) => {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const taxonomyVersions = useVersions();
  const options =
    taxonomyVersions.data?.map(version => ({ id: version.hash, label: version.name })) ?? [];

  useEffect(() => {
    if (!otherHash && taxonomyVersions.data) {
      const publishedVersion = taxonomyVersions.data.find(v => v.versionType === 'PUBLISHED');
      params.set('otherHash', publishedVersion?.hash ?? 'default');
      setParams(params);
    }
  }, [otherHash, params, setParams, taxonomyVersions.data]);

  const nodeViewOptions = [
    { id: 'all', label: t('diff.options.allNodes') },
    { id: 'changed', label: t('diff.options.changedNodes') },
  ];

  const nodeFieldOptions = [
    { id: 'all', label: t('diff.options.allFields') },
    { id: 'changed', label: t('diff.options.changedFields') },
  ];

  const viewOptions = [
    { id: 'tree', label: t('diff.options.tree') },
    { id: 'flat', label: t('diff.options.flat') },
  ];

  const currentNodeViewOption = params.get('nodeView') ?? 'changed';
  const currentNodeFieldOption = params.get('fieldView') ?? 'changed';
  const currentViewOption = params.get('view') ?? 'tree';

  const onOriginalHashChange = (hash: string) => {
    params.set('originalHash', hash.length ? hash : 'default');
    setParams(params);
  };

  const onParamChange = (name: string, value: string) => {
    params.set(name, value);
    setParams(params);
  };

  if (taxonomyVersions.isLoading) {
    return (
      <ContentLoader width={800} height={150}>
        <rect x="0" y="0" rx="3" ry="3" width="100" height="23" key="rect-1-2" />
        <rect x="0" y="26" rx="3" ry="3" width="260" height="32" key="rect-1-3" />
        <rect x="270" y="0" rx="3" ry="3" width="100" height="23" key="rect-1-4" />
        <rect x="270" y="26" rx="3" ry="3" width="255" height="32" key="rect-1-5" />
        <rect x="535" y="0" rx="3" ry="3" width="100" height="23" key="rect-1-6" />
        <rect x="535" y="26" rx="3" ry="3" width="100" height="32" key="rect-1-7" />

        <rect x="0" y="76" rx="3" ry="3" width="80" height="23" key="rect-2-1" />
        <rect x="0" y="102" rx="3" ry="3" width="120" height="32" key="rect-2-2" />
        <rect x="130" y="76" rx="3" ry="3" width="80" height="23" key="rect-2-3" />
        <rect x="130" y="102" rx="3" ry="3" width="120" height="32" key="rect-2-4" />
      </ContentLoader>
    );
  }

  return (
    <StyledDiffOptions>
      <StyledOptionRow>
        <DiffOption
          emptyField
          options={options}
          onChange={event => onOriginalHashChange(event.currentTarget.value)}
          name="originalHash"
          label={t('diff.options.originalHashLabel')}
          value={originalHash ?? 'default'}
          placeholder={t('diff.defaultVersion')}
        />
        <DiffOption
          emptyField
          options={options}
          onChange={({ currentTarget: { value } }) =>
            onParamChange('otherHash', value.length ? value : 'default')
          }
          name="otherHash"
          label={t('diff.options.otherHashLabel')}
          value={otherHash ?? 'default'}
          placeholder={t('diff.defaultVersion')}
        />
        <DiffOption
          options={viewOptions}
          onChange={event => onParamChange('view', event.currentTarget.value)}
          name="view"
          label={t('diff.options.viewLabel')}
          value={currentViewOption}
        />
      </StyledOptionRow>
      <StyledOptionRow>
        <DiffOption
          options={nodeViewOptions}
          onChange={event => onParamChange('nodeView', event.currentTarget.value)}
          name="nodeView"
          label={t('diff.options.nodeViewLabel')}
          value={currentNodeViewOption}
        />
        <DiffOption
          options={nodeFieldOptions}
          onChange={event => onParamChange('fieldView', event.currentTarget.value)}
          name="fieldView"
          label={t('diff.options.fieldViewLabel')}
          value={currentNodeFieldOption}
        />
      </StyledOptionRow>
    </StyledDiffOptions>
  );
};
export default DiffOptions;
