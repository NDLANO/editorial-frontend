/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import 'monaco-editor/esm/vs/editor/contrib/links/links.js';
import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand.js';

// import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js';
// import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js';
// import 'monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js';
// import 'monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector.js';
// import 'monaco-editor/esm/vs/editor/contrib/comment/comment.js';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js';
// import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js';
// import 'monaco-editor/esm/vs/editor/contrib/dnd/dnd.js';
// import 'monaco-editor/esm/vs/editor/contrib/folding/folding.js';
// import 'monaco-editor/esm/vs/editor/contrib/format/formatActions.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js';
// import 'monaco-editor/esm/vs/editor/contrib/hover/hover.js';
// import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js';
// import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js';
// import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js';
// import 'monaco-editor/esm/vs/editor/contrib/referenceSearch/referenceSearch.js';
// import 'monaco-editor/esm/vs/editor/contrib/rename/rename.js';
// import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js';
// import 'monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js';
// import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/gotoLine.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

// import * as monaco from 'monaco-editor';

import React, { Component } from 'react';
import { css } from 'emotion';
import { spacing } from '@ndla/core';
import './html.contribution.js';

const content =
  '<section><embed data-account="4806596774001" data-caption="" data-player="BkLm8fT" data-resource="brightcove" data-videoid="ref:66179"><h2>Bildeutsnitt</h2><p>En film består av en serie av enkeltbilder som er komponert på ulike måter.</p><ul><li>Et heltotalbilde gir oversikt over omgivelsene og situasjonen, og brukes derfor ofte til å etablere en scene.</li><li>Karakterene i filmen presenteres gjerne i totalbilder. Et slikt bildeutsnitt gir også god oversikt over det sceniske rommet, stedet der hendingene foregår.</li><li>Når to eller flere personer snakker sammen, skifter kameraet ofte til et halvnært bilde. Da er det enklere å følge dialogen. </li><li>Nærbilder av et ansikt eller en hånd avslører følelser, og brukes ofte til å vise hvordan en person reagerer på det som skjer.</li><li>Ultranære bilder bryter med det øyet vårt vanligvis ser. Slike bilder brukes derfor kun som effekter.</li></ul><embed data-align="" data-alt="dialog i filmen Amour" data-caption="En scene fra filmen Amour som fikk Oscar som beste utenlandske film i 2013. Bildeutsnittet viser hva personene tenker og føler." data-resource="image" data-resource_id="480" data-size="full" data-url="https://test.api.ndla.no/image-api/v2/images/480"><p>I alle filmer klippes det mellom ulike bildeutsnitt. Men filmsjangeren avgjør hvilke typer utsnitt som brukes mest. I en actionfilm er det mer naturlig å bruke oversiktsbilder enn i en kjærlighetsfilm med mye snørr og tårer. </p><embed data-align="" data-alt="en munn som skriker" data-caption="Ultranært utsnitt i filmen Psycho understreker hvor skrekkslagen personen blir." data-resource="image" data-resource_id="479" data-size="full" data-url="https://test.api.ndla.no/image-api/v2/images/479"><h2>Bildevinkler</h2><p>Normalt ser vi det som skjer i øyehøyde. Det kalles <em>normalperspektiv.</em> Når filmkameraet plasseres over eller under normal øyehøyde, får det en bestemt virkning. I dagligtalen kaller vi dette ”å se opp til en person” eller ”å se ned på en person”.</p><p>Når kamera er plassert under normalhøyde, kalles det <em>froskeperspektiv</em>. Et slikt perspektiv kan brukes til å opphøye en helt, men også til å vise hvordan verden ser ut, sett med øynene til et lite barn.</p><embed data-align="" data-alt="Kay Walsh i filmen Stage Fright" data-caption="Froskeperspektivet i skrekkfilmen Stage Fright gir oss en følelse av at et ondt øye iakttar personene." data-resource="image" data-resource_id="478" data-size="full" data-url="https://test.api.ndla.no/image-api/v2/images/478"><p>Når kameraet er plassert over normalhøyde, kalles det <em>fugleperspektiv</em>. Et slikt perspektiv kan gjøre selv det tøffeste monster ynkelig. Det kan også vise hvordan trollet opplever møtet med Askeladden. Filmen <em> </em><a href="http://youtu.be/d7-kqwiq-gY" rel="noopener noreferrer" target="_blank" title="Hawaii Oslo"><em>Hawaii Oslo</em></a><em>  </em>åpner med et ekstremt fugleperspektiv. Slik introduseres englesymbolikken som går som en rød tråd gjennom hele filmen.</p><h2>Komposisjon og fargebruk</h2><p>Horisontale linjer i et bilde gir en følelse av ro og harmoni, mens vertikale linjer gir et inntrykk av høyde, kraft og verdighet. Skrålinjer skaper spenning og bevegelse. Symmetrisk balanse i et bilde gir et inntrykk av stabilitet og stillstand, mens asymmetrisk balanse virker mer moderne og energisk.</p><p>Fargetonen i bildet formidler mye av stemningen i filmen. Varme toner gir en følelse av harmoni og kjærlighet, kalde toner har den motsatte virkningen. Farger kan også brukes symbolsk. Den kvinnelige forføreren har rød kjole, mens den uskyldige ungjenta ofte er kledd i hvitt.</p><embed data-align="" data-alt="Joseph Cotten i filmen &quot;Den tredje mann&quot;.Foto." data-caption="Farger, lys og skygge skaper en bestemt atmosfære i Film noir-filmen &quot;Den tredje mann&quot;." data-resource="image" data-resource_id="477" data-size="full" data-url="https://test.api.ndla.no/image-api/v2/images/477"><h2>Bevegelse</h2><p>Bevegelse i et bilde kan skje både ved at kameraet er i bevegelse, og ved at personer eller gjenstander i bildet beveger seg. Når vi skal følge en karakter fra bilde til bilde, er det viktig at øyet vårt oppfatter hvor i bildet personen befinner seg. Fartsretningen i bildet er derfor viktig for kontinuiteten i bildefortellingen.</p><p>Kameralinsen kan bevege seg horisontalt (<em>panorering)</em> eller vertikalt (<em>tilting</em>). En panorering kan gi en oversikt over en situasjon, eller følge en bevegelse horisontalt. En tilt kan for eksempel brukes til å vise høyde eller til å avsløre et fenomen. Et eksempel er åpningsscenen i filmen  <a href="http://youtu.be/pug-qezlh-Q" rel="noopener noreferrer" target="_blank" title="Änglagård">Änglagård</a> <em> </em>der kameraet starter ved føttene og følger kroppen i en dvelende bevegelse helt opp til ansiktet. Slik understrekes det sensuelle ved hovedpersonen.</p><p>Kamerakjøring eller kran brukes når kamera følger en hendelse i stor fart, som for eksempel forfølgelsesscenen i en James Bond-film. Zooming er ikke en kamerabevegelse, men brukes ofte som en effekt. Sjokkzooming i en skrekkfilm gir oss følelse av at vi selv blir trukket inn i fortellingen, uten å kunne verne oss mot det vonde. Slik identifiserer vi oss med det skrekkslagne offeret.</p></section><section><div data-type="related-content"><embed data-article-id="415" data-resource="related-content"><embed data-article-id="402" data-resource="related-content"><embed data-article-id="589" data-resource="related-content"><embed data-article-id="406" data-resource="related-content"></div></section>';

window.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === 'html') {
      return '/static/js/html.worker.js';
    }
    return '/static/js/html.worker.js';
  },
};

monaco.editor.defineTheme('myCustomTheme', {
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'tag', foreground: 'CC342B' },
    { token: 'attribute.name', foreground: '3971ED' },
    { token: 'attribute.value', foreground: '178844' },
  ],
});

class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  async componentDidMount() {
    const data = await fetch(`/prettify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    const { prettified } = await data.json();

    this.editor = monaco.editor.create(this.container.current, {
      value: prettified,
      scrollBeyondLastLine: false,
      theme: 'myCustomTheme',
      wordWrap: 'on',
      miniMap: false,
      language: 'html',
    });
  }
  render() {
    return (
      <div
        css={css`
          width: 100%;
          height: 700px;
          margin-top: ${spacing.large};
        `}
        ref={this.container}
      />
    );
  }
}

export default MonacoEditor;
