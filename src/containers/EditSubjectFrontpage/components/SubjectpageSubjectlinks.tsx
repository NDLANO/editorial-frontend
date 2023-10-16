/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useField, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldHeader } from '@ndla/forms';

import { NodeList, NodeSearchDropdown } from './nodes';
import { useSearchNodes } from '../../../modules/nodes/nodeQueries';

interface Props {
  [index: string]: string[];
  buildsOn: string[];
  connectedTo: string[];
  leadsTo: string[];
}

const SubjectpageSubjectlinks = (props: Props) => {
  const { t } = useTranslation();
  const [connectedToList, setConnectedToList] = useState<any[]>([]);
  const [buildsOnList, setBuildsOnList] = useState<any[]>([]);
  const [leadsToList, setLeadsToList] = useState<any[]>([]);
  const { setFieldTouched } = useFormikContext();
  const [FieldInputProps] = useField<string[]>('');
  const { onChange } = FieldInputProps;

  const { data } = useSearchNodes({
    page: 1,
    taxonomyVersion: 'default',
    nodeType: 'SUBJECT',
    ids: props.buildsOn.concat(props.connectedTo).concat(props.leadsTo),
  });

  useEffect(() => {
    console.log(props);
    setConnectedToList(
      data ? data.results.filter((node) => props.connectedTo.includes(node.id)) : [],
    );
    setBuildsOnList(data ? data.results.filter((node) => props.buildsOn.includes(node.id)) : []);
    setLeadsToList(data ? data.results.filter((node) => props.leadsTo.includes(node.id)) : []);
  }, [data]);

  const handleDeleteFromList = (list: string, id: string) => {
    if (list === 'connectedTo') {
      setConnectedToList((prev) => prev.filter((l) => l.id !== id));
    } else if (list === 'buildsOn') {
      setBuildsOnList((prev) => prev.filter((l) => l.id !== id));
    } else {
      setLeadsToList((prev) => prev.filter((l) => l.id !== id));
    }
    // onChange({
    //   target: { name: list, value: props[list].filter((l) => l !== id) },
    // });
  };

  const handleAddToList = (t: any) => {
    setConnectedToList((prev) => [...prev, t]);
    setBuildsOnList((prev) => [...prev, t]);
    setLeadsToList((prev) => [...prev, t]);
    console.log('æddabædda');
    console.log(t);
  };

  return (
    <>
      <FieldHeader title={t('subjectpageForm.connectedTo')} />
      <NodeList nodes={connectedToList} nodeSet={'connectedTo'} onDelete={handleDeleteFromList} />
      <NodeSearchDropdown onChange={handleAddToList} />
      <FieldHeader title={t('subjectpageForm.buildsOn')} />
      <NodeList nodes={buildsOnList} nodeSet={'buildsOn'} onDelete={handleDeleteFromList} />
      <NodeSearchDropdown onChange={handleAddToList} />
      <FieldHeader title={t('subjectpageForm.leadsTo')} />
      <NodeList nodes={leadsToList} nodeSet={'leadsTo'} onDelete={handleDeleteFromList} />
      <NodeSearchDropdown onChange={handleAddToList} />
    </>
  );
};

export default SubjectpageSubjectlinks;
