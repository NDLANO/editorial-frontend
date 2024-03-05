/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import AudioSearch from "@ndla/audio-search";
import { IAudioSummary, ISearchParams } from "@ndla/types-backend/audio-api";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { BrightcoveApiType } from "@ndla/types-embed";
import VideoSearch from "@ndla/video-search";
import FileUploader from "../../components/FileUploader";
import ImageSearchAndUploader from "../../components/ImageSearchAndUploader";
import config from "../../config";
import { Embed } from "../../interfaces";
import { fetchAudio, postSearchAudio } from "../../modules/audio/audioApi";
import { fetchImage, postSearchImages } from "../../modules/image/imageApi";
import { searchVideos, VideoSearchQuery } from "../../modules/video/brightcoveApi";
import { convertFieldWithFallback } from "../../util/convertFieldWithFallback";
import { NdlaErrorPayload, onError } from "../../util/resolveJsonOrRejectWithError";

const titles = (t: TFunction, resource: string) => ({
  [resource]: t(`form.visualElement.${resource.toLowerCase()}`),
});

interface Props {
  selectedResource: string;
  handleVisualElementChange: (returnType: Embed | DOMStringMap[]) => void;
  articleLanguage?: string;
  closeModal: () => void;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
}

interface LocalAudioSearchParams extends ISearchParams {
  locale?: string;
}

const searchAudios = (query: LocalAudioSearchParams) => {
  // AudioSearch passes values that are not accepted by the API. They must be altered to have the correct key.
  const correctedQuery: ISearchParams = {
    language: query.language ?? query.locale,
    page: query.page,
    query: query.query,
    sort: query.sort,
    pageSize: 16,
    audioType: query.audioType,
  };
  return postSearchAudio(correctedQuery);
};

const VisualElementSearch = ({
  selectedResource,
  handleVisualElementChange,
  articleLanguage,
  closeModal,
  showCheckbox: showMetaImageCheckbox,
  checkboxAction: onSaveAsMetaImage,
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  switch (selectedResource) {
    case "image":
      return (
        <ImageSearchAndUploader
          inModal={true}
          locale={locale}
          language={articleLanguage}
          closeModal={closeModal}
          fetchImage={(id) => fetchImage(id, articleLanguage)}
          searchImages={postSearchImages}
          onError={onError}
          onImageSelect={(image) =>
            handleVisualElementChange({
              resource: selectedResource,
              resource_id: image.id,
              size: "full",
              align: "",
              alt: convertFieldWithFallback<"alttext">(image, "alttext", ""),
              caption: convertFieldWithFallback<"caption">(image, "caption", ""),
              metaData: image,
            })
          }
          showCheckbox={showMetaImageCheckbox}
          checkboxAction={onSaveAsMetaImage}
        />
      );
    case "video": {
      const videoTranslations = {
        searchPlaceholder: t("videoSearch.searchPlaceholder"),
        searchButtonTitle: t("videoSearch.searchButtonTitle"),
        loadMoreVideos: t("videoSearch.loadMoreVideos"),
        noResults: t("videoSearch.noResults"),
        addVideo: t("videoSearch.addVideo"),
        previewVideo: t("videoSearch.previewVideo"),
        publishedDate: t("videoSearch.publishedDate"),
        duration: t("videoSearch.duration"),
        interactioncount: t("videoSearch.interactioncount"),
        is360Video: t("videoSearch.is360Video"),
      };

      return (
        <>
          <h2>{titles(t, selectedResource)[selectedResource]}</h2>
          <VideoSearch
            searchVideos={(query: VideoSearchQuery) => searchVideos(query)}
            locale={locale}
            translations={videoTranslations}
            onVideoSelect={(video: BrightcoveApiType) =>
              handleVisualElementChange({
                resource: "brightcove",
                videoid: video.id,
                caption: "",
                account: config.brightcoveAccountId!,
                player:
                  video.projection === "equirectangular"
                    ? config.brightcove360PlayerId!
                    : video.custom_fields["license"] === "Opphavsrett"
                      ? config.brightcoveCopyrightPlayerId!
                      : config.brightcovePlayerId!,
                metaData: video,
                title: video.name ?? "",
              })
            }
            onError={(e) => onError(e as NdlaErrorPayload)}
          />
        </>
      );
    }
    case "audio":
    case "podcast": {
      const audioType = selectedResource === "audio" ? "standard" : "podcast";
      const defaultQueryObject = {
        query: "",
        page: 1,
        pageSize: 16,
        locale,
        audioType,
      };

      const translations = {
        searchPlaceholder: t("audioSearch.searchPlaceholder"),
        searchButtonTitle: t("audioSearch.searchButtonTitle"),
        useAudio: t("audioSearch.useAudio"),
        noResults: t("audioSearch.noResults"),
      };

      return (
        <AudioSearch
          translations={translations}
          fetchAudio={(id: number) => fetchAudio(id, articleLanguage ?? locale)}
          searchAudios={searchAudios}
          onAudioSelect={(audio: IAudioSummary) =>
            handleVisualElementChange({
              resource: "audio",
              resourceId: audio.id.toString(),
              type: audioType,
              url: audio.url,
            })
          }
          onError={onError}
          queryObject={defaultQueryObject}
        />
      );
    }
    case "file":
      return (
        <FileUploader
          onFileSave={(files) => {
            const preparedFiles = files.map((file) => ({
              url: config.ndlaApiUrl + file.path,
              resource: "file",
              ...file,
            }));
            handleVisualElementChange(preparedFiles);
          }}
        />
      );
    default:
      return <h3>{`Embedtag ${selectedResource} is not supported.`}</h3>;
  }
};

export default VisualElementSearch;
