/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { FieldProps, Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { useQueryClient } from '@tanstack/react-query';
import { ButtonV2 } from '@ndla/button';
import { InputV2 } from '@ndla/forms';
import { Option } from '@ndla/select';
import sortBy from 'lodash/sortBy';
import { IUpdatedArticle, IUserData } from '@ndla/types-backend/draft-api';
import { css } from '@emotion/react';
import uniq from 'lodash/uniq';
import { Node } from '@ndla/types-taxonomy';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import { useSession } from '../../Session/SessionProvider';
import {
  useAddNodeMutation,
  useCreateResourceResourceTypeMutation,
  usePostResourceForNodeMutation,
} from '../../../modules/nodes/nodeMutations';
import {
  childNodesWithArticleTypeQueryKey,
  resourcesWithNodeConnectionQueryKey,
} from '../../../modules/nodes/nodeQueries';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { RESOURCE_NODE, TOPIC_NODE } from '../../../modules/nodes/nodeApiTypes';
import FormikField from '../../../components/FormikField';
import { convertUpdateToNewDraft } from '../../../util/articleUtil';
import { DRAFT_WRITE_SCOPE, RESOURCE_FILTER_CORE } from '../../../constants';
import { useAuth0Responsibles } from '../../../modules/auth0/auth0Queries';
import { useAllResourceTypes } from '../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import PlannedResourceSelect from './PlannedResourceSelect';
import RelevanceOption from '../../../components/Taxonomy/RelevanceOption';
import { StyledErrorMessage } from '../folderComponents/styles';
import { Auth0UserData } from '../../../interfaces';
import { createDraft, updateUserData } from '../../../modules/draft/draftApi';
import { getRootIdForNode } from '../../../modules/nodes/nodeUtil';

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.nsmall};
  padding-left: ${spacing.medium};
`;

export const StyledLabel = styled.label`
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes('16px')};
`;

export const StyledFormikField = styled(FormikField)`
  margin: 0px;
  label {
    ${fonts.sizes('16px')};
  }
`;

export const ErrorMessage = styled(StyledErrorMessage)`
  width: fit-content;
`;

export const inputWrapperStyles = css`
  flex-direction: column;
  label {
    padding: 0;
    ${fonts.sizes('16px')};
    white-space: nowrap;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

export interface PlannedResourceFormikType {
  title: string;
  comments: string;
  contentType: string;
  responsible: string;
  articleType: string;
  relevance: string;
}

const plannedResourceRules: RulesType<PlannedResourceFormikType> = {
  title: {
    required: true,
  },
  comments: { required: false },
  contentType: {
    required: true,
    onlyValidateIf: (values: PlannedResourceFormikType) => values.articleType !== 'topic-article',
  },
  responsible: { required: true },
  relevance: { required: true },
};

const toInitialValues = (responsible?: string, articleType?: string): PlannedResourceFormikType => {
  return {
    title: '',
    comments: '',
    contentType: '',
    responsible: responsible ?? '',
    articleType: articleType ?? 'standard',
    relevance: RESOURCE_FILTER_CORE,
  };
};

const formatUserList = (users: Auth0UserData[]) =>
  users.map((u) => ({
    value: `${u.app_metadata.ndla_id}`,
    label: u.name,
  }));

interface Props {
  articleType: string;
  node: Node | undefined;
  onClose: () => void;
  userData: IUserData | undefined;
}

const PlannedResourceForm = ({ articleType, node, onClose, userData }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const { t, i18n } = useTranslation();
  const { ndlaId, userName } = useSession();
  const addNodeMutation = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const nodeId = useMemo(() => node && getRootIdForNode(node), [node]);
  const compKey = resourcesWithNodeConnectionQueryKey({ id: node?.id, language: i18n.language });
  const compKeyChildNodes = childNodesWithArticleTypeQueryKey({
    taxonomyVersion,
    id: nodeId,
    language: i18n.language,
  });
  const { mutateAsync: createNodeResource } = usePostResourceForNodeMutation({
    onSuccess: (_) => {
      qc.invalidateQueries(compKey);
      qc.invalidateQueries(compKeyChildNodes);
    },
  });
  const { mutateAsync: createResourceResourceType } = useCreateResourceResourceTypeMutation({
    onSuccess: (_) => qc.invalidateQueries(compKey),
  });
  const initialValues = useMemo(() => toInitialValues(ndlaId, articleType), [ndlaId, articleType]);
  const isTopicArticle = articleType === 'topic-article';

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_WRITE_SCOPE },
    {
      select: (users) => sortBy(formatUserList(users), (u) => u.label),
      placeholderData: [],
    },
  );

  const { data: contentTypes } = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    {
      select: (res) =>
        res
          .flatMap((parent) =>
            parent.subtypes?.map((s) => ({ label: `${parent.name} - ${s.name}`, value: s.id })),
          )
          .filter((r) => !!r) as Option[],
      placeholderData: [],
      enabled: !isTopicArticle,
    },
  );
  const onSubmit = useCallback(
    async (values: PlannedResourceFormikType) => {
      try {
        setError(undefined);
        const plannedResource: IUpdatedArticle = {
          title: values.title,
          comments: values.comments.length ? [{ content: values.comments, isOpen: true }] : [],
          language: i18n.language,
          articleType: values.articleType,
          responsibleId: values.responsible,
          revision: 0,
        };
        const createdArticle = await createDraft(convertUpdateToNewDraft(plannedResource));

        // Add created article to latest edited
        const latestEdited = uniq(
          [createdArticle.id.toString()].concat(userData?.latestEditedArticles ?? []),
        );
        await updateUserData({ latestEditedArticles: latestEdited.slice(0, 10) });

        // Create node in taxonomy
        const resourceUrl = await addNodeMutation.mutateAsync({
          body: {
            name: values.title,
            contentUri: `urn:article:${createdArticle.id}`,
            nodeType: isTopicArticle ? TOPIC_NODE : RESOURCE_NODE,
            root: false,
          },
          taxonomyVersion,
        });

        // Position node in taxonomy
        const resourceId = resourceUrl.replace('/v1/nodes/', '');
        await createNodeResource({
          body: { resourceId: resourceId, nodeId: node?.id ?? '', relevanceId: values.relevance },
          taxonomyVersion,
        });

        if (!isTopicArticle) {
          await createResourceResourceType({
            body: {
              resourceId: resourceId,
              resourceTypeId: values.contentType,
            },
            taxonomyVersion,
          });
          onClose();
        }
      } catch (e) {
        setError('taxonomy.errorMessage');
      }
    },
    [
      addNodeMutation,
      createNodeResource,
      createResourceResourceType,
      i18n.language,
      isTopicArticle,
      node?.id,
      onClose,
      taxonomyVersion,
      userData?.latestEditedArticles,
    ],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validateFormik(values, plannedResourceRules, t)}
      validateOnMount
    >
      {({ dirty, isValid, handleSubmit }) => (
        <StyledForm id="planned-resource-form">
          <StyledFormikField name="title">
            {({ field }: FieldProps) => (
              <InputV2
                customCss={inputWrapperStyles}
                label={t('taxonomy.title')}
                placeholder={t('taxonomy.title')}
                white
                {...field}
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="comments">
            {({ field }: FieldProps) => (
              <InputV2
                customCss={inputWrapperStyles}
                label={t('taxonomy.comment')}
                placeholder={t('taxonomy.commentPlaceholder')}
                white
                {...field}
              />
            )}
          </StyledFormikField>
          {!isTopicArticle && (
            <PlannedResourceSelect
              label="taxonomy.contentType"
              fieldName="contentType"
              id="select-contentType"
              placeholder="taxonomy.contentTypePlaceholder"
              options={contentTypes?.length ? contentTypes : []}
            />
          )}
          <PlannedResourceSelect
            label="form.responsible.label"
            fieldName="responsible"
            id="select-responsible"
            placeholder="form.responsible.label"
            options={users ?? []}
            defaultValue={ndlaId && userName ? { value: ndlaId, label: userName } : undefined}
          />
          <StyledFormikField name="relevance">
            {({ field }: FieldProps) => (
              <SwitchWrapper>
                <StyledLabel htmlFor="toggleRelevanceId">{t('taxonomy.resourceType')}</StyledLabel>
                <RelevanceOption
                  relevanceId={field.value}
                  onChange={(id: string) => {
                    field.onChange({ target: { name: field.name, value: id } });
                  }}
                />
              </SwitchWrapper>
            )}
          </StyledFormikField>
          <ButtonWrapper>
            <ButtonV2
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
                onClose();
              }}
              disabled={!dirty || !isValid}
              type="submit"
            >
              {t('taxonomy.create')}
            </ButtonV2>
          </ButtonWrapper>
          {error && <ErrorMessage>{t(error)}</ErrorMessage>}
        </StyledForm>
      )}
    </Formik>
  );
};

export default PlannedResourceForm;
