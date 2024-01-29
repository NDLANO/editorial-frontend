/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { HelmetWithTracker } from "@ndla/tracker";
import H5PElement from "../../components/H5PElement/H5PElement";

const H5PWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const H5PPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  return (
    <H5PWrapper>
      <HelmetWithTracker title={t("htmlTitles.h5pPage")} />
      <H5PElement
        canReturnResources={false}
        onSelect={() => {}}
        onClose={() => {
          navigate("/");
        }}
        locale={locale}
      />
    </H5PWrapper>
  );
};

export default H5PPage;
