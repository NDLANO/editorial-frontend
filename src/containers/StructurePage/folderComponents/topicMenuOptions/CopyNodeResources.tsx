/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorWarningLine, CheckLine } from "@ndla/icons";
import { Text, Spinner, MessageBox } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild, NodeType } from "@ndla/types-taxonomy";
import { cloneDraft } from "../../../../modules/draft/draftApi";
import { learningpathCopy } from "../../../../modules/learningpath/learningpathApi";
import { cloneNode, fetchNodeResources, postNodeConnection } from "../../../../modules/nodes/nodeApi";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { routes } from "../../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { linkRecipe } from "../../resourceComponents/Resource";
import NodeSearchDropdown from "../sharedMenuOptions/components/NodeSearchDropdown";

type ActionType = "copyResources" | "cloneResources";
interface Props {
  currentNode: Node;
  nodeType: NodeType;
  type: ActionType;
}

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    width: "100%",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: {
    fill: "stroke.success",
  },
});

const StatusIndicatorContent = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledErrorTextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const CopyNodeResources = ({ currentNode, nodeType, type }: Props) => {
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

  const prepareForAction = () => {
    setFailedResources([]);
    setDone(false);
    setCount(0);
    setTotalAmount(0);
    setShowDisplay(true);
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
      queryKey: nodeQueryKeys.childNodes({
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
    await postNodeConnection({
      taxonomyVersion,
      body: {
        primary: isPrimary,
        rank,
        childId: id,
        parentId: currentNode.id,
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

  const prefixText = t(`taxonomy.${type}.${done ? "done" : "waiting"}`);

  return (
    <Wrapper>
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
      {!!showDisplay && (
        <StatusIndicatorContent aria-live="polite">
          {done ? <StyledCheckLine /> : <Spinner size="small" />}
          <Text>{`${prefixText} (${count}/${totalAmount})`}</Text>
        </StatusIndicatorContent>
      )}
      {failedResources.length > 0 && (
        <MessageBox variant="error">
          <ErrorWarningLine />
          <StyledErrorTextWrapper>
            <Text>{t(`taxonomy.${type}.error`)}</Text>
            <>
              {failedResources.map((res, index) => {
                const numericId = parseInt(res.contentUri?.split(":").pop() ?? "");
                return (
                  <Fragment key={index}>
                    {numericId ? (
                      <SafeLink
                        to={
                          res.contentUri?.includes("learningpath")
                            ? routes.learningpath.edit(numericId, language)
                            : routes.editArticle(numericId, "standard")
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        css={linkRecipe.raw()}
                      >
                        {res.name}
                      </SafeLink>
                    ) : (
                      <Text textStyle="body.link">{res.name}</Text>
                    )}
                  </Fragment>
                );
              })}
            </>
          </StyledErrorTextWrapper>
        </MessageBox>
      )}
    </Wrapper>
  );
};

export default CopyNodeResources;
