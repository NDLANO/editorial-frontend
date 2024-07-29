/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import JumpToStructureButton from "./JumpToStructureButton";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import TaxonomyLightbox from "../../../components/Taxonomy/TaxonomyLightbox";
import config from "../../../config";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { StyledPlusIcon, BannerWrapper, FlexContentWrapper, TitleRow, TopInfoRow } from "../styles";

const IconButtonContainer = styled.div`
  display: flex;
`;
const FullWidth = styled.div`
  width: 100%;
`;

interface Props {
  subjectNode: Node;
}

const SubjectBanner = ({ subjectNode }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <BannerWrapper>
      <TopInfoRow>
        <FlexContentWrapper>
          <JumpToStructureButton nodeId={subjectNode.id} />
          <Modal open={open} onOpenChange={setOpen} modal={false}>
            <IconButtonContainer>
              <ModalTrigger>
                <ButtonV2 size="small">
                  <StyledPlusIcon />
                  {t("taxonomy.newTopic")}
                </ButtonV2>
              </ModalTrigger>
            </IconButtonContainer>
            <ModalContent forceOverlay size="normal" position="top">
              <TaxonomyLightbox title={t("taxonomy.addTopicHeader")}>
                <FullWidth>
                  <PlannedResourceForm node={subjectNode} articleType="topic-article" onClose={() => setOpen(false)} />
                </FullWidth>
              </TaxonomyLightbox>
              )
            </ModalContent>
          </Modal>
        </FlexContentWrapper>
        <FlexContentWrapper>
          {config.qualityEvaluationEnabled === true && (
            <QualityEvaluation
              articleType="subject"
              taxonomy={[subjectNode]}
              iconButtonColor="primary"
              gradeVariant="small"
            />
          )}
        </FlexContentWrapper>
      </TopInfoRow>
      <TitleRow>
        <Text textStyle="button" margin="none">
          {subjectNode.name}
        </Text>
      </TitleRow>
    </BannerWrapper>
  );
};

export default SubjectBanner;
