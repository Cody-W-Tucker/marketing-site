# V1 Plan — Core Offer Landing Page Archetype

> Status: implementable. All V1 decisions are closed (see §10). No owner confirmation required to begin.

---

## 1. Objective, Non-Goals, Operator Experience

**Objective.** Introduce a *constrained, archetype-driven* landing page for the **Core Offer** that compiles deterministically from the existing `campaign → offer` graph. Copywriters edit marketing schemas (offer, bonus, guarantee, urgency, scarcity, pricing, fulfillment, testimonial, faq); the landing page is render-ready output, not a layout canvas.

**Non-goals (V1).**
- Do NOT replace `page.blocks[]` or the generic block dispatcher.
- Do NOT migrate existing `CampaignLandingPage` rendering in place — it stays as fallback during cutover.
- Do NOT introduce a new generic "section" object that can reference arbitrary documents.
- Do NOT build a multi-archetype system. V1 = one archetype: **Core Offer Landing Page**.
- Do NOT restructure the offer graph (fulfillment, bonus, pricing, guarantees, urgency, scarcity, attraction/upsell/continuity/downsell). It stays as-is.

**Operator / editor experience (target state).**
- A `campaign` document gains a new field group **"Landing Page"** containing:
  - `archetype` (enum, V1 = `coreOfferLanding` only).
  - `primaryOffer` (single reference to one of the campaign's offers — the core offer being sold on this page).
  - `positioning` (object: `headline`, `subhead`, `proofStatement`, `primaryCta`).
  - `sections` (fixed-order, toggle-per-section configuration — not a free array). Each section is either off, or on with optional overrides (e.g. testimonials requires explicit selection and a reference set).
- Copywriter opens a campaign, picks the primary offer, fills the positioning block, toggles sections on/off, and publishes. The rendered page is a deterministic function of those inputs.
- The generic `page` document continues to drive About/Privacy/etc. via `blocks[]`.

---

## 2. Current-State Architecture (exact paths)

**Generic page path (kept as-is):**
- Schema: `studio/schemas/documents/page.ts` — `blocks[]` array with 13 inline types (`hero-1`, `hero-2`, `section-header`, `split-row`, `grid-row`, `carousel-1`, `carousel-2`, `timeline-row`, `cta-1`, `logo-cloud-1`, `faqs`, `form-newsletter`, `all-posts`).
- Frontend query: `frontend/sanity/queries/page.ts`.
- Frontend dispatcher: `frontend/components/blocks/` (index + per-block renderers).
- Route: `frontend/app/(main)/[slug]/page.tsx` (generic page route).

**Marketing path (current, monolithic):**
- Schema: `studio/schemas/documents/campaign.ts` — `campaignDetails{}` + `offers[]` (references to `offer`).
- Offer graph: `offer.ts`, `bonus-offer.ts`, `fulfillment.ts`, `pricing.ts`, `guarantees.ts`, `urgency.ts`, `scarcity.ts`, `attraction-offer.ts`, `upsell-offer.ts`, `continuity-offer.ts`, `downsell-offer.ts`.
- Aligned reference patterns already in the repo: `faqs.ts` references `faq` docs; `carousel-2` (studio block) references `testimonial` docs.
- Frontend query: `frontend/sanity/queries/campaign.ts` — `CAMPAIGN_LANDING_PAGE_QUERY` and `CAMPAIGN_SLUGS_QUERY`.
- Frontend renderer: `frontend/components/campaign-landing-page.tsx` — monolithic, renders the whole offer graph in one pass.
- Route: `frontend/app/(main)/campaigns/[slug]/page.tsx`.

**Known anomalies to address (queued in §7 phase 0 — deprecation only in V1, not removal):**
- `studio/schemas/blocks/section-header.ts` (1.5K) — contains a link query that is not consumed by any renderer (phantom).
- `studio/schemas/blocks/carousel/carousel-1.ts` — orientation field queried but unused.
- `studio/schemas/blocks/forms/newsletter.ts` — `stackAlign` field unused.
- `studio/schemas/documents/funnel.ts` — orphaned; not referenced by any query or renderer.

---

## 3. V1 Target Architecture & Data Ownership Rules

**Data ownership (rules, V1).**
| Data | Lives on | Rationale |
|---|---|---|
| Magic Name (magnetic reason, avatar, goal, interval, container) | `campaign.campaignDetails` | Unchanged. |
| Core offer mechanics (value equation, fulfillment, bonuses, pricing, guarantees, urgency, scarcity, role offers) | `offer` + referenced docs | Unchanged; these are the commercial source of truth. |
| Page-level framing (headline, subhead, proof statement, primary CTA) | `campaign.landingPage.positioning` | New. Campaign-level because framing varies per campaign even when the same offer is reused. |
| Section on/off + explicit selections (testimonials set, FAQ set) | `campaign.landingPage.sections` | New. Archetype configuration, not free layout. |
| Testimonials and FAQs content | `testimonial` and `faq` documents, referenced from section config | Reuses existing aligned pattern (`faqs` → `faq`; `carousel-2` → `testimonial`). |
| Generic layout blocks (`hero-1`, `split-row`, etc.) | `page.blocks[]` only | Marketing archetype does NOT use these. |

**Archetype rule.** A campaign with `landingPage.archetype` set **and** a valid `landingPage.sections` object renders through the archetype compiler. A campaign without it — or with malformed/legacy raw data where `sections` is missing — falls through to legacy `CampaignLandingPage` rendering. This is the migration seam.

**Determinism rule.** Given the same `(primaryOffer, positioning, sections)` inputs, the archetype always produces the same section sequence and the same DOM skeleton. No free ordering.

---

## 4. Exact Schema Changes

All changes are in `studio/schemas/documents/campaign.ts`. No new document types. No changes to `offer.ts` or any referenced schema in V1.

### 4.1 New field group: `landingPage`

Add to `groups`:
```ts
{ name: "landingPage", title: "Landing Page" }
```

### 4.2 New top-level field: `landingPage` (object)

```ts
defineField({
  name: "landingPage",
  title: "Landing Page",
  type: "landingPageConfig",   // new object type, see §4.3
  group: "landingPage",
  description:
    "Controls the constrained Core Offer Landing Page archetype. The page is compiled from the primary offer plus the positioning and section toggles here. This is not a free layout canvas.",
})
```

### 4.3 New object type: `studio/schemas/objects/landingPageConfig.ts`

```ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingPageConfig",
  title: "Landing Page Config",
  type: "object",
  fields: [
    defineField({
      name: "archetype",
      title: "Archetype",
      type: "string",
      options: { list: [{ title: "Core Offer Landing", value: "coreOfferLanding" }] },
      validation: (Rule) => Rule.required(),
      description: "V1 supports one archetype. Additional archetypes are a V2 concern.",
    }),
    defineField({
      name: "primaryOffer",
      title: "Primary Offer",
      type: "reference",
      to: [{ type: "offer" }],
      validation: (Rule) => Rule.required(),
      description:
        "The core offer this landing page sells. Must be one of the offers already added to this campaign.",
    }),
    defineField({
      name: "positioning",
      title: "Positioning",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: "headline", type: "string", validation: (Rule) => Rule.required().max(120) }),
        defineField({ name: "subhead", type: "string", validation: (Rule) => Rule.max(240) }),
        defineField({ name: "proofStatement", type: "string", validation: (Rule) => Rule.max(280),
          description: "One-line proof claim (social proof, result, or mechanism). Optional." }),
        defineField({
          name: "primaryCta",
          type: "ctaLink",
          validation: (Rule) => Rule.required(),
          description: "The single primary CTA used in hero and repeated at close.",
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "object",
      validation: (Rule) => Rule.required(),
      description:
        "Fixed-order sections. Toggle each on/off. Testimonials and FAQs require explicit selection; they are not auto-included. Required — a configured archetype cannot validly render without its section map; Studio will refuse to publish if this object is absent.",
      fields: [
        defineField({ name: "hero",              type: "landingSectionToggle", initialValue: { enabled: true } }),
        defineField({ name: "valueEquation",     type: "landingSectionToggle", initialValue: { enabled: true } }),
        defineField({ name: "fulfillment",       type: "landingSectionToggle", initialValue: { enabled: true } }),
        defineField({ name: "bonusStack",        type: "landingSectionToggle", initialValue: { enabled: true } }),
        defineField({ name: "pricing",           type: "landingSectionToggle", initialValue: { enabled: true } }),
        defineField({ name: "guarantees",        type: "landingSectionToggle", initialValue: { enabled: true } }),
        defineField({
          name: "testimonials",
          type: "landingTestimonialSection",
          initialValue: { enabled: false },
          description: "Enable and explicitly select testimonial documents to surface. When enabled, at least one testimonial is required (enforced by conditional validation).",
        }),
        defineField({
          name: "faqs",
          type: "landingFaqSection",
          initialValue: { enabled: false },
          description: "Enable and explicitly select FAQ documents to surface. When enabled, at least one FAQ is required (enforced by conditional validation).",
        }),
        defineField({ name: "urgencyClose",      type: "landingSectionToggle", initialValue: { enabled: true } }),
      ],
    }),
  ],
})
```

### 4.4 New object types: `landingSectionToggle`, `landingTestimonialSection`, `landingFaqSection`

```ts
// studio/schemas/objects/landingSectionToggle.ts
export default defineType({
  name: "landingSectionToggle",
  title: "Section Toggle",
  type: "object",
  fields: [
    defineField({ name: "enabled", type: "boolean", initialValue: false }),
  ],
  preview: { select: { enabled: "enabled" }, prepare: ({ enabled }) => ({ title: enabled ? "Enabled" : "Disabled" }) },
});

// studio/schemas/objects/landingTestimonialSection.ts
export default defineType({
  name: "landingTestimonialSection",
  title: "Testimonials Section",
  type: "object",
  fields: [
    defineField({ name: "enabled", type: "boolean", initialValue: false }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
      validation: (Rule) => Rule.custom((value, context) => {
        const { parent } = context;
        if (parent?.enabled && (!value || value.length === 0)) {
          return "At least one testimonial is required when this section is enabled.";
        }
        return true;
      }),
    }),
  ],
  preview: {
    select: { enabled: "enabled", count: "testimonials.length" },
    prepare: ({ enabled, count }) => ({
      title: enabled ? `Testimonials (${count ?? 0} selected)` : "Testimonials (disabled)",
    }),
  },
});

// studio/schemas/objects/landingFaqSection.ts
export default defineType({
  name: "landingFaqSection",
  title: "FAQs Section",
  type: "object",
  fields: [
    defineField({ name: "enabled", type: "boolean", initialValue: false }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
      validation: (Rule) => Rule.custom((value, context) => {
        const { parent } = context;
        if (parent?.enabled && (!value || value.length === 0)) {
          return "At least one FAQ is required when this section is enabled.";
        }
        return true;
      }),
    }),
  ],
  preview: {
    select: { enabled: "enabled", count: "faqs.length" },
    prepare: ({ enabled, count }) => ({
      title: enabled ? `FAQs (${count ?? 0} selected)` : "FAQs (disabled)",
    }),
  },
});
```

> **V1 decision.** Each selection-bearing section type exposes only its own reference array. `landingTestimonialSection` has `testimonials[]`; `landingFaqSection` has `faqs[]`. Editors cannot populate the wrong array because the wrong field does not exist on the type. Operator correctness outweighs two small schema files.

### 4.5 `ctaLink` object (new — do NOT reuse the existing `link`)

The existing `studio/schemas/blocks/shared/link.ts` (named `link`) is incompatible: it has `isExternal`, `internalLink`, `title`, `href`, `target`, `buttonVariant` — a generic link with conditional visibility and a button variant selector. The archetype CTA needs a simpler, required-field contract: `{ label, href, openInNewTab }`.

**Create `studio/schemas/objects/ctaLink.ts`:**

```ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "ctaLink",
  title: "CTA Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", href: "href" },
    prepare: ({ label, href }) => ({ title: label || "CTA", subtitle: href }),
  },
});
```

**Registration:** add to `studio/schema-types.ts` (the authoritative schema list — there is no `studio/schemas/objects/index.ts` barrel file). Import and append to the `schemaTypes` array in the shared-objects section.

### 4.6 Validation: `primaryOffer` must be in `campaign.offers[]`

Add a custom validation on `landingPage.primaryOffer` that checks the referenced offer is a member of the parent campaign's `offers[]` array. Implement via `Rule.custom((value, context) => …)` using **`context.document.offers`** (not `context.parent` — `context.parent` only reaches the enclosing `landingPage` object, which does not contain `offers`).

**Pseudo-code (tolerant of `_ref` shapes):**

```ts
validation: (Rule) => Rule.custom((value, context) => {
  if (!value?._ref) return true; // empty ref handled by required()
  const offers = context.document?.offers ?? [];
  const campaignOfferRefs = offers
    .map((o) => (typeof o === "string" ? o : o?._ref))
    .filter(Boolean);
  if (campaignOfferRefs.length === 0) {
    return "Campaign has no offers added yet. Add at least one offer to the campaign before selecting a primary offer.";
  }
  if (!campaignOfferRefs.includes(value._ref)) {
    return "Primary offer must be one of the offers already added to this campaign's offers list.";
  }
  return true;
}),
```

**Render-time enforcement (defense in depth).** Even with schema validation, the unified GROQ result must include campaign offer membership evidence (see §5.1). The route/component MUST verify at render time that the resolved `primaryOffer._id` is present in the campaign's offer set. If the primary offer is missing, unresolved (broken ref), or not a campaign member, the archetype path is abandoned and the legacy `CampaignLandingPage` renders instead — with a dev-mode console warning. This is not optional; it is the safety net for corrupted references or schema/validation gaps.

### 4.7 Register new schemas

Add the five new object types (`ctaLink`, `landingPageConfig`, `landingSectionToggle`, `landingTestimonialSection`, `landingFaqSection`) to `studio/schema-types.ts`. Import each from its file under `studio/schemas/objects/` and append to the `schemaTypes` array. This is the only registration point — there is no barrel `index.ts` for objects.

---

## 5. Frontend / Query / Typegen Changes

### 5.1 Query: extend `CAMPAIGN_LANDING_PAGE_QUERY` in `frontend/sanity/queries/campaign.ts`

**Unified query — do NOT add a parallel query.** Extend the existing `CAMPAIGN_LANDING_PAGE_QUERY` to also project `landingPage` (with archetype, primaryOffer→full offer graph, positioning, sections) and campaign offer membership evidence. The legacy renderer and the archetype renderer consume the **same query result**. This eliminates duplicate fetches, schema drift, and ambiguity about which query is authoritative.

**Add `bodyQuery` import.** The FAQ body projection must use the exact same interpolation pattern as `frontend/sanity/queries/faqs.ts`: import `bodyQuery` from `./shared/body` and interpolate it with `${bodyQuery}` inside the `body[]{ ... }` projection. Add this import to `frontend/sanity/queries/campaign.ts`:

```ts
import { bodyQuery } from "./shared/body";
```

This matches the existing pattern in `frontend/sanity/queries/faqs.ts` (line 2: `import { bodyQuery } from "./shared/body";`, line 15: `${bodyQuery}`). Do NOT invent an inline Portable Text projection or reference a different path.

**Add the following projections** to the existing `CAMPAIGN_LANDING_PAGE_QUERY` (append inside the top-level projection, after the existing legacy fields):

```ts
// Additions to CAMPAIGN_LANDING_PAGE_QUERY — append inside the existing [0]{ ... } projection:

// Campaign offer membership evidence (for render-time primaryOffer validation):
"offerIds": offers[]->_id,

// Archetype landing page configuration + resolved primary offer graph:
"landingPage": landingPage{
  archetype,
  primaryOffer->{
    _id, _type, name,
    valueEquation{ dreamOutcome, perceivedLikelihood, timeDelay, effortAndSacrifice },
    fulfillmentModel->{ title, deliveryFormat, scope, deliverables, timeline,
      cadenceOrSupportModel, clientResponsibilities, capacityLimit,
      handoffsOrDependencies, successCriteria, description },
    bonus[]->{ _id, name, summary, objectionSolved, promisedOutcome,
      deliverables, perceivedValue, exclusivityOrTrigger, coreOfferRelationship },
    featureList,
    priceModel->{ title, price, currency, billingModel, paymentTerms,
      valueAnchor, stackedValueEstimate, discountPolicy, description },
    guarantees[]->{ _id, title, guaranteeType, promise, conditions,
      buyerRequirements, remedy, claimWindowDays, exclusions, riskReversed, description },
    urgency[]->{ _id, title, urgencyType, isEvergreen, startsAt, endsAt,
      expiringElement, reasonWhyNow, displayCopy, description },
    scarcity[]->{ _id, title, scarcityType, quantityLimit, capacityBasis,
      replenishmentRule, waitlistBehavior, displayCopy, description }
  },
  positioning{ headline, subhead, proofStatement, primaryCta{ label, href, openInNewTab } },
  sections{
    hero{ enabled },
    valueEquation{ enabled },
    fulfillment{ enabled },
    bonusStack{ enabled },
    pricing{ enabled },
    guarantees{ enabled },
    testimonials{ enabled, "items": testimonials[]->{ _id, ... } },
    faqs{ enabled, "items": faqs[]->{ _id, title, body[]{ ${bodyQuery} } } },
    urgencyClose{ enabled }
  }
},
```

**Update the manual result type.** `CampaignLandingPageQueryResult` in `frontend/sanity/queries/campaign.ts` (lines 179–184) is a manually-defined type — not generated by typegen. Extend it to include the new `landingPage` and `offerIds` fields alongside the existing legacy fields (`_id`, `slug`, `campaignDetails`, `offers`). The wrapper `fetchCampaignLandingPage` in `frontend/sanity/lib/fetch.ts` returns `Promise<CampaignLandingPageQueryResult>`, so updating this manual type broadens the wrapper's return shape automatically — no changes to the wrapper's signature or body are needed.

**Key invariants:**
- All existing legacy fields remain untouched — the legacy `CampaignLandingPage` renderer continues to work from the same result.
- `offerIds` provides membership evidence so the route can verify `primaryOffer._id ∈ offerIds` without a second fetch.
- `primaryOffer` is fully dereferenced (`->`) so the archetype renderer has the complete offer graph.
- If `landingPage` is absent, `sections` is missing (malformed/legacy raw data), or `primaryOffer` is a broken ref (resolves to `null`), the query still succeeds — the route handles fallback.

### 5.2 Typegen and manual type update

Run `pnpm typegen` from repo root (delegates to `studio && pnpm typegen` → `sanity schema extract && sanity typegen generate`). This regenerates `frontend/sanity.types.ts` (the generated types file). However, `CampaignLandingPageQueryResult` in `frontend/sanity/queries/campaign.ts` is a manually-defined type (lines 179–184), not generated. Update it manually to include the new `landingPage` and `offerIds` fields alongside the existing legacy fields. The wrapper `fetchCampaignLandingPage` in `frontend/sanity/lib/fetch.ts` returns `Promise<CampaignLandingPageQueryResult>`, so updating this manual type broadens the wrapper's return shape automatically — no changes to the wrapper's signature or body are needed.

### 5.3 New renderer files

- `frontend/components/landing/core-offer-landing.tsx` — top-level archetype compiler. Reads `landingPage.sections`, emits sections in fixed order, passes typed props to semantic section components.
- `frontend/components/landing/sections/` — one file per semantic section:
  - `hero.tsx` — consumes `positioning` + offer name.
  - `value-equation.tsx` — consumes `offer.valueEquation`.
  - `fulfillment.tsx` — consumes `offer.fulfillmentModel`.
  - `bonus-stack.tsx` — consumes `offer.bonus[]`.
  - `pricing.tsx` — consumes `offer.priceModel` + `offer.featureList`.
  - `guarantees.tsx` — consumes `offer.guarantees[]`.
  - `testimonials.tsx` — consumes `sections.testimonials.items[]`.
  - `faqs.tsx` — consumes `sections.faqs.items[]`.
  - `urgency-close.tsx` — consumes `offer.urgency[]` + `offer.scarcity[]` + repeats `primaryCta`.
- Each section component is a **semantic consumer** of its slice. It may internally reuse visual primitives from `frontend/components/ui/` and existing block primitives (e.g. the existing `hero` primitives, `carousel` for testimonials) but does NOT reference generic block schemas.

### 5.4 Route integration

Edit the existing campaign route (`frontend/app/(main)/campaigns/[slug]/page.tsx`). The route already calls `fetchCampaignLandingPage({ slug: params.slug })` from `@/sanity/lib/fetch` — this is the single data-access wrapper and it stays that way. Do NOT import `CAMPAIGN_LANDING_PAGE_QUERY` or call `query()` / `sanityFetch()` directly from the route. The wrapper's return type (`CampaignLandingPageQueryResult`) is broadened by the manual type update in §5.1/§5.2, so the route receives the new `landingPage` and `offerIds` fields without any change to the wrapper call site.

Add a branch after the existing `fetchCampaignLandingPage` call that validates the archetype path and falls back to legacy when the archetype is absent, disabled, or invalid:

```ts
// frontend/app/(main)/campaigns/[slug]/page.tsx
// Existing imports retained; add CoreOfferLanding:
import CampaignLandingPage from "@/components/campaign-landing-page";
import CoreOfferLanding from "@/components/landing/core-offer-landing";
import {
  fetchCampaignLandingPage,
  fetchCampaignLandingPagesStaticParams,
} from "@/sanity/lib/fetch";
import { deriveCampaignTitle } from "@/sanity/queries/campaign";
import { notFound } from "next/navigation";

// generateStaticParams — unchanged.
// generateMetadata — unchanged.

export default async function CampaignPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const data = await fetchCampaignLandingPage({ slug: params.slug });

  if (!data) {
    notFound();
  }

  const lp = data.landingPage;
  const primaryOffer = lp?.primaryOffer;
  const offerIds = new Set(data.offerIds ?? []);

  // Archetype path: valid enabled landingPage with a resolved primary offer
  // that is a member of this campaign's offers, and a sections config present
  // (malformed/legacy raw data without sections falls back to legacy).
  const hasValidArchetype =
    lp?.archetype === "coreOfferLanding" &&
    primaryOffer?._id &&
    offerIds.has(primaryOffer._id) &&
    lp?.sections != null;

  if (hasValidArchetype) {
    return <CoreOfferLanding data={lp} campaign={data} />;
  }

  // Fallback: archetype absent, disabled, invalid, or primary offer
  // missing/unresolved/not a campaign member, or sections absent
  // (malformed/legacy raw data) → legacy renderer.
  if (lp?.archetype && process.env.NODE_ENV === "development") {
    console.warn(
      `[campaign:${params.slug}] archetype set but invalid — ` +
      `falling back to legacy. archetype=${lp.archetype}, ` +
      `primaryOffer._id=${primaryOffer?._id ?? "null"}, ` +
      `inCampaignOffers=${primaryOffer?._id ? offerIds.has(primaryOffer._id) : false}, ` +
      `sectionsPresent=${lp?.sections != null}`
    );
  }

  return <CampaignLandingPage campaign={data} />;
}
```

**Fallback conditions (any one triggers legacy):**
- `landingPage` is absent or `null`.
- `landingPage.archetype` is not `"coreOfferLanding"`.
- `landingPage.sections` is absent or `null` (malformed/legacy raw data without a section map — Studio now requires it, but pre-existing raw data may predate the constraint).
- `landingPage.primaryOffer` is unresolved (broken ref → `null`).
- `landingPage.primaryOffer._id` is not in `data.offerIds` (not a campaign member).

### 5.5 Dispatcher isolation

Do NOT add any of the new section components to `frontend/components/blocks/`. The archetype path and the generic-block path remain disjoint.

---

## 6. Source-Field → Semantic Section → UI Mapping

| Semantic Section | Source Fields | Renders | Missing / Fallback Behavior |
|---|---|---|---|
| **Hero** | `landingPage.positioning.headline`, `subhead`, `proofStatement`, `primaryCta`; `primaryOffer.name` | Headline, subhead, optional proof line, primary CTA button | If `headline` missing → render nothing, log warning. If `primaryCta` missing → section skipped (validation should prevent). If `subhead` missing → omit subhead line. If `proofStatement` missing → omit proof line. |
| **Value Equation** | `primaryOffer.valueEquation.{dreamOutcome, perceivedLikelihood, timeDelay, effortAndSacrifice}` | Four-quadrant value block | If entire `valueEquation` missing/empty → section hidden even if `enabled: true`. Per-field missing → that quadrant omitted; if fewer than 2 quadrants have content → section hidden. |
| **Fulfillment** | `primaryOffer.fulfillmentModel.{title, deliveryFormat, scope, deliverables, timeline, cadenceOrSupportModel, clientResponsibilities, capacityLimit, handoffsOrDependencies, successCriteria, description}` | "What's included" block | If `fulfillmentModel` missing → section hidden. Per-field missing → that row omitted. |
| **Bonus Stack** | `primaryOffer.bonus[]` | Stacked bonus cards (name, summary, perceivedValue, objectionSolved) | If `bonus` empty or missing → section hidden. Per-bonus missing `perceivedValue` → omit that line. |
| **Pricing** | `primaryOffer.priceModel.{title, price, currency, billingModel, paymentTerms, valueAnchor, stackedValueEstimate, discountPolicy, description}` + `featureList` | Price card with feature list, optional value stack, optional discount line | If `priceModel` missing → section hidden. Pricing is optional at schema level; some campaigns may omit pricing (e.g. "contact for pricing" pages). If `featureList` missing → omit feature list. |
| **Guarantees** | `primaryOffer.guarantees[]` | Guarantee cards (title, promise, claimWindowDays, remedy) | If `guarantees` empty → section hidden. |
| **Testimonials** | `landingPage.sections.testimonials.testimonials[]` (references to `testimonial` docs) | Carousel or grid of testimonials (reuse existing `carousel-2` visual primitive internally) | Disabled → renders nothing. Enabled with no resolved references → Studio blocks publish (conditional validation); at render time, section renders nothing defensively (does not abandon the archetype). |
| **FAQs** | `landingPage.sections.faqs.faqs[]` (references to `faq` docs) | Accordion (reuse existing `faqs.tsx` renderer logic) | Disabled → renders nothing. Enabled with no resolved references → Studio blocks publish (conditional validation); at render time, section renders nothing defensively (does not abandon the archetype). |
| **Urgency / Scarcity Close** | `primaryOffer.urgency[]`, `primaryOffer.scarcity[]`, `landingPage.positioning.primaryCta` (repeated) | Urgency/scarcity blocks + final CTA | If both `urgency` and `scarcity` empty → render CTA-only close. If `primaryCta` missing → section hidden. |

**Global rule.** A section whose `enabled: false` is never rendered, regardless of data. A section whose `enabled: true` but whose required data is absent is hidden silently at render time (no placeholder, no error state) — and a dev-mode console warning is emitted. For testimonials and FAQs specifically, Studio conditional validation additionally prevents the enabled-but-empty state at edit time (the section cannot be published with `enabled: true` and zero references); the render-time defense remains as a safety net for data that bypasses Studio validation.

**Archetype-level fallback.** If `primaryOffer` is missing, unresolved (broken ref), or not a member of `campaign.offers[]` (verified via `offerIds` from the unified query), **or if `landingPage.sections` is absent** (malformed/legacy raw data predating the required-field constraint), the archetype path is abandoned entirely and the legacy `CampaignLandingPage` renders instead. This check happens in the route before any section component mounts (see §5.4). Section-level fallback in the table above only applies when the archetype path is active.

---

## 7. Implementation Phases

### Phase 0 — Reconnaissance lock & anomaly queue (0.5 day)
- [tier:fast] [x] Schema registration file path confirmed: `studio/schema-types.ts` (authoritative list, no barrel `index.ts`).
- [tier:fast] [x] CTA object decision confirmed: existing `studio/schemas/blocks/shared/link.ts` (named `link`) is incompatible; new `ctaLink` will be created at `studio/schemas/objects/ctaLink.ts`.
- [tier:fast] [x] Campaign route file path confirmed: `frontend/app/(main)/campaigns/[slug]/page.tsx`.
- [tier:fast] [ ] Inspect `studio/schemas/blocks/section-header.ts` — confirm the link query is not consumed by any renderer.
- [tier:medium] [ ] Add a deprecation comment to `studio/schemas/blocks/section-header.ts` noting the link query is unconsumed by any renderer; file a follow-up issue for V2 removal.
  [acceptance]
  check: run command="rg -n 'DEPRECATED' studio/schemas/blocks/section-header.ts" expect="matches deprecation comment"
  criteria: Deprecation comment present in section-header.ts identifying the phantom link query; follow-up issue filed for V2 removal.
  deliverable: studio/schemas/blocks/section-header.ts (deprecation comment added)
  [/acceptance]
- [tier:fast] [ ] Inspect `studio/schemas/blocks/carousel/carousel-1.ts` — confirm the orientation field is queried but unused.
- [tier:medium] [ ] Add a deprecation comment to `studio/schemas/blocks/carousel/carousel-1.ts` noting the orientation field is queried but unused; file a follow-up issue for V2 removal.
  [acceptance]
  check: run command="rg -n 'DEPRECATED' studio/schemas/blocks/carousel/carousel-1.ts" expect="matches deprecation comment"
  criteria: Deprecation comment present on orientation field; follow-up issue filed for V2 removal.
  deliverable: studio/schemas/blocks/carousel/carousel-1.ts (deprecation comment added)
  [/acceptance]
- [tier:fast] [ ] Inspect `studio/schemas/blocks/forms/newsletter.ts` — confirm `stackAlign` is unused.
- [tier:medium] [ ] Add a deprecation comment to `studio/schemas/blocks/forms/newsletter.ts` noting `stackAlign` is unused; file a follow-up issue for V2 removal.
  [acceptance]
  check: run command="rg -n 'DEPRECATED' studio/schemas/blocks/forms/newsletter.ts" expect="matches deprecation comment"
  criteria: Deprecation comment present on stackAlign field; follow-up issue filed for V2 removal.
  deliverable: studio/schemas/blocks/forms/newsletter.ts (deprecation comment added)
  [/acceptance]
- [tier:fast] [ ] Inspect `studio/schemas/documents/funnel.ts` — confirm orphaned status (not referenced by any query or renderer) and document whether it is currently registered in `studio/schema-types.ts` or already unregistered.
- [tier:medium] [ ] Add a deprecation comment to `studio/schemas/documents/funnel.ts` noting its orphan status; file a follow-up issue for V2 disposition. Make no registration or removal change for `funnel` in V1 — leave its registration state as-is.
  [acceptance]
  check: run command="rg -n 'DEPRECATED' studio/schemas/documents/funnel.ts" expect="matches deprecation comment"
  criteria: Deprecation comment present in funnel.ts noting orphan status; follow-up issue filed for V2 disposition; registration state in schema-types.ts unchanged.
  deliverable: studio/schemas/documents/funnel.ts (deprecation comment added)
  [/acceptance]
- [tier:medium] [ ] Commit anomaly fixes as a standalone commit before archetype work begins.
  [acceptance]
  check: run command="git log --oneline -1" expect="commit message references anomaly deprecation"
  criteria: Standalone commit containing all four anomaly deprecation comments; `pnpm typecheck` and `pnpm --filter frontend build` both exit 0.
  deliverable: git commit (anomaly deprecations)
  [/acceptance]

**Completion criteria:** all four anomalies explicitly deprecated with comments and follow-up issues filed; no field removal in V1; no regressions in `pnpm typecheck` or `pnpm --filter frontend build`.

### Phase 1 — Schema additions (1 day)
- [tier:medium] [ ] Create `studio/schemas/objects/` directory (does not yet exist).
  [acceptance]
  check: fileExists path=studio/schemas/objects/
  criteria: Directory exists.
  deliverable: studio/schemas/objects/
  [/acceptance]
- [tier:medium] [ ] Create `studio/schemas/objects/ctaLink.ts` with `{ label, href, openInNewTab }` fields per §4.5.
  [acceptance]
  check: fileExists path=studio/schemas/objects/ctaLink.ts
  criteria: File exports a defineType with name "ctaLink" and the three required fields.
  deliverable: studio/schemas/objects/ctaLink.ts
  [/acceptance]
- [tier:medium] [ ] Create `studio/schemas/objects/landingSectionToggle.ts` per §4.4.
  [acceptance]
  check: fileExists path=studio/schemas/objects/landingSectionToggle.ts
  criteria: File exports a defineType with name "landingSectionToggle" and an `enabled` boolean field.
  deliverable: studio/schemas/objects/landingSectionToggle.ts
  [/acceptance]
- [tier:medium] [ ] Create `studio/schemas/objects/landingTestimonialSection.ts` per §4.4.
  [acceptance]
  check: fileExists path=studio/schemas/objects/landingTestimonialSection.ts
  criteria: File exports a defineType with name "landingTestimonialSection", `enabled` boolean, `testimonials` reference array, and conditional validation.
  deliverable: studio/schemas/objects/landingTestimonialSection.ts
  [/acceptance]
- [tier:medium] [ ] Create `studio/schemas/objects/landingFaqSection.ts` per §4.4.
  [acceptance]
  check: fileExists path=studio/schemas/objects/landingFaqSection.ts
  criteria: File exports a defineType with name "landingFaqSection", `enabled` boolean, `faqs` reference array, and conditional validation.
  deliverable: studio/schemas/objects/landingFaqSection.ts
  [/acceptance]
- [tier:medium] [ ] Create `studio/schemas/objects/landingPageConfig.ts` per §4.3.
  [acceptance]
  check: fileExists path=studio/schemas/objects/landingPageConfig.ts
  criteria: File exports a defineType with name "landingPageConfig" containing archetype, primaryOffer, positioning, and sections fields per §4.3.
  deliverable: studio/schemas/objects/landingPageConfig.ts
  [/acceptance]
- [tier:medium] [ ] Edit `studio/schemas/documents/campaign.ts`: add `landingPage` group, add `landingPage` field.
  [acceptance]
  check: run command="rg -n 'landingPage' studio/schemas/documents/campaign.ts" expect="matches group and field definitions"
  criteria: campaign.ts contains the new `landingPage` group and the `landingPage` field of type `landingPageConfig`.
  deliverable: studio/schemas/documents/campaign.ts
  [/acceptance]
- [tier:medium] [ ] Register all five new object types in `studio/schema-types.ts` (import + append to `schemaTypes` array).
  [acceptance]
  check: run command="rg -n 'ctaLink|landingPageConfig|landingSectionToggle|landingTestimonialSection|landingFaqSection' studio/schema-types.ts" expect="5 imports and 5 array entries"
  criteria: All five new object types imported and appended to the schemaTypes array.
  deliverable: studio/schema-types.ts
  [/acceptance]
- [tier:medium] [ ] Run `pnpm typegen` from repo root.
  [acceptance]
  check: run command="pnpm typegen" expect="exit 0"
  criteria: Typegen completes without errors; generated types are consistent.
  deliverable: frontend/sanity.types.ts (regenerated)
  [/acceptance]
- [tier:medium] [ ] Run `pnpm typecheck` — resolve any generated-type breakage.
  [acceptance]
  check: run command="pnpm typecheck" expect="exit 0"
  criteria: TypeScript compilation succeeds with no errors.
  deliverable: typecheck output (clean)
  [/acceptance]

**Completion criteria:** Studio loads without errors; new fields visible on a campaign document; typegen succeeds; `pnpm typecheck` clean.

### Phase 2 — Query, types, and wrapper (0.5 day)
- [tier:medium] [ ] Extend `CAMPAIGN_LANDING_PAGE_QUERY` in `frontend/sanity/queries/campaign.ts` to project `landingPage` (archetype, primaryOffer→full offer graph, positioning, sections) and `offerIds` (campaign offer membership evidence). Do NOT add a separate query — the legacy renderer and archetype renderer share one query result.
  [acceptance]
  check: run command="rg -n 'landingPage|offerIds' frontend/sanity/queries/campaign.ts" expect="matches new projections inside CAMPAIGN_LANDING_PAGE_QUERY"
  criteria: Unified query projects landingPage (with archetype, primaryOffer dereferenced through full offer graph, positioning, sections) and offerIds; no parallel query added.
  deliverable: frontend/sanity/queries/campaign.ts
  [/acceptance]
- [tier:medium] [ ] Add `import { bodyQuery } from "./shared/body"` to `frontend/sanity/queries/campaign.ts`, matching the exact import pattern in `frontend/sanity/queries/faqs.ts` (line 2). Use `${bodyQuery}` interpolation inside `body[]{ ... }` for the FAQ section projection — do NOT invent an inline Portable Text projection.
  [acceptance]
  check: run command="rg -n 'bodyQuery' frontend/sanity/queries/campaign.ts" expect="matches import and interpolation"
  criteria: bodyQuery imported from ./shared/body and interpolated in FAQ body projection, matching the pattern in frontend/sanity/queries/faqs.ts.
  deliverable: frontend/sanity/queries/campaign.ts
  [/acceptance]
- [tier:medium] [ ] Update the manually-defined `CampaignLandingPageQueryResult` type in `frontend/sanity/queries/campaign.ts` (lines 179–184) to include the new `landingPage` and `offerIds` fields alongside the existing legacy fields. This broadens the return shape of `fetchCampaignLandingPage` in `frontend/sanity/lib/fetch.ts` without changing the wrapper's signature or body.
  [acceptance]
  check: run command="pnpm typecheck" expect="exit 0"
  criteria: CampaignLandingPageQueryResult includes both legacy fields and the new landingPage/offerIds shape; fetchCampaignLandingPage wrapper compiles unchanged.
  deliverable: frontend/sanity/queries/campaign.ts (manual type updated)
  [/acceptance]
- [tier:medium] [ ] Run `pnpm typegen`; confirm generated types are consistent and `pnpm typecheck` passes with the broadened `CampaignLandingPageQueryResult`.
  [acceptance]
  check: run command="pnpm typegen && pnpm typecheck" expect="exit 0"
  criteria: Typegen succeeds; typecheck exits 0 with the broadened type.
  deliverable: frontend/sanity.types.ts (regenerated), typecheck output (clean)
  [/acceptance]
- [tier:medium] [ ] Verify the wrapper's broadened return shape: confirm that `fetchCampaignLandingPage({ slug })` in `frontend/sanity/lib/fetch.ts` still compiles and returns the extended type (the wrapper's body is unchanged — it returns `data as CampaignLandingPageQueryResult` — so only the manual type update is needed).
  [acceptance]
  check: run command="pnpm typecheck" expect="exit 0"
  criteria: fetchCampaignLandingPage compiles with the broadened return type without any changes to its body.
  deliverable: frontend/sanity/lib/fetch.ts (verified unchanged)
  [/acceptance]

**Completion criteria:** unified query executes in Studio's Vision tool against a seeded campaign doc; `CampaignLandingPageQueryResult` exposes both legacy fields and the new `landingPage`/`offerIds` shape; `fetchCampaignLandingPage` wrapper compiles with the broadened type; legacy renderer still works from the same result.

### Phase 3 — Semantic section components (2 days)
- [tier:medium] [ ] Create `frontend/components/landing/sections/` with one file per section (§5.3): `hero.tsx`, `value-equation.tsx`, `fulfillment.tsx`, `bonus-stack.tsx`, `pricing.tsx`, `guarantees.tsx`, `testimonials.tsx`, `faqs.tsx`, `urgency-close.tsx`.
  [acceptance]
  check: fileExists path=frontend/components/landing/sections/hero.tsx
  criteria: All nine section component files exist in frontend/components/landing/sections/.
  deliverable: frontend/components/landing/sections/ (9 section files)
  [/acceptance]
- [tier:medium] [ ] Each section consumes its typed slice; reuses `frontend/components/ui/` primitives and (where appropriate) existing visual primitives (carousel for testimonials, accordion for FAQs).
  [acceptance]
  check: run command="pnpm typecheck" expect="exit 0"
  criteria: Each section component accepts typed props matching its §6 source fields and compiles without errors.
  deliverable: frontend/components/landing/sections/ (all section components typed)
  [/acceptance]
- [tier:medium] [ ] Each section implements the fallback behavior in §6.
  [acceptance]
  check: run command="pnpm --filter frontend build" expect="exit 0"
  criteria: Each section hides silently when its required data is absent (per §6 mapping table); dev-mode console warnings emitted for missing data; no crashes.
  deliverable: frontend/components/landing/sections/ (fallback behavior implemented)
  [/acceptance]

**Completion criteria:** each section component renders in isolation via a Storybook-equivalent or a temporary `/dev/landing` test route with fixture data.

### Phase 4 — Archetype compiler & route integration (1 day)
- [tier:medium] [ ] Create `frontend/components/landing/core-offer-landing.tsx`.
  [acceptance]
  check: fileExists path=frontend/components/landing/core-offer-landing.tsx
  criteria: Top-level archetype compiler reads landingPage.sections and emits sections in fixed order with typed props to semantic section components.
  deliverable: frontend/components/landing/core-offer-landing.tsx
  [/acceptance]
- [tier:medium] [ ] Edit campaign route to branch on `landingPage.archetype === "coreOfferLanding"`.
  [acceptance]
  check: run command="pnpm typecheck" expect="exit 0"
  criteria: Route branches on archetype, validates primaryOffer membership via offerIds, checks sections present, and falls back to legacy when invalid per §5.4.
  deliverable: frontend/app/(main)/campaigns/[slug]/page.tsx
  [/acceptance]
- [tier:medium] [ ] Legacy `CampaignLandingPage` remains the fallback.
  [acceptance]
  check: run command="pnpm --filter frontend build" expect="exit 0"
  criteria: Legacy CampaignLandingPage renders for campaigns without archetype set; both paths coexist without regressions.
  deliverable: frontend/components/campaign-landing-page.tsx (unchanged)
  [/acceptance]

**Completion criteria:** a campaign doc with archetype set renders the new page; a campaign doc without it renders the legacy page; both routes coexist.

### Phase 5 — Seeded content & verification (0.5 day)
- [tier:medium] [ ] Seed one campaign doc in Sanity with archetype set, primary offer, positioning, and at least one testimonial and one FAQ selected.
  [acceptance]
  check: run command="rg -n 'archetype' frontend/app" expect="no hard-coded archetype references in app routes"
  criteria: Seeded campaign doc exists in Sanity with all archetype fields populated (archetype, primaryOffer, positioning, sections with at least one testimonial and one FAQ selected); the campaign's slug field is set so the page is reachable at /campaigns/core-offer-landing-v1.
  deliverable: Sanity campaign document (seeded, slug: core-offer-landing-v1)
  [/acceptance]
- [tier:medium] [ ] Walk the page end-to-end; confirm each section renders or hides per §6.
  [acceptance]
  check: run command="pnpm --filter frontend build" expect="exit 0"
  criteria: Each enabled section renders with correct content; each disabled section is absent; fallback behavior matches §6 for missing data.
  deliverable: /campaigns/core-offer-landing-v1 rendered page (verified end-to-end)
  [/acceptance]
- [tier:medium] [ ] Run `pnpm --filter frontend build`.
  [acceptance]
  check: run command="pnpm --filter frontend build" expect="exit 0"
  criteria: Build exits 0 with no errors.
  deliverable: build output (green)
  [/acceptance]
- [tier:heavy] [ ] Review the complete V1 implementation against this plan before handoff.
  [acceptance]
  check: run command="pnpm typegen && pnpm typecheck && pnpm --filter frontend lint && pnpm --filter frontend build" expect="exit 0"
  criteria: All Definition of Done items (§11) confirmed: archetype publishable in Studio, deterministic render per §6, legacy fallback intact, all four commands exit 0, anomalies deprecated with follow-up issues, no changes to page.blocks[] or offer graph, primary-offer membership enforced at both schema and render time, landingPage.sections required at schema level and checked at render time.
  deliverable: final implementation review
  [/acceptance]

**Completion criteria:** build green; seeded page renders correctly; legacy path still works for an un-archetyped campaign.

---

## 8. Existing-Content Migration, Fallback, Cutover, Removal

**During V1 work:**
- No existing `campaign` documents are modified. The new `landingPage` field is optional at the document level — legacy campaigns may omit it entirely.
- Legacy `CampaignLandingPage` renderer remains the default for any campaign without `landingPage.archetype`.
- When `landingPage` is present and `archetype` is set, `positioning` (including `headline` and `primaryCta`) and `sections` are required. Studio will refuse to publish a configured archetype without a `sections` object (`validation: (Rule) => Rule.required()` on `landingPageConfig.sections`). At render time, the route additionally checks `lp?.sections != null` so any malformed/legacy raw data that predates the constraint falls back safely to `CampaignLandingPage` rather than rendering an empty semantic page.
- `primaryOffer.priceModel` is optional; the pricing section hides if missing.

**Cutover (per-document, manual):**
- For each campaign that should use the new archetype:
   1. [tier:medium] Set `landingPage.archetype = "coreOfferLanding"`.
   2. [tier:medium] Set `landingPage.primaryOffer` to the core offer.
   3. [tier:medium] Fill `landingPage.positioning`.
      [acceptance]
      check: run command="In Studio, open the campaign document and verify positioning fields are populated" expect="headline, subhead, proofStatement (optional), and primaryCta are filled"
      criteria: All required positioning fields (headline, primaryCta) are populated; subhead and proofStatement are filled or intentionally omitted.
      deliverable: campaign document with positioning completed
      [/acceptance]
   4. [tier:medium] Toggle sections; select testimonials/FAQs where desired.
      [acceptance]
      check: run command="In Studio, verify sections object is present and configured" expect="sections object exists with at least hero, valueEquation, fulfillment, bonusStack, pricing, guarantees, urgencyClose enabled; testimonials/FAQs have explicit selections if enabled"
      criteria: Sections object is present (required by schema); each section is toggled on/off as intended; testimonials and FAQs have at least one reference selected when enabled (conditional validation enforced by Studio).
      deliverable: campaign document with sections configured
      [/acceptance]
   5. [tier:medium] Preview; publish.
      [acceptance]
      check: run command="Visit /campaigns/<slug> in browser; verify page renders correctly" expect="archetype page renders with all enabled sections visible; legacy path still works for un-archetyped campaigns"
      criteria: Preview shows the new archetype page with correct section order and content; publish succeeds; live URL renders the archetype page; legacy campaigns without archetype still render via CampaignLandingPage.
      deliverable: published campaign page at /campaigns/<slug>
      [/acceptance]
- No automated data migration is required because the archetype reads from the same offer graph the legacy renderer already uses.

**Fallback & removal:**
- The legacy `CampaignLandingPage` component and its query are NOT removed in V1.
- Removal of the legacy path is a V2 decision, gated on: (a) all active campaigns migrated, (b) 30-day observation window with no rollback, (c) owner sign-off.

---

## 9. Test / Verification Matrix & Runnable Commands

**Repo commands (from `package.json` files — do not invent):**
- `pnpm dev` — parallel dev (frontend + studio).
- `pnpm dev:frontend` — frontend only.
- `pnpm dev:studio` — studio only.
- `pnpm typegen` — schema extract + typegen.
- `pnpm typecheck` — `tsc --noEmit` in frontend.
- `pnpm export` — dataset export (not used in this plan).
- Frontend-only: `pnpm --filter frontend build`, `pnpm --filter frontend lint`.

**Verification matrix:**

| Check | Command / Action | Pass criteria |
|---|---|---|
| Typegen clean | [tier:medium] `pnpm typegen` | Exits 0; generated types are consistent. |
| Frontend typecheck | [tier:medium] `pnpm typecheck` | Exits 0 with no errors. `CampaignLandingPageQueryResult` includes `landingPage` and `offerIds`. |
| Wrapper return shape | [tier:medium] `pnpm typecheck` | `fetchCampaignLandingPage` in `frontend/sanity/lib/fetch.ts` compiles with broadened `CampaignLandingPageQueryResult` — wrapper body unchanged, only manual type updated. |
| Frontend lint | [tier:medium] `pnpm --filter frontend lint` | Exits 0 or only pre-existing warnings. |
| Frontend build | [tier:medium] `pnpm --filter frontend build` | Exits 0. |
| Studio loads | [tier:medium] `pnpm dev:studio` → open Studio | New fields visible on campaign doc; no schema errors. |
| Archetype render | [tier:medium] Seed campaign + visit `/campaigns/<slug>` | New archetype renders; legacy path still works for un-archetyped campaign. |
| Primary-offer fallback | [tier:medium] Set archetype but remove primaryOffer or set it to a non-campaign offer | Legacy `CampaignLandingPage` renders; dev console warning emitted. |
| Sections-missing fallback | [tier:medium] Set archetype + primaryOffer but leave `sections` absent (simulated malformed/legacy raw data, e.g. via API patch bypassing Studio validation) | Legacy `CampaignLandingPage` renders; dev console warning emitted. Studio publish is blocked by `Rule.required()` on `landingPageConfig.sections`. |
| Membership validation | [tier:medium] In Studio, set `primaryOffer` to an offer NOT in `campaign.offers[]` | Validation error fires with clear message (see §4.6 pseudo-code). |
| Section fallback | [tier:medium] For each section, remove its source data | Section hides silently; no crash; dev console warning. |
| Anomaly cleanup | [tier:medium] After phase 0 | All four anomalies deprecated with comments and follow-up issues; no regressions. |

---

## 10. Decisions & Risks

**Decisions already made (do not reopen without owner):**
- V1 targets **Core Offer Landing Page** archetype only.
- `page.blocks[]` is preserved for non-commercial pages.
- Legacy `CampaignLandingPage` remains as fallback during migration.
- Generic blocks and commercial content remain separate abstractions.
- Testimonials and FAQs are **explicitly selected**, not auto-included.
- Anomalies (§2) are queued for phase 0 cleanup or explicit deprecation.

**V1 decisions (closed — implement as specified, no owner confirmation needed):**

1. **Pricing is optional at schema level.** `primaryOffer.priceModel` is not required for publish. The pricing section hides silently when `priceModel` is missing or empty (per §6 mapping table). A core-offer landing without a price is a valid editorial choice (e.g. "contact for pricing" pages). If data shows most campaigns omit pricing, revisit whether the archetype should enforce it.

2. **New `ctaLink` object is required; do not reuse generic `link`.** The existing `studio/schemas/blocks/shared/link.ts` (named `link`) has `isExternal`, `internalLink`, `title`, `href`, `target`, `buttonVariant` — a generic link with conditional visibility and a button variant selector. The archetype CTA needs a simpler, required-field contract: `{ label (required), href (required URL), openInNewTab (boolean, default false) }`. Create `studio/schemas/objects/ctaLink.ts` and register in `studio/schema-types.ts`. This is not negotiable; reusing `link` would leak button-variant selection and conditional visibility into the CTA contract.

3. **V1 uses explicit section types, not a shared selection type.** Testimonials and FAQs each get their own object type (`landingTestimonialSection`, `landingFaqSection`). Each type exposes only its own reference array, so editors cannot populate the wrong array. Conditional validation enforces at least one reference when a section is enabled. Operator correctness outweighs two small schema files.

4. **Generic path anomalies are deprecation/follow-up only in V1, not removal work.** Phase 0 inspects the four anomalies (§2) and marks them deprecated with comments and follow-up issues. Do not remove fields or break existing content in V1. Removal is a V2 decision, gated on: (a) confirming no active content uses the fields, (b) owner sign-off.

5. **Primary-offer membership is enforced in Studio and again at render time.** Schema-level custom validation (§4.6) uses `context.document.offers` to enforce membership at edit time. Render-time enforcement (§5.4) provides defense in depth for broken refs or corrupted data. Both layers are required and non-negotiable. The dual approach is the safety net; removing either layer increases risk of silent misrenders.

6. **`landingPage.sections` is required at schema level and checked at render time.** `landingPageConfig.sections` carries `validation: (Rule) => Rule.required()` so Studio blocks publish of a configured archetype without a section map. The route predicate additionally checks `lp?.sections != null` so malformed/legacy raw data that predates the constraint (or that bypassed Studio validation via API) falls back safely to `CampaignLandingPage` rather than rendering an empty semantic page. Individual section *enablement* within the `sections` object remains per-section (each `landingSectionToggle`, `landingTestimonialSection`, `landingFaqSection` has its own `enabled` flag) — this decision is about the `sections` object itself being present, not about every section being turned on.

**Post-V1 follow-ups (do not block V1 implementation):**
- Remove deprecated anomalies after confirming no active content uses them.
- Revisit pricing requirement if data shows most campaigns omit it.

**Risks:**
- **Unified query size.** Extending `CAMPAIGN_LANDING_PAGE_QUERY` adds projections for the full offer graph. If the query becomes a performance concern, profile it in Vision before splitting — do not preemptively add a parallel query.
- **Copywriter confusion between `page` and `campaign`.** Mitigated by clear document descriptions and by keeping the two paths disjoint.
- **Broken primaryOffer ref at render time.** Mitigated by dual enforcement: schema validation (§4.6) at edit time and route-level membership check (§5.4) at render time. Fallback to legacy is silent in production, verbose in dev.

---

## 11. Definition of Done (V1)

V1 is done when:
1. A copywriter can open a campaign document, set the archetype to `coreOfferLanding`, pick a primary offer, fill positioning, toggle sections, select testimonials/FAQs, and publish — without touching any generic block layout.
2. The published campaign URL renders a deterministic, fixed-order page whose sections match §6 mapping, with correct fallback behavior for missing data.
3. The legacy `CampaignLandingPage` path still works for any campaign without the archetype set, and also for any campaign where the archetype is set but the primary offer is missing, unresolved, or not a campaign member, **or where `landingPage.sections` is absent** (malformed/legacy raw data predating the required-field constraint) — render-time fallback per §5.4.
4. `pnpm typegen`, `pnpm typecheck`, `pnpm --filter frontend lint`, and `pnpm --filter frontend build` all exit 0.
5. The four anomalies from §2 are explicitly deprecated with comments and follow-up issues filed (deprecation only in V1 — no field removal).
6. No changes to `page.blocks[]`, the generic block dispatcher, or the offer graph.
7. This plan document is the only new file at the repo root; all other changes are within `studio/schemas/`, `studio/schema-types.ts`, and `frontend/`.
8. Primary-offer membership is enforced at both schema-validation time (§4.6) and render time (§5.4), with a clear dev-mode warning and silent production fallback to legacy.
9. `landingPage.sections` is required at the schema level (`Rule.required()` on `landingPageConfig.sections`) and checked at render time (`lp?.sections != null` in the route predicate), so a configured archetype cannot validly render without its section map — Studio blocks publish, and malformed/legacy raw data falls back safely to `CampaignLandingPage`.
