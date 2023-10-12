/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Formik, FormikProps } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonV2, CloseButton } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@ndla/modal';
import { Select } from '@ndla/select';
import { Node, NodeType } from '@ndla/types-taxonomy';

import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import { StyledErrorMessage } from '../styles';
import { useFetchSubjectpageData } from '../../../FormikForm/formikSubjectpageHooks';
import { Row } from '../../../../components';
import UIField from '../../../../components/Field';
import FormikField from '../../../../components/FormikField';
import RoundIcon from '../../../../components/RoundIcon';
import SaveButton from '../../../../components/SaveButton';
import Spinner from '../../../../components/Spinner';
import StyledForm from '../../../../components/StyledFormComponents';
import { useTaxonomyVersion } from '../../../../containers/StructureVersion/TaxonomyVersionProvider';
import { useNodes } from '../../../../modules/nodes/nodeQueries';
import { isFormikFormDirty } from '../../../../util/formHelper';
import handleError from '../../../../util/handleError';

interface SelectOptions {
  id?: string;
  value: string;
  label: string;
}

interface FormikSubjectLinksValues {
  connectedTo: SelectOptions[];
  buildsOn: SelectOptions[];
  leadsTo: SelectOptions[];
}

interface Props {
  node: Node;
  editModeHandler: EditModeHandler;
}

const ChangeSubjectLinks = ({ editModeHandler: { editMode, toggleEditMode }, node }: Props) => {
  const { t } = useTranslation();

  const onModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        toggleEditMode('changeSubjectLinks');
      } else toggleEditMode('');
    },
    [toggleEditMode],
  );

  const onClose = useCallback(() => {
    toggleEditMode('');
  }, [toggleEditMode]);

  return (
    <>
      <Modal open={editMode === 'changeSubjectLinks'} onOpenChange={onModalChange}>
        <ModalTrigger>
          <MenuItemButton data-testid="changeSubjetLinksButton">
            <RoundIcon small icon={<Pencil />} />
            {t('taxonomy.changeSubjectLinks.buttonTitle')}
          </MenuItemButton>
        </ModalTrigger>
        <ModalContent>
          <ChangeSubjectLinksContent node={node} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};

interface ModalProps {
  onClose: () => void;
  node: Node;
  nodeType?: NodeType;
}

const ChangeSubjectLinksContent = ({ onClose, node, nodeType = 'SUBJECT' }: ModalProps) => {
  const { t, i18n } = useTranslation();
  const [loadError, setLoadError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [saved, setSaved] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { id, contentUri } = node;

  const subjects = useNodes(
    { language: i18n.language, nodeType: 'SUBJECT', isContext: true, taxonomyVersion },
    {
      select: (nodes) => nodes.sort((a, b) => a.name?.localeCompare(b.name)),
      placeholderData: [],
      onError: (error) => {
        handleError(error);
        setLoadError(t('taxonomy.changeSubjectLinks.loadError'));
      },
    },
  ).data?.map((subject) => {
    return { value: subject.id, label: subject.name };
  });

  const { loading, subjectpage, updateSubjectpage } = useFetchSubjectpageData(
    id,
    'nb',
    contentUri?.split(':').pop(),
  );

  const onSubmit = async (formik: FormikProps<FormikSubjectLinksValues>) => {
    const { setSubmitting, values } = formik;
    setSubmitting(true);

    try {
      await updateSubjectpage(
        subjectpage && typeof subjectpage.id === 'number' ? subjectpage.id : '',
        {
          connectedTo: values.connectedTo.map((v) => v.value),
          buildsOn: values.buildsOn.map((v) => v.value),
          leadsTo: values.leadsTo.map((v) => v.value),
        },
      );
    } catch (error) {
      console.error(error);
      handleError(error);
      setUpdateError(t('taxonomy.changeSubjectLinks.updateError'));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSaved(true);
  };

  if (loading) {
    return <Spinner />;
  }

  const initialValues = {
    connectedTo: subjectpage
      ? (subjects ?? []).filter((subject) => subjectpage.connectedTo.includes(subject.value))
      : [],
    buildsOn: subjectpage
      ? (subjects ?? []).filter((subject) => subjectpage.buildsOn.includes(subject.value))
      : [],
    leadsTo: subjectpage
      ? (subjects ?? []).filter((subject) => subjectpage.leadsTo.includes(subject.value))
      : [],
  };

  if (loadError) {
    return <StyledErrorMessage>{loadError}</StyledErrorMessage>;
  }

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t('taxonomy.changeSubjectLinks.title')}</ModalTitle>
        <CloseButton title={t('dialog.close')} data-testid="close-modal-button" onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <Formik initialValues={initialValues} onSubmit={(_, __) => {}} enableReinitialize={true}>
          {(formik) => {
            const { values, dirty, isSubmitting, isValid } = formik;
            const formIsDirty: boolean = isFormikFormDirty({ values, initialValues, dirty });
            if (formIsDirty) {
              setUpdateError('');
              setSaved(false);
            }
            return (
              <StyledForm>
                <FormikField
                  name="connectedTo"
                  label={t('taxonomy.changeSubjectLinks.connectedTo')}
                >
                  {({ field }: FieldProps) => {
                    return (
                      <Select
                        {...field}
                        options={subjects || []}
                        onChange={(v) => field.onChange({ target: { name: field.name, value: v } })}
                        isMulti
                        isSearchable
                      />
                    );
                  }}
                </FormikField>
                <FormikField name="buildsOn" label={t('taxonomy.changeSubjectLinks.buildsOn')}>
                  {({ field }: FieldProps) => {
                    return (
                      <Select
                        {...field}
                        options={subjects || []}
                        onChange={(v) => field.onChange({ target: { name: field.name, value: v } })}
                        isMulti
                        isSearchable
                      />
                    );
                  }}
                </FormikField>
                <FormikField name="leadsTo" label={t('taxonomy.changeSubjectLinks.leadsTo')}>
                  {({ field }: FieldProps) => {
                    return (
                      <Select
                        {...field}
                        options={subjects || []}
                        onChange={(v) => field.onChange({ target: { name: field.name, value: v } })}
                        isMulti
                        isSearchable
                      />
                    );
                  }}
                </FormikField>
                <UIField right noBorder>
                  <Row justifyContent="end">
                    <ButtonV2 onClick={onClose}>{t('taxonomy.changeSubjectLinks.cancel')}</ButtonV2>
                    <SaveButton
                      size="large"
                      isSaving={isSubmitting}
                      showSaved={saved}
                      onClick={() => onSubmit(formik)}
                      disabled={!isValid}
                    />
                  </Row>
                </UIField>
                {updateError && <StyledErrorMessage>{updateError}</StyledErrorMessage>}
              </StyledForm>
            );
          }}
        </Formik>
      </ModalBody>
    </>
  );
};

export default ChangeSubjectLinks;
