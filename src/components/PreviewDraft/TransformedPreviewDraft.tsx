/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AccessibilityFill } from "@ndla/icons";
import {
  Badge,
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import { ArticleType, ArticleTitle, ArticleContent, ArticleFooter, ArticleByline } from "@ndla/ui";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../DialogCloseButton";
import { FormArticle } from "./types";
import { getUpdatedLanguage } from "./useTransformedArticle";

interface Props {
  article: ArticleType;
  draft: FormArticle;
  contentType?: string;
}

export const TransformedPreviewDraft = ({ article, draft, contentType }: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [article]);

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  const disclaimerExists = Array.isArray(article.disclaimer) ? article.disclaimer.length > 0 : !!article.disclaimer;

  return (
    <>
      <ArticleTitle
        id={draft.id.toString()}
        badges={!!contentType?.length && <Badge>{t(`contentTypes.${contentType}`)}</Badge>}
        title={article.title}
        introduction={article.introduction}
        lang={getUpdatedLanguage(draft.language)}
        disclaimer={
          disclaimerExists ? (
            <DialogRoot>
              <DialogTrigger asChild>
                <Button variant="secondary" size="small">
                  {t("uuDisclaimer.title")}
                  <AccessibilityFill />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("uuDisclaimer.title")}</DialogTitle>
                  <DialogCloseButton />
                </DialogHeader>
                <DialogBody>
                  <div>{article.disclaimer}</div>
                </DialogBody>
              </DialogContent>
            </DialogRoot>
          ) : null
        }
      />
      <ArticleContent>{article.content ?? ""}</ArticleContent>
      <ArticleFooter>
        <ArticleByline
          footnotes={article.footNotes}
          authors={authors}
          suppliers={article.copyright?.rightsholders}
          published={article.published}
        />
      </ArticleFooter>
    </>
  );
};
