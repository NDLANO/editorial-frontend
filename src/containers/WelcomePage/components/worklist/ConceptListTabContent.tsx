/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniqBy from "lodash/uniqBy";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "@ndla/icons/editor";
import Pager from "@ndla/pager";
import { Select, SingleValue } from "@ndla/select";
import { IConceptSearchResult, IConceptSummary, IStatus } from "@ndla/types-backend/concept-api";
import PageSizeDropdown from "./PageSizeDropdown";
import StatusCell from "./StatusCell";
import { SortOption } from "./WorkList";
import { searchNodes } from "../../../../modules/nodes/nodeApi";
import formatDate from "../../../../util/formatDate";
import { toEditConcept, toEditGloss } from "../../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { DropdownWrapper, StyledLink, StyledTopRowDashboardInfo, TopRowControls } from "../../styles";
import GoToSearch from "../GoToSearch";
import TableComponent, { FieldElement, Prefix, TitleElement } from "../TableComponent";
import TableTitle from "../TableTitle";

interface Props {
  data: IConceptSearchResult | undefined;
  filterSubject: SingleValue | undefined;
  isLoading: boolean;
  setSortOption: (o: Prefix<"-", SortOption>) => void;
  sortOption: string;
  error: string | undefined;
  setFilterSubject: (fs: SingleValue) => void;
  ndlaId: string | undefined;
  setPageConcept: (page: number) => void;
  pageSizeConcept: SingleValue;
  setPageSizeConcept: (p: SingleValue) => void;
}

interface Concept {
  id: number;
  title: string;
  status: IStatus;
  lastUpdated: string;
  type: string;
  subjects: { value: string; label: string }[];
}

const fetchConceptData = async (concept: IConceptSummary, taxonomyVersion: string, language: string) => {
  const subjects = concept.subjectIds
    ? await searchNodes({
        ids: concept.subjectIds,
        taxonomyVersion,
        nodeType: "SUBJECT",
        language,
      })
    : undefined;

  return {
    id: concept.id,
    title: concept.title?.title,
    status: concept.status,
    type: concept.conceptType,
    lastUpdated: concept.responsible ? formatDate(concept.responsible.lastUpdated) : "",
    subjects:
      subjects?.results.map((subject) => ({
        value: subject.id,
        label: subject.name,
      })) ?? [],
  };
};

const ConceptListTabContent = ({
  data,
  filterSubject,
  isLoading,
  setSortOption,
  sortOption,
  error,
  setFilterSubject,
  ndlaId,
  setPageConcept,
  pageSizeConcept,
  setPageSizeConcept,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const [conceptData, setConceptData] = useState<Concept[]>([]);

  useEffect(() => {
    (async () => {
      if (!data?.results) return;
      const _data = await Promise.all(data.results.map((c) => fetchConceptData(c, taxonomyVersion, i18n.language)));
      setConceptData(_data);
    })();
  }, [data?.results, i18n.language, taxonomyVersion]);

  const tableData: FieldElement[][] = useMemo(
    () =>
      conceptData.map((res) => [
        {
          id: `title_${res.id}`,
          data: (
            <StyledLink to={res.type === "concept" ? toEditConcept(res.id) : toEditGloss(res.id)} title={res.title}>
              {res.title}
            </StyledLink>
          ),
          title: res.title,
        },
        {
          id: `status_${res.id}`,
          data: <StatusCell status={res.status} />,
          title: t(`form.status.${res.status.current.toLowerCase()}`),
        },
        {
          id: `type_${res.id}`,
          data: t(`searchForm.conceptType.${res.type}`),
        },
        {
          id: `concept_subject_${res.id}`,
          data: res.subjects.map((s) => s.label).join(" - "),
        },
        {
          id: `date_${res.id}`,
          data: res.lastUpdated,
        },
      ]),
    [conceptData, t],
  );

  const subjectList = useMemo(
    () =>
      uniqBy(
        conceptData.flatMap((c) => c.subjects),
        (c) => c.value,
      ),
    [conceptData],
  );

  const tableTitles: TitleElement<SortOption>[] = [
    {
      title: t("welcomePage.workList.title"),
      sortableField: "title",
      width: "25%",
    },
    {
      title: t("welcomePage.workList.status"),
      sortableField: "status",
      width: "20%",
    },
    { title: t("welcomePage.workList.contentType"), width: "20%" },
    { title: t("welcomePage.workList.conceptSubject"), width: "20%" },
    {
      title: t("welcomePage.workList.date"),
      sortableField: "responsibleLastUpdated",
      width: "15%",
    },
  ];

  const lastPage = data?.totalCount ? Math.ceil(data?.totalCount / (data.pageSize ?? 1)) : 1;

  return (
    <>
      <StyledTopRowDashboardInfo>
        <TableTitle
          title={t("welcomePage.workList.heading")}
          description={t("welcomePage.workList.conceptDescription")}
          Icon={Calendar}
        />
        <TopRowControls>
          <DropdownWrapper>
            <PageSizeDropdown pageSize={pageSizeConcept} setPageSize={setPageSizeConcept} />
          </DropdownWrapper>
          <DropdownWrapper>
            <Select<false>
              label={t("welcomePage.chooseSubject")}
              options={subjectList}
              placeholder={t("welcomePage.chooseSubject")}
              value={filterSubject}
              onChange={setFilterSubject}
              menuPlacement="bottom"
              small
              outline
              isLoading={isLoading}
              isSearchable
              noOptionsMessage={() => t("form.responsible.noResults")}
              isClearable
            />
          </DropdownWrapper>
          <GoToSearch ndlaId={ndlaId} filterSubject={filterSubject?.value} searchEnv={"concept"} />
        </TopRowControls>
      </StyledTopRowDashboardInfo>
      <TableComponent
        isLoading={isLoading}
        tableTitleList={tableTitles}
        tableData={tableData}
        setSortOption={setSortOption}
        sortOption={sortOption}
        error={error}
        noResultsText={t("welcomePage.emptyConcepts")}
        minWidth="630px"
      />
      <Pager
        page={data?.page ?? 1}
        lastPage={lastPage}
        query={{}}
        onClick={(el) => setPageConcept(el.page)}
        small
        colorTheme="lighter"
        pageItemComponentClass="button"
      />
    </>
  );
};

export default ConceptListTabContent;
