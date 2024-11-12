/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, KeyboardEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AddLine, PencilFill, DeleteBinLine } from "@ndla/icons/action";
import { CheckLine } from "@ndla/icons/editor";
import { Text, Button, IconButton, Input, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import RoundIcon from "../../../../components/RoundIcon";
import { fetchGrepCodeTitle } from "../../../../modules/grep/grepApi";
import { GrepCode } from "../../../../modules/grep/grepApiInterfaces";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { getRootIdForNode, isRootNode } from "../../../../modules/nodes/nodeUtil";
import { isGrepCodeValid } from "../../../../util/articleUtil";
import handleError from "../../../../util/handleError";
import { convertGrepCodesToObject } from "../../../FormikForm/GrepCodesField";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";

const GrepCodesList = styled("ul", {
  base: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const GrepCodeListItem = styled("li", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "3xsmall",
  },
});

const StyledButton = styled(Button, {
  base: { alignSelf: "flex-start" },
});

const StyledMenuItemEditField = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

interface Props {
  editModeHandler: EditModeHandler;
  node: Node;
}

const EditGrepCodes = ({ node, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const rootId = getRootIdForNode(node);
  const { t } = useTranslation();
  const { id, metadata } = node;
  const [grepCodes, setGrepCodes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("initial");
  const [input, setInput] = useState<string>("");
  const [addingNewGrepCode, setAddingNewGrepCode] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: patchMetadata } = useUpdateNodeMetadataMutation();

  useEffect(() => {
    (async () => {
      const grepCodesObject = await convertGrepCodesToObject(metadata?.grepCodes ?? []);
      setGrepCodes(grepCodesObject);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMetadata = async (codes: string[]) => {
    try {
      await patchMetadata({
        id,
        metadata: { grepCodes: codes, visible: metadata.visible },
        rootId: isRootNode(node) ? undefined : rootId,
        taxonomyVersion,
      });
      setStatus("success");
    } catch (e) {
      handleError(e);
      setStatus("error");
    }
  };

  const fetchGrepCodeTitles = async (grepCode: string): Promise<GrepCode | undefined> => {
    if (!isGrepCodeValid(grepCode) || grepCodes[grepCode]) {
      setStatus("error");
      return;
    }
    const grepCodeTitle = await fetchGrepCodeTitle(grepCode);
    const isGrepCodeSaved = grepCodes[grepCode];

    if (grepCodeTitle && !isGrepCodeSaved) {
      return {
        code: grepCode,
        title: `${grepCode} - ${grepCodeTitle}`,
      };
    } else if (!isGrepCodeSaved) {
      setStatus("error");
    }
  };
  const addGrepCode = async (newValue: string) => {
    setStatus("loading");
    const trimmedValue = newValue.toUpperCase().trim();
    const grepCodeWithName = await fetchGrepCodeTitles(trimmedValue);
    if (!grepCodeWithName) return;
    setGrepCodes((prev) => ({ ...prev, [grepCodeWithName.code]: grepCodeWithName.title }));
    await updateMetadata([...Object.keys(grepCodes), grepCodeWithName.code]);
    setInput("");
    setAddingNewGrepCode(!addingNewGrepCode);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setStatus("initial");
    }
    if (e.key === "Enter") {
      addGrepCode(input);
    }
  };

  const deleteGrepCode = async (code: string) => {
    setStatus("loading");
    const { [code]: _, ...remaining } = grepCodes;
    await updateMetadata(Object.keys(remaining));
    setGrepCodes(remaining);
  };

  const grepCodesList = Object.entries(grepCodes);

  return (
    <>
      <MenuItemButton data-testid="editGrepCodes" onClick={() => toggleEditMode("editGrepCodes")}>
        <RoundIcon small icon={<PencilFill />} />
        {t("taxonomy.grepCodes.edit")}
        {status === "loading" && <Spinner size="small" />}
      </MenuItemButton>
      {editMode === "editGrepCodes" && (
        <GrepCodesList>
          {grepCodesList.length ? (
            grepCodesList.map(([code, title]) => (
              <GrepCodeListItem key={code}>
                <Text>{title}</Text>
                <IconButton
                  variant="danger"
                  size="small"
                  aria-label={t("taxonomy.grepCodes.delete", {
                    grepCode: title,
                  })}
                  title={t("taxonomy.grepCodes.delete", {
                    grepCode: title,
                  })}
                  data-testid="deleteGrepCode"
                  onClick={() => deleteGrepCode(code)}
                  disabled={status === "loading"}
                  loadingContent={status === "loading"}
                >
                  <DeleteBinLine />
                </IconButton>
              </GrepCodeListItem>
            ))
          ) : (
            <Text>{t("taxonomy.grepCodes.empty")}</Text>
          )}
          {addingNewGrepCode ? (
            <>
              <StyledMenuItemEditField>
                <Input
                  type="text"
                  componentSize="small"
                  placeholder={t("form.grepCodes.placeholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <IconButton
                  size="small"
                  data-testid="inlineEditSaveButton"
                  onClick={() => addGrepCode(input)}
                  title={t("save")}
                  aria-label={t("save")}
                  disabled={status === "loading"}
                  loadingContent={status === "loading"}
                >
                  <CheckLine />
                </IconButton>
              </StyledMenuItemEditField>
              {status === "error" && <Text color="text.error">{t("taxonomy.errorMessage")}</Text>}
            </>
          ) : (
            <StyledButton
              variant="secondary"
              size="small"
              data-testid="addFilterButton"
              onClick={() => setAddingNewGrepCode(!addingNewGrepCode)}
            >
              <AddLine />
              {t("taxonomy.grepCodes.addNew")}
            </StyledButton>
          )}
        </GrepCodesList>
      )}
    </>
  );
};

export default EditGrepCodes;
