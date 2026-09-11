# Trusted sources — `data/news.json` legal/enforcement pipeline

This is the source list referenced in `CLAUDE.md`'s open items ("exact
list of source sites for the nightly news search — currently left to
the model's judgement"). It's a starting point for tightening
`scripts/pipeline/news-config.ts`'s search prompt if the nightly job
surfaces too much noise or misses known sources — not a hard allowlist
enforced in code today.

Reminder of scope (from `news-config.ts`): genuine **legal or
regulatory action** on digital accessibility — court judgments,
ombudsman rulings, enforcement notices/sanctions, and monitoring-body
findings under the Web Accessibility Directive (EU 2016/2102). Not
general accessibility news, blog posts, or product announcements.

## EU-level

- **European Commission — Shaping Europe's Digital Future**
  <https://digital-strategy.ec.europa.eu/en/policies/web-accessibility>
  — Web Accessibility Directive monitoring reports, policy updates.
- **EUR-Lex** <https://eur-lex.europa.eu/> — official text/amendments to
  Directive (EU) 2016/2102 and the European Accessibility Act
  (2019/882).
- **European Disability Forum (EDF)** <https://www.edf-feph.org/> —
  statements and reporting on specific enforcement actions and
  litigation across member states.
- **Court of Justice of the EU (CURIA)** <https://curia.europa.eu/> —
  any CJEU rulings touching accessibility directives.

## National monitoring/enforcement bodies

These are the bodies each EU member state designated to monitor and
enforce the Web Accessibility Directive. Prioritise these for
"monitoring body findings" and "enforcement notices."

| Country | Body | URL |
|---|---|---|
| Italy | AgID (Agenzia per l'Italia Digitale) | <https://www.agid.gov.it/> |
| Netherlands | ACM (Autoriteit Consument & Markt) | <https://www.acm.nl/> |
| Sweden | PTS (Post- och telestyrelsen) | <https://pts.se/> |
| Sweden | DIGG (Myndigheten för digital förvaltning) | <https://www.digg.se/> |
| Germany | Bundesfachstelle Barrierefreiheit | <https://www.bundesfachstelle-barrierefreiheit.de/> |
| France | DINUM / RGAA enforcement | <https://www.numerique.gouv.fr/publications/rgaa/> |
| Spain | CGPJ (Consejo General del Poder Judicial) — court decisions | <https://www.poderjudicial.es/> |
| Spain | Observatorio de Accesibilidad Web | <https://administracionelectronica.gob.es/pae_Home/pae_Estrategias/pae_Accesibilidad/pae_Observatorio_de_Accesibilidad.html> |
| Ireland | NDA (National Disability Authority) | <https://nda.ie/> |
| Finland | AVI / Regional State Administrative Agencies (accessibility) | <https://www.saavutettavuusvaatimukset.fi/> |
| Belgium | BOSA / accessibility monitoring | <https://www.bosa.belgium.be/> |
| Austria | Sozialministeriumservice | <https://broneu.sozialministerium.at/> |
| Denmark | Digitaliseringsstyrelsen | <https://digst.dk/> |
| Poland | Ministerstwo Cyfryzacji (accessibility) | <https://www.gov.pl/web/dostepnosc-cyfrowa> |
| Portugal | AMA (Agência para a Modernização Administrativa) | <https://amagov.pt/> |
| Norway (EEA, not EU) | Uutilsynet (Norwegian Digitalisation Agency) | <https://uu.difi.no/> |

This list isn't exhaustive — every EU member state has a designated
monitoring body under Article 7 of 2016/2102; add others here as their
findings show up in real entries (follow the pattern already used in
`data/news.json`, e.g. Italy/AgID, Netherlands/ACM, Sweden/PTS,
Sweden/DIGG).

## Courts and litigation trackers

- **Droit Pluriel** <https://droitpluriel.fr/> — French digital
  accessibility litigation (with apiDV), publishes full rulings.
- **apiDV** <https://www.apidv.org/> — French disability advocacy org,
  co-litigant in several web accessibility cases.
- National court/judicial portals as needed per case (e.g. Spain's
  CGPJ above) — cite the court decision itself when available rather
  than secondary reporting.

## Secondary/aggregator sources (use to find leads, not as the citable source)

- **Digital Strategy EU news feed** — for EU-level policy summaries.
- National disability-rights NGOs (e.g. EDF member organisations) that
  report on enforcement actions their national body or courts took —
  treat their write-up as a lead but link to the primary source
  (court/regulator) as `sourceUrl` when possible.

## How to use this file

If the nightly pipeline drifts (misses known enforcement actions, or
surfaces off-topic "news"), tighten `userPrompt` in
`scripts/pipeline/news-config.ts` to explicitly prioritise or restrict
to domains from this list, then re-run `npm run update:news` locally
to sanity-check before merging.
