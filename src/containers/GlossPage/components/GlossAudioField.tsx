/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AudioSearch } from "@ndla/audio-search";
import { CloseLine } from "@ndla/icons/action";
import { Audio } from "@ndla/icons/common";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ISearchParams } from "@ndla/types-backend/audio-api";
import { AudioEmbedData } from "@ndla/types-embed";
import { AudioPlayer, useAudioSearchTranslations } from "@ndla/ui";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { OldSpinner } from "../../../components/OldSpinner";
import { fetchAudio, postSearchAudio } from "../../../modules/audio/audioApi";
import { useAudio } from "../../../modules/audio/audioQueries";
import { onError } from "../../../util/resolveJsonOrRejectWithError";

interface Props {
  glossLanguage: string;
  element?: AudioEmbedData;
  onElementChange: (element?: AudioEmbedData) => void;
}

const AudioWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

interface LocalAudioSearchParams extends ISearchParams {
  locale?: string;
}
const searchAudios = (query: LocalAudioSearchParams) => {
  // AudioSearch passes values that are not accepted by the API. They must be altered to have the correct key.
  const correctedSearchBody: ISearchParams = {
    language: query.language ?? query.locale,
    page: query.page,
    query: query.query,
    sort: query.sort,
    pageSize: 16,
    audioType: query.audioType,
  };
  return postSearchAudio(correctedSearchBody);
};

export const GlossAudioField = ({ element, onElementChange, glossLanguage }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const audioQuery = useAudio({ id: parseInt(element?.resourceId!), language: glossLanguage }, { enabled: !!element });
  const audioSearchTranslations = useAudioSearchTranslations();

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
        <IconButton
          variant="danger"
          aria-label={t("remove")}
          title={t("remove")}
          onClick={() => onElementChange(undefined)}
        >
          <CloseLine />
        </IconButton>
      </AudioWrapper>
    );
  } else if (element) {
    return <OldSpinner />;
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <DialogTrigger asChild>
        <Button>
          <Audio />
          {t("form.gloss.audio.button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("audioSearch.useAudio")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <AudioSearch
            translations={audioSearchTranslations}
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
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
