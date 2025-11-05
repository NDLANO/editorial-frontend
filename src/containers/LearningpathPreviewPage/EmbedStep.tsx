/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleContent, ArticleTitle, ArticleWrapper, ExternalEmbed } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import { OembedResponse } from "../../interfaces";
import { fetchExternalOembed } from "../../util/apiHelpers";
import { isNDLAFrontendUrl } from "../../util/htmlHelpers";

interface Props {
  step: LearningStepV2DTO;
}

const buildOembedFromIframeUrl = (url: string, title: string): OembedResponse => {
  return {
    type: "rich",
    version: "1.0",
    height: 800,
    width: 800,
    html: `<iframe src="${url}" frameborder="0" allowFullscreen="" />`,
    title,
  };
};

const getOembed = async (learningpathStep: LearningStepV2DTO): Promise<Omit<OembedResponse, "title"> | null> => {
  if (!learningpathStep.embedUrl || !learningpathStep.embedUrl.url) {
    return null;
  }
  if (learningpathStep.embedUrl && learningpathStep.embedUrl.embedType === "iframe") {
    return buildOembedFromIframeUrl(learningpathStep.embedUrl.url, learningpathStep.title.title);
  }
  if (
    learningpathStep.embedUrl &&
    learningpathStep.embedUrl.embedType === "oembed" &&
    learningpathStep.embedUrl.url !== "https://ndla.no"
  ) {
    return fetchExternalOembed(learningpathStep.embedUrl.url);
  }
  return null;
};

export const EmbedStep = ({ step }: Props) => {
  const query = useQuery({
    queryKey: ["learningpathOembed", step.embedUrl?.url],
    queryFn: () => getOembed(step),
    enabled: !!step.embedUrl?.url,
  });

  if (query.isPending) {
    return <Spinner />;
  }

  if (!step.embedUrl?.url || !query.data) return null;

  if (isNDLAFrontendUrl(step.embedUrl.url) && query.data.html) {
    return <LearningpathIframe url={step.embedUrl.url} html={query.data.html} title={step.title.title} />;
  }

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle id={step.id.toString()} contentType="external" title={step.title.title} />
        <ArticleContent>
          <section>
            <ExternalEmbed
              embed={{
                resource: "external",
                status: "success",
                embedData: {
                  resource: "external",
                  url: step.embedUrl?.url ?? "",
                  title: step.title.title,
                },
                data: {
                  oembed: query.data,
                },
              }}
            />
          </section>
        </ArticleContent>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};

const IframeWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "100%",
    "& > iframe": {
      width: "100%",
      minHeight: "surface.medium",
      tablet: {
        borderRadius: "xsmall",
      },
    },
  },
});

interface LearningpathIframeProps {
  html: string;
  url: string;
  title: string;
}

const LearningpathIframe = ({ html, url, title }: LearningpathIframeProps) => {
  const iframeRef = useRef<HTMLInputElement>(null);
  const [listeningToMessages, setListeningToMessages] = useState(true);

  const handleIframeResizing = (url: string) => {
    if (isNDLAFrontendUrl(url)) {
      enableIframeMessageListener();
    } else {
      disableIframeMessageListener();
    }
  };

  useEffect(() => {
    handleIframeResizing(url);
  });

  const getIframeDOM = () => {
    return iframeRef.current?.children[0] as HTMLIFrameElement;
  };

  const enableIframeMessageListener = () => {
    window.addEventListener("message", handleIframeMessages);
    setListeningToMessages(true);
  };

  const disableIframeMessageListener = () => {
    window.removeEventListener("message", handleIframeMessages);
    setListeningToMessages(false);
  };

  const handleScrollTo = (evt: MessageEvent) => {
    const iframe = getIframeDOM();
    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const top = evt.data.top + rect.top + scrollTop;
      window.scroll({ top });
    }
  };

  const handleResize = (evt: MessageEvent) => {
    if (!evt.data.height) {
      return;
    }
    const iframe = getIframeDOM();
    if (iframe) {
      const newHeight = parseInt(evt.data.height, 10);
      iframe.style.height = `${newHeight}px`;
    }
  };

  const handleIframeMessages = (event: MessageEvent) => {
    const iframe = getIframeDOM();
    /* Needed to enforce content to stay within iframe on Safari iOS */
    if (iframe) {
      iframe.setAttribute("scrolling", "no");
    }

    if (!listeningToMessages || !event || !event.data) {
      return;
    }

    switch (event.data.event) {
      case "resize":
        handleResize(event);
        break;
      case "scrollTo":
        handleScrollTo(event);
        break;
      default:
        break;
    }
  };

  return (
    <IframeWrapper ref={iframeRef} title={title}>
      {parse(html)}
    </IframeWrapper>
  );
};
