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
import { AudioSearch } from "@ndla/audio-search";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Cross } from "@ndla/icons/action";
import { Audio } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { AudioEmbedData } from "@ndla/types-embed";
import { AudioPlayer } from "@ndla/ui";
import { fetchAudio, searchAudio } from "../../../modules/audio/audioApi";
import { AudioSearchParams } from "../../../modules/audio/audioApiInterfaces";
import { useAudio } from "../../../modules/audio/audioQueries";
import { onError } from "../../../util/resolveJsonOrRejectWithError";

interface Props {
  glossLanguage: string;
  element?: AudioEmbedData;
  onElementChange: (element?: AudioEmbedData) => void;
}

const AudioWrapper = styled.div`
  display: flex;
  justify-items: flex-start;
  gap: ${spacing.small};
`;

interface LocalAudioSearchParams extends Omit<AudioSearchParams, "audio-type" | "page-size"> {
  audioType?: string;
  pageSize?: number;
  locale?: string;
}
const searchAudios = (query: LocalAudioSearchParams) => {
  // AudioSearch passes values that are not accepted by the API. They must be altered to have the correct key.
  const correctedQuery: AudioSearchParams = {
    language: query.language ?? query.locale,
    page: query.page,
    query: query.query,
    sort: query.sort,
    "page-size": 16,
    "audio-type": query.audioType,
  };
  return searchAudio(correctedQuery);
};

export const GlossAudioField = ({ element, onElementChange, glossLanguage }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const audioQuery = useAudio({ id: parseInt(element?.resourceId!), language: glossLanguage }, { enabled: !!element });

  const defaultQueryObject = {
    query: "",
    page: 1,
    pageSize: 16,
    locale: glossLanguage,
  };

  if (!!element && audioQuery.data) {
    return (
      <AudioWrapper>
        <AudioPlayer speech src={audioQuery.data.audioFile.url} title={audioQuery.data.title.title} />
        <IconButtonV2
          variant="ghost"
          colorTheme="danger"
          aria-label={t("remove")}
          title={t("remove")}
          onClick={() => onElementChange(undefined)}
        >
          <Cross />
        </IconButtonV2>
      </AudioWrapper>
    );
  } else if (element) {
    return <Spinner />;
  }

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger>
        <ButtonV2 colorTheme="light">
          <Audio />
          {t("form.gloss.audio.button")}
        </ButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("audioSearch.useAudio")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <AudioSearch
            translations={{
              searchPlaceholder: t("audioSearch.searchPlaceholder"),
              searchButtonTitle: t("audioSearch.searchButtonTitle"),
              useAudio: t("audioSearch.useAudio"),
              noResults: t("audioSearch.noResults"),
            }}
            fetchAudio={(id) => fetchAudio(id, glossLanguage)}
            searchAudios={searchAudios}
            onAudioSelect={(el) => {
              onElementChange({
                resource: "audio",
                resourceId: el.id.toString(),
                type: "standard",
                url: el.url,
              });
              setIsOpen(false);
            }}
            onError={onError}
            queryObject={defaultQueryObject}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
