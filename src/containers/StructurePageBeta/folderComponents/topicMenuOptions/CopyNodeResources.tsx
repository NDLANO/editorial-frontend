/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Copy } from '@ndla/icons/action';
import { spacing, colors } from '@ndla/core';
import { Spinner } from '@ndla/editor';
import { Done } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import { NodeType, ResourceWithNodeConnection } from '../../../../modules/nodes/nodeApiTypes';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import NodeSearchDropdown from '../sharedMenuOptions/components/NodeSearchDropdown';
import { fetchNodeResources, postResourceForNode } from '../../../../modules/nodes/nodeApi';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { cloneDraft } from '../../../../modules/draft/draftApi';
import { cloneResource } from '../../../../modules/taxonomy/resources';
import { learningpathCopy } from '../../../../modules/learningpath/learningpathApi';
import { EditMode } from '../../../../interfaces';
import AlertModal from '../../../../components/AlertModal';
import ResourceItemLink from '../../resourceComponents/ResourceItemLink';
import { resourcesWithNodeConnectionQueryKey } from '../../../../modules/nodes/nodeQueries';

type ActionType = Extract<EditMode, 'copyResources' | 'cloneResources'>;
interface Props {
  currentNode: NodeType;
  editModeHandler: EditModeHandler;
  type: ActionType;
}

const iconCss = css`
  width: 8px;
  height: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const LinkWrapper = styled.div`
  a {
    color: ${colors.white};
    &:hover {
      color: ${colors.white};
    }
  }
  margin-top: 0.5em;
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${spacing.normal};
`;

const StyledDone = styled(Done)`
  margin: 0px 4px;
  color: green;
`;

const CopyNodeResources = ({
  editModeHandler: { editMode, toggleEditMode },
  currentNode,
  type,
}: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [failedResources, setFailedResources] = useState<ResourceWithNodeConnection[]>([]);
  const [showDisplay, setShowDisplay] = useState(false);
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(failedResources.length !== 0 && done);
  }, [failedResources, done]);

  const toggleEditModeFunc = () => toggleEditMode(type);

  const prepareForAction = () => {
    setFailedResources([]);
    setDone(false);
    setCount(0);
    setTotalAmount(0);
    setShowDisplay(true);
    toggleEditModeFunc();
  };

  const cloneOrCopyResources = async (node: NodeType, type: ActionType) => {
    prepareForAction();
    const resources = await fetchNodeResources({ id: node.id, taxonomyVersion, language });
    setTotalAmount(resources.length);
    const action = type === 'cloneResources' ? clone : copy;
    await Promise.all(resources.map(async res => await doAction(res, action)));
    setDone(true);
    qc.invalidateQueries(
      resourcesWithNodeConnectionQueryKey({ id: currentNode.id, taxonomyVersion }),
    );
  };

  const doAction = async (
    res: ResourceWithNodeConnection,
    action: (res: ResourceWithNodeConnection) => Promise<string>,
  ) => {
    try {
      const result = await action(res);
      setCount(count => count + 1);
      return result;
    } catch (e) {
      setFailedResources(prev => prev.concat(res));
      return e;
    }
  };

  const copy = async ({ primary, id, rank }: ResourceWithNodeConnection): Promise<string> =>
    await postResourceForNode({
      taxonomyVersion,
      body: { primary, rank, resourceId: id, nodeId: currentNode.id },
    });

  const clone = async (resource: ResourceWithNodeConnection): Promise<string> => {
    const newLocation = await _clone(resource);
    return await copy({ ...resource, id: newLocation.replace('/v1/resources/', '') });
  };

  const _clone = async (resource: ResourceWithNodeConnection): Promise<string> => {
    const [, resourceType, idString] = resource.contentUri?.split(':')[1] ?? [];
    const id = Number(idString);
    if (resourceType === 'article' && id) {
      const clonedArticle = await cloneDraft(id, undefined, false);
      const body = { contentUri: `urn:article:${clonedArticle.id}`, name: resource.name };
      return await cloneResource({ id: resource.id, taxonomyVersion, body });
    } else if (resourceType === 'learningpath' && id) {
      const lpBody = { title: resource.name, language };
      const clonedLp = await learningpathCopy(id, lpBody);
      const body = { contentUri: `urn:learningpath:${clonedLp.id}`, name: resource.name };
      return await cloneResource({ id: resource.id, taxonomyVersion, body });
    } else {
      return await cloneResource({
        id: resource.id,
        taxonomyVersion,
        body: { name: resource.name },
      });
    }
  };

  if (editMode === type) {
    return (
      <Wrapper>
        <RoundIcon open small smallIcon icon={<Copy />} />
        <NodeSearchDropdown
          placeholder={t('taxonomy.existingTopic')}
          onChange={node => cloneOrCopyResources(node, type)}
          searchNodeType={'TOPIC'}
          filter={node => {
            return (
              !!node.path &&
              !node.paths?.some(p => {
                const split = p.replace('/', '').split('/');
                return split[split.length - 2] === currentNode.id.replace('urn:', '');
              })
            );
          }}
        />
      </Wrapper>
    );
  }

  const prefixText = t(`taxonomy.${type}.${done ? 'done' : 'waiting'}`);

  return (
    <>
      <MenuItemButton stripped onClick={toggleEditModeFunc}>
        <RoundIcon small icon={<Copy css={iconCss} />} />
        {t(`taxonomy.${type}.info`)}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? <StyledDone /> : <Spinner size="normal" margin="0px 4px" />}
          {`${prefixText} (${count}/${totalAmount})`}
        </StyledDiv>
      )}
      <AlertModal
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t(`taxonomy.${type}.error`)}
        component={failedResources.map(res => (
          <LinkWrapper>
            <ResourceItemLink
              contentType={
                res.contentUri?.split(':')[1] === 'article' ? 'article' : 'learning-resource'
              }
              contentUri={res.contentUri}
              name={res.name}
            />
          </LinkWrapper>
        ))}
      />
    </>
  );
};

export default CopyNodeResources;
