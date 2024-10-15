/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps } from "formik";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { BlogPost, CheckLine } from "@ndla/icons/editor";
import {
  Button,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  FieldErrorMessage,
  FieldHelper,
  FieldRoot,
  Input,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { TagSelectorLabel, TagSelectorRoot, useTagSelectorTranslations } from "@ndla/ui";
import { MetaImageSearch } from ".";
import { SearchTagsContent } from "../../components/Form/SearchTagsContent";
import { SearchTagsTagSelectorInput } from "../../components/Form/SearchTagsTagSelectorInput";
import { FormField } from "../../components/FormField";
import FormikField from "../../components/FormikField";
import { FormContent } from "../../components/FormikForm";
import PlainTextEditor from "../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { DRAFT_ADMIN_SCOPE } from "../../constants";
import { useDraftSearchTags } from "../../modules/draft/draftQueries";
import useDebounce from "../../util/useDebounce";
import { useSession } from "../Session/SessionProvider";

interface Props {
  articleLanguage: string;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
}

const availabilityValues: string[] = ["everyone", "teacher"];

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const MetaDataField = ({ articleLanguage, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { userPermissions } = useSession();
  const tagSelectorTranslations = useTagSelectorTranslations();
  const plugins = [textTransformPlugin];
  const [inputQuery, setInputQuery] = useState<string>("");
  const debouncedQuery = useDebounce(inputQuery, 300);
  const searchTagsQuery = useDraftSearchTags(
    {
      input: debouncedQuery,
      language: articleLanguage,
    },
    {
      enabled: !!debouncedQuery.length,
      placeholderData: (prev) => prev,
    },
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: searchTagsQuery.data?.results ?? [],
      itemToValue: (item) => item,
      itemToString: (item) => item,
    });
  }, [searchTagsQuery.data?.results]);

  const fetchMetaDescription = async (inputQuery: string) => {
    const response = await fetch("/invoke-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Generate a meta description for the following text: " + inputQuery,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate meta description");
    }

    const responseBody = await response.json();
    return responseBody.content[0].text;
  };

  const generateMetaDescription = async (helpers: FieldHelperProps<string>) => {
    const inputQuery =
      "Returner en metabeskrivelse av følgende utdanningstekst: Hvorfor kostråd? Et usunt kosthold gir økt risiko for sykdom og for tidlig død. Men hva bør vi spise for å ha ei god helse og et godt liv? Det finnes mange ulike råd og anbefalinger der ute, og det kan være vanskelig å vite hva som er sant, og hva som ikke er det. Helsemyndighetene har derfor gitt oss sju konkrete råd som har til hensikt å fremme folkehelsa og forebygge utviklinga av kroniske sykdommer. Kostrådene bygger på oppsummering av kvalifisert og systematisk forskning innen ernæring og helse. Hvem passer kostrådene for? Kostrådene er gitt til den generelle befolkningen og gjelder for alle voksne og barn over to år. Ved spesielle tilstander (sykdommer) kan det være behov for tilpasset kost. For gravide, ammende og veganere finnes det supplerende råd. Kostrådene skal også være veiledende for den maten som tilbys i ulike institusjoner som skoler, barnehager, forsvaret, sykehus, omsorgsboliger og liknende. De sju kostrådene 1. Ha et variert kosthold, velg mest mat fra planteriket og spis med glede Logo med grønn sirkel med hvitt nøkkelhull. Illustrasjon. Nøkkelhullet. Bilde: Helsedirektoratet / Begrenset bruksrett. Et råvarebasert kosthold og lage mat fra bunnen av kan gjøre det enklere å følge kostrådene. Se etter nøkkelhullsmerkede produkter. Bruk gjerne tallerkenmodellen til alle måltider. Velg matoljer, flytende margarin og myk margarin framfor hard margarin og smør. Det er anbefalt å spise en håndfull usaltede nøtter hver dag (cirka 20–30 gram). Ta deg tid til å spise maten og spis den med glede, gjerne sammen med andre i et fellesskap. 2. Frukt, bær eller grønnsaker bør være en del av alle måltider. Det er anbefalt å spise minst fem og helst åtte porsjoner hver dag. En porsjon tilsvarer 100 gram og kan for eksempel være en liten bolle med salat, en gulrot eller en middels stor frukt (for et barn under ti år vil barnets håndfull utgjøre en porsjon). Du kan bruke friske, hermetiske, frosne og varmebehandlede grønnsaker, frukt og bær. Mulighetene er mange. Halvparten bør være grønnsaker og halvparten frukt og bær. Inntil et halvt glass jus (1 dl) kan inngå som én porsjon dersom jusen er laget av 100 prosent frukt, bær eller grønnsaker. Jus hos barn bør begrenses. Varier mellom ulike typer grønnsaker og frukt. Velg frukt og grønt ut fra regnbuens farger! Da får du i deg mange forskjellige næringsstoffer. Begrens inntaket av produkter av frukt og grønt som er tilsatt sukker, som syltetøy og saft. 3. La grovt brød eller andre fullkornprodukter være en del av flere måltider hver dag. Logo for merkeordningen Brødskalaen. Sirkel delt i fire, alle fire delene er fylt, og i tekst rundt sirkelen står det Grovhet 76–100 %. Illustrasjon. Brødskalaen viser hvor grovt brødet er. Bilde: Baker og Konditorbransjens Landsforening  / Begrenset bruksrett. Velg kornprodukter med høyt innhold av fiber og fullkorn og lavt innhold av fett, sukker og salt. De grove kornproduktene bør til sammen gi minst 90 gram sammalt mel eller fullkorn per dag. Velg gjerne brød som er merket grovt (3/4) eller ekstra grovt (4/4) på Brødskalaen. Eksempel på hvordan du kan få i deg anbefalt mengde fullkornprodukter: 4. Velg oftere fisk og sjømat, bønner og linser enn rødt kjøtt. Spis minst mulig bearbeidet kjøtt. Beklager, en feil oppstod ved lasting av bilde. Prøv å laste inn siden på nytt. Spis fisk til middag to til tre ganger i uka. Bruk også gjerne fisk som pålegg. Anbefalt inntak av fisk er 300–450 gram hver uke. Minst 200 gram bør være fet fisk som laks, ørret, makrell og sild. Seks påleggsporsjoner med fisk tilsvarer omtrent én middagsporsjon. Velg gjerne belgfrukter som bønner, linser og erter til middag minst én gang i uka og som tilbehør eller pålegg. Belgfrukter kan gjerne erstatte kjøtt helt eller delvis i for eksempel gryter, supper, lasagne, taco og så videre. Rødt kjøtt bør begrenses til 350 gram per uke. Velg gjerne hvitt kjøtt framfor rødt kjøtt. Velg magre kjøttprodukter med lite salt, og begrens inntaket av bearbeidede kjøttprodukter av både rødt og hvitt kjøtt. Egg kan inngå i et sunt og variert kosthold. 5. Ha et daglig inntak av melk og meieriprodukter. Velg produkter med mindre fett Det er anbefalt å spise eller drikke tre porsjoner melk eller meieriprodukter hver dag. Tre porsjoner tilsvarer omtrent 5 dl melk eller meieriprodukter. Velg meieriprodukter med lite fett og salt og lite tilsatt sukker. En porsjon meieriprodukter kan være: 6. Godteri, snacks og søte bakevarer bør begrenses. Brus, saft og godteri er de største kildene til tilsatt sukker i kosten. De tilfører mye sukker og energi, men lite vitaminer og mineraler. I et variert og sunt kosthold er det plass til disse matvarene av og til, og i små mengder. Unngå mat og drikke med mye sukker til hverdags. Barn under tre år bør ikke ha produkter med søtstoff. 7. Drikk vann! Beklager, en feil oppstod ved lasting av bilde. Prøv å laste inn siden på nytt. Velg vann som tørstedrikk, ved måltider og ved fysisk aktivitet. Vann er nødvendig for å opprettholde normale kroppsfunksjoner. Vanlig vann dekker væskebehovet uten å bidra med unødvendige kalorier og er derfor den aller beste drikken når du er tørst. Drikke med sukker bør begrenses. Energidrikker bør ikke inntas av barn og unge og bør begrenses av voksne. Inntaket av alkohol bør være så lavt som mulig. 1–4 kopper filtrert kaffe kan være en del av et sunt kosthold for voksne. Man kan også gjerne følge kostrådene hvis man har økt sykdomsrisiko som høyt blodtrykk og hjerte- og karsykdommer. Ved spesielle tilstander (sykdommer) kan det være behov for tilpasset kost.";
    setIsLoading(true);
    try {
      const generatedText = await fetchMetaDescription(inputQuery);
      await helpers.setValue(generatedText);
    } catch (error) {
      console.error("Error generating meta description", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContent>
      <FormField name="tags">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <TagSelectorRoot
              collection={collection}
              value={field.value}
              onValueChange={(details) => helpers.setValue(details.value)}
              translations={tagSelectorTranslations}
              inputValue={inputQuery}
              onInputValueChange={(details) => setInputQuery(details.inputValue)}
            >
              <TagSelectorLabel>{t("form.tags.label")}</TagSelectorLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldHelper>{t("form.tags.description")}</FieldHelper>
              <SearchTagsTagSelectorInput asChild>
                <Input placeholder={t("form.tags.searchPlaceholder")} />
              </SearchTagsTagSelectorInput>
              <SearchTagsContent isFetching={searchTagsQuery.isFetching} hits={collection.items.length}>
                {collection.items.map((item) => (
                  <ComboboxItem key={item} item={item}>
                    <ComboboxItemText>{item}</ComboboxItemText>
                    <ComboboxItemIndicator asChild>
                      <CheckLine />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                ))}
              </SearchTagsContent>
            </TagSelectorRoot>
          </FieldRoot>
        )}
      </FormField>
      {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormField name="availability">
          {({ field, helpers }) => (
            <FieldRoot>
              <RadioGroupRoot
                orientation="horizontal"
                value={field.value}
                onValueChange={(details) => helpers.setValue(details.value)}
              >
                <RadioGroupLabel>{t("form.availability.description")}</RadioGroupLabel>
                {availabilityValues.map((value) => (
                  <RadioGroupItem key={value} value={value}>
                    <RadioGroupItemControl />
                    <RadioGroupItemText>{t(`form.availability.${value}`)}</RadioGroupItemText>
                    <RadioGroupItemHiddenInput />
                  </RadioGroupItem>
                ))}
              </RadioGroupRoot>
            </FieldRoot>
          )}
        </FormField>
      )}
      <FormikField
        name="metaDescription"
        maxLength={155}
        showMaxLength
        label={t("form.metaDescription.label")}
        description={t("form.metaDescription.description")}
      >
        {({ field, helpers }) => (
          <>
            <PlainTextEditor
              id={field.name}
              placeholder={t("form.metaDescription.label")}
              {...field}
              plugins={plugins}
            />
            <StyledButton size="small" onClick={() => generateMetaDescription(helpers)}>
              {t("editorSummary.generate")} {isLoading ? <Spinner size="small" /> : <BlogPost />}
            </StyledButton>
          </>
        )}
      </FormikField>
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <MetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton={false}
            showCheckbox={showCheckbox}
            checkboxAction={checkboxAction}
            language={articleLanguage}
            {...field}
          />
        )}
      </FormikField>
    </FormContent>
  );
};

export default memo(MetaDataField);
