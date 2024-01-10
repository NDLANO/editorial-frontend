/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Formik } from 'formik';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { ButtonV2 } from '@ndla/button';
import { fonts, spacing, colors } from '@ndla/core';
import { InputV2 } from '@ndla/forms';
import { Option, SingleValue } from '@ndla/select';
import { IUpdatedArticle } from '@ndla/types-backend/draft-api';
import { Node } from '@ndla/types-taxonomy';
import PlannedResourceSelect from './PlannedResourceSelect';
import FormikField from '../../../components/FormikField';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import Spinner from '../../../components/Spinner';
import RelevanceOption from '../../../components/Taxonomy/RelevanceOption';
import { DRAFT_RESPONSIBLE, LAST_UPDATED_SIZE, RESOURCE_FILTER_CORE } from '../../../constants';
import { Auth0UserData } from '../../../interfaces';
import { useAuth0Responsibles } from '../../../modules/auth0/auth0Queries';
import { createDraft, updateUserData } from '../../../modules/draft/draftApi';
import { useUserData } from '../../../modules/draft/draftQueries';
import { RESOURCE_NODE, TOPIC_NODE } from '../../../modules/nodes/nodeApiTypes';
import {
  useAddNodeMutation,
  useCreateResourceResourceTypeMutation,
  usePostResourceForNodeMutation,
} from '../../../modules/nodes/nodeMutations';
import { nodeQueryKeys } from '../../../modules/nodes/nodeQueries';
import { getRootIdForNode } from '../../../modules/nodes/nodeUtil';
import { useAllResourceTypes } from '../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import { convertUpdateToNewDraft } from '../../../util/articleUtil';
import { getCommentWithInfoText } from '../../ArticlePage/components/InputComment';
import PrioritySelect from '../../FormikForm/components/PrioritySelect';
import { useSession } from '../../Session/SessionProvider';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.nsmall};
  padding-left: ${spacing.medium};
  padding-top: ${spacing.normal};
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

export const ErrorMessage = styled.div`
  color: ${colors.support.red};
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
  margin-bottom: ${spacing.medium};
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

interface PlannedResourceFormikType {
  title: string;
  comments: string;
  contentType: string;
  responsible: string;
  articleType: string;
  relevance: string;
  priority: string;
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
  priority: { required: false },
};

const toInitialValues = (responsible?: string, articleType?: string): PlannedResourceFormikType => {
  return {
    title: '',
    comments: '',
    contentType: '',
    responsible: responsible ?? '',
    articleType: articleType ?? 'standard',
    relevance: RESOURCE_FILTER_CORE,
    priority: 'unspecified',
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
}

const PlannedResourceForm = ({ articleType, node, onClose }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const { data: userData } = useUserData();

  const { t, i18n } = useTranslation();
  const { ndlaId, userName } = useSession();
  const { mutateAsync: addNodeMutation, isPending: addNodeMutationLoading } = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const nodeId = useMemo(() => node && getRootIdForNode(node), [node]);
  const compKey = nodeQueryKeys.resources({ id: node?.id, language: i18n.language });
  const compKeyChildNodes = nodeQueryKeys.childNodes({
    taxonomyVersion,
    id: nodeId,
    language: i18n.language,
  });
  const { mutateAsync: createNodeResource, isPending: postResourceLoading } =
    usePostResourceForNodeMutation({
      onSuccess: (_) => {
        qc.invalidateQueries({ queryKey: compKey });
        qc.invalidateQueries({ queryKey: compKeyChildNodes });
      },
    });
  const { mutateAsync: createResourceResourceType, isPending: createResourceTypeLoading } =
    useCreateResourceResourceTypeMutation({
      onSuccess: (_) => qc.invalidateQueries({ queryKey: compKey }),
    });
  const initialValues = useMemo(() => toInitialValues(ndlaId, articleType), [ndlaId, articleType]);
  const isTopicArticle = articleType === 'topic-article';

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
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
          .flatMap(
            (parent) =>
              parent.subtypes?.map((s) => ({
                label: `${parent.name} - ${s.name}`,
                value: `${s.id},${parent.id}`,
              })),
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
        const comment = values.comments && getCommentWithInfoText(values.comments, userName, t);
        const plannedResource: IUpdatedArticle = {
          title: values.title,
          comments: comment ? [{ content: comment, isOpen: true }] : [],
          language: i18n.language,
          articleType: values.articleType,
          responsibleId: values.responsible,
          revision: 0,
          priority: values.priority,
        };
        const createdArticle = await createDraft(convertUpdateToNewDraft(plannedResource));

        // Add created article to latest edited
        const latestEdited = uniq(
          [createdArticle.id.toString()].concat(userData?.latestEditedArticles ?? []),
        );
        await updateUserData({ latestEditedArticles: latestEdited.slice(0, LAST_UPDATED_SIZE) });

        // Create node in taxonomy
        const resourceUrl = await addNodeMutation({
          body: {
            name: values.title,
            contentUri: `urn:article:${createdArticle.id}`,
            nodeType: isTopicArticle ? TOPIC_NODE : RESOURCE_NODE,
            root: false,
            ...(isTopicArticle ? { visible: false } : {}),
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
          const [childContentType, parentContentType] = values.contentType.split(',');
          await createResourceResourceType({
            body: {
              resourceId: resourceId,
              resourceTypeId: childContentType,
            },
            taxonomyVersion,
          });

          if (parentContentType) {
            await createResourceResourceType({
              body: {
                resourceId: resourceId,
                resourceTypeId: parentContentType,
              },
              taxonomyVersion,
            });
          }
        }
        if (!(addNodeMutationLoading || postResourceLoading || createResourceTypeLoading)) {
          onClose();
        }
      } catch (e) {
        setError('taxonomy.errorMessage');
      }
    },
    [
      userName,
      t,
      i18n.language,
      userData?.latestEditedArticles,
      addNodeMutation,
      isTopicArticle,
      taxonomyVersion,
      createNodeResource,
      node?.id,
      addNodeMutationLoading,
      postResourceLoading,
      createResourceTypeLoading,
      createResourceResourceType,
      onClose,
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
          <StyledFormikField name="priority">
            {({ field, form }: FieldProps) => (
              <>
                <StyledLabel htmlFor="select-priority">{t('taxonomy.addPriority')}</StyledLabel>
                <PrioritySelect
                  id="select-priority"
                  priority={field.value}
                  menuPlacement="bottom"
                  inModal
                  updatePriority={(p: SingleValue) =>
                    form.setFieldValue('priority', p ? p.value : 'unspecified')
                  }
                />
              </>
            )}
          </StyledFormikField>
          <StyledFormikField name="relevance">
            {({ field }: FieldProps) => (
              <SwitchWrapper>
                <RelevanceOption
                  relevanceId={field.value}
                  onChange={(id: string) => {
                    field.onChange({ target: { name: field.name, value: id } });
                  }}
                />
                <StyledLabel htmlFor="toggleRelevanceId">{t('taxonomy.resourceType')}</StyledLabel>
              </SwitchWrapper>
            )}
          </StyledFormikField>
          <ButtonWrapper>
            <ButtonV2
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!dirty || !isValid}
              type="submit"
            >
              {t('taxonomy.create')}
              {(addNodeMutationLoading || postResourceLoading || createResourceTypeLoading) && (
                <Spinner appearance="small" />
              )}
            </ButtonV2>
          </ButtonWrapper>
          {error && <ErrorMessage>{t(error)}</ErrorMessage>}
        </StyledForm>
      )}
    </Formik>
  );
};

export default PlannedResourceForm;
