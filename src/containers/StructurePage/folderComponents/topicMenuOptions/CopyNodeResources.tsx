/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { spacing, colors } from "@ndla/core";
import { Copy } from "@ndla/icons/action";
import { Done } from "@ndla/icons/editor";
import { Node, NodeChild, NodeType } from "@ndla/types-taxonomy";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { OldSpinner } from "../../../../components/OldSpinner";
import RoundIcon from "../../../../components/RoundIcon";
import { EditMode } from "../../../../interfaces";
import { cloneDraft } from "../../../../modules/draft/draftApi";
import { learningpathCopy } from "../../../../modules/learningpath/learningpathApi";
import { cloneNode, fetchNodeResources, postResourceForNode } from "../../../../modules/nodes/nodeApi";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import ResourceItemLink from "../../resourceComponents/ResourceItemLink";
import { EditModeHandler } from "../SettingsMenuDropdownType";
import MenuItemButton from "../sharedMenuOptions/components/MenuItemButton";
import NodeSearchDropdown from "../sharedMenuOptions/components/NodeSearchDropdown";

type ActionType = Extract<EditMode, "copyResources" | "cloneResources">;
interface Props {
  currentNode: Node;
  nodeType: NodeType;
  editModeHandler: EditModeHandler;
  type: ActionType;
}

const StyledSpinner = styled(OldSpinner)`
  margin: 0px 4px;
`;

const StyledCopyIcon = styled(Copy)`
  width: 8px;
  height: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.xsmall};
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

const CopyNodeResources = ({ editModeHandler: { editMode, toggleEditMode }, currentNode, nodeType, type }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [failedResources, setFailedResources] = useState<NodeChild[]>([]);
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

  const cloneOrCopyResources = async (node: Node, type: ActionType) => {
    prepareForAction();
    const resources = await fetchNodeResources({
      id: node.id,
      taxonomyVersion,
      language,
    });
    setTotalAmount(resources.length);
    const action = type === "cloneResources" ? clone : copy;
    await Promise.all(resources.map(async (res) => await doAction(res, action)));
    setDone(true);
    qc.invalidateQueries({
      queryKey: nodeQueryKeys.resources({
        id: currentNode.id,
        taxonomyVersion,
      }),
    });
  };

  const doAction = async (res: NodeChild, action: (res: NodeChild) => Promise<string>) => {
    try {
      const result = await action(res);
      setCount((count) => count + 1);
      return result;
    } catch (e) {
      setFailedResources((prev) => prev.concat(res));
      return e;
    }
  };

  const copy = async ({ isPrimary, id, rank }: NodeChild): Promise<string> =>
    await postResourceForNode({
      taxonomyVersion,
      body: {
        primary: isPrimary,
        rank,
        resourceId: id,
        nodeId: currentNode.id,
      },
    });

  const clone = async (resource: NodeChild): Promise<string> => {
    const newLocation = await _clone(resource);
    return await copy({
      ...resource,
      id: newLocation.replace("/v1/nodes/", ""),
    });
  };

  const _clone = async (resource: NodeChild): Promise<string> => {
    const [, resourceType, idString] = resource.contentUri?.split(":") ?? [];
    const id = Number(idString);
    if (resourceType === "article" && id) {
      const clonedArticle = await cloneDraft(id, undefined, false);
      const body = {
        contentUri: `urn:article:${clonedArticle.id}`,
        name: resource.name,
      };
      return await cloneNode({ id: resource.id, taxonomyVersion, body });
    } else if (resourceType === "learningpath" && id) {
      const lpBody = { title: resource.name, language };
      const clonedLp = await learningpathCopy(id, lpBody);
      const body = {
        contentUri: `urn:learningpath:${clonedLp.id}`,
        name: resource.name,
      };
      return await cloneNode({ id: resource.id, taxonomyVersion, body });
    } else {
      return await cloneNode({
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
          label={t(`taxonomy.${type}.info`)}
          placeholder={t(`taxonomy.${type}.placeholder`, { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
          onChange={(node) => cloneOrCopyResources(node, type)}
          searchNodeType={"TOPIC"}
          filter={(node) => {
            return (
              !!node.path &&
              !node.paths?.some((p) => {
                const split = p.replace("/", "").split("/");
                return split[split.length - 2] === currentNode.id.replace("urn:", "");
              })
            );
          }}
        />
      </Wrapper>
    );
  }

  const prefixText = t(`taxonomy.${type}.${done ? "done" : "waiting"}`);

  return (
    <>
      <MenuItemButton onClick={toggleEditModeFunc}>
        <RoundIcon small icon={<StyledCopyIcon />} />
        {t(`taxonomy.${type}.info`)}
      </MenuItemButton>
      {showDisplay && (
        <StyledDiv>
          {done ? <StyledDone /> : <StyledSpinner size="normal" />}
          {`${prefixText} (${count}/${totalAmount})`}
        </StyledDiv>
      )}
      <AlertDialog
        title={t("errorMessage.description")}
        label={t("errorMessage.description")}
        show={showAlert}
        onCancel={() => setShowAlert(false)}
        text={t(`taxonomy.${type}.error`)}
      >
        {failedResources.map((res, index) => (
          <LinkWrapper key={index}>
            <ResourceItemLink
              contentType={res.contentUri?.split(":")[1] === "article" ? "article" : "learning-resource"}
              contentUri={res.contentUri}
              name={res.name}
            />
          </LinkWrapper>
        ))}
      </AlertDialog>
    </>
  );
};

export default CopyNodeResources;
