/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { EyeFill, ResetLeft } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { IArticle } from "@ndla/types-backend/draft-api";

import { PreviewResourceDialog } from "../../components/PreviewDraft/PreviewResourceDialog";

interface Props {
  showFromArticleApi: boolean;
  article: IArticle;
  resetVersion: (version: IArticle, language: string, showFromArticleApi: boolean) => Promise<void>;
  version: IArticle;
  current: boolean;
  currentLanguage: string;
}

const VersionActionButtons = ({
  showFromArticleApi,
  current,
  article,
  resetVersion,
  version,
  currentLanguage,
}: Props) => {
  const { t } = useTranslation();
  // we only show preview and reset for current versions if they are the ONLY version
  // ie. that they were published before versions were introduced
  if (current && !showFromArticleApi) return null;
  return (
    <>
      <PreviewResourceDialog
        type="version"
        article={version}
        language={currentLanguage}
        activateButton={
          <IconButton
            variant="tertiary"
            size="small"
            title={t("form.previewVersion")}
            aria-label={t("form.previewVersion")}
            data-testid="previewVersion"
          >
            <EyeFill />
          </IconButton>
        }
      />
      <IconButton
        variant="tertiary"
        size="small"
        aria-label={t("form.resetToVersion")}
        title={t("form.resetToVersion")}
        data-testid="resetToVersion"
        onClick={() => resetVersion(version, article.title!.language, showFromArticleApi)}
      >
        <ResetLeft />
      </IconButton>
    </>
  );
};

export default VersionActionButtons;
