/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { AddLine, PencilFill, DeleteBinLine } from "@ndla/icons/action";
import { IconButton } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import MenuItemEditField from "./components/MenuItemEditField";
import RoundIcon from "../../../../components/RoundIcon";
import Spinner from "../../../../components/Spinner";
import { useGrepCodes } from "../../../../modules/grep/grepQueries";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { getRootIdForNode, isRootNode } from "../../../../modules/nodes/nodeUtil";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";

interface Props {
  editModeHandler: EditModeHandler;
  node: Node;
}

export const DropDownWrapper = styled("div")`
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const StyledGrepItem = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: calc(var(--spacing--small) / 2);
`;

const EditGrepCodes = ({ node, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const rootId = getRootIdForNode(node);
  const { t } = useTranslation();
  const { id, metadata } = node;
  const [grepCodes, setGrepCodes] = useState<string[]>(metadata?.grepCodes ?? []);
  const [addingNewGrepCode, setAddingNewGrepCode] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: patchMetadata } = useUpdateNodeMetadataMutation();
  const grepCodesWithName = useGrepCodes(grepCodes, editMode === "editGrepCodes");

  const updateMetadata = async (codes: string[]) => {
    await patchMetadata({
      id,
      metadata: { grepCodes: codes, visible: metadata.visible },
      rootId: isRootNode(node) ? undefined : rootId,
      taxonomyVersion,
    });
    setGrepCodes(codes);
  };

  const toggleEditModes = () => toggleEditMode("editGrepCodes");

  const addGrepCode = async (code: string) => updateMetadata([...grepCodes, code.toUpperCase()]);

  const deleteGrepCode = (code: string) => updateMetadata(grepCodes.filter((c) => c !== code));

  const grepCodesList = (
    <DropDownWrapper>
      {grepCodesWithName?.length > 0 ? (
        grepCodesWithName.map((grepCode, index) => {
          if (grepCode.isLoading) {
            return <Spinner key={index} />;
          }
          if (!grepCode.data) {
            return null;
          }
          return (
            <StyledGrepItem key={index}>
              {grepCode.data.title}
              <IconButton
                variant="danger"
                size="small"
                aria-label={t("taxonomy.grepCodes.delete", {
                  grepCode: grepCode.data.title,
                })}
                title={t("taxonomy.grepCodes.delete", {
                  grepCode: grepCode.data.title,
                })}
                data-testid="deleteGrepCode"
                onClick={() => deleteGrepCode(grepCode.data.code)}
              >
                <DeleteBinLine />
              </IconButton>
            </StyledGrepItem>
          );
        })
      ) : (
        <p>{t("taxonomy.grepCodes.empty")}</p>
      )}

      {addingNewGrepCode ? (
        <MenuItemEditField
          currentVal=""
          messages={{ errorMessage: t("taxonomy.errorMessage") }}
          dataTestid="addGrepCopde"
          onClose={() => setAddingNewGrepCode(!addingNewGrepCode)}
          onSubmit={addGrepCode}
          icon={<PencilFill />}
          placeholder={t("form.grepCodes.placeholder")}
        />
      ) : (
        <ButtonV2 variant="link" data-testid="addFilterButton" onClick={() => setAddingNewGrepCode(!addingNewGrepCode)}>
          <AddLine />
          {t("taxonomy.grepCodes.addNew")}
        </ButtonV2>
      )}
    </DropDownWrapper>
  );

  return (
    <>
      <MenuItemButton data-testid="editGrepCodes" onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<PencilFill />} />
        {t("taxonomy.grepCodes.edit")}
      </MenuItemButton>
      {editMode === "editGrepCodes" && grepCodesList}
    </>
  );
};

export default EditGrepCodes;
