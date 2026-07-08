import type { PortableTextProps } from "@portabletext/react";
import type { ReactNode } from "react";
import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type Campaign = NonNullable<CampaignLandingPageQueryResult>;
type CoreOffer = NonNullable<Campaign["offers"]>[number];
type AttractionOffer = NonNullable<CoreOffer["attractionOffer"]>;
type UpsellOffer = NonNullable<CoreOffer["upsellOffer"]>;
type ContinuityOffer = NonNullable<CoreOffer["continuityOffer"]>;
type DownsellOffer = NonNullable<CoreOffer["downsellOffer"]>;
type RelatedOffer =
  | AttractionOffer
  | UpsellOffer
  | ContinuityOffer
  | DownsellOffer;
type RelatedOfferFieldValue =
  | PortableTextProps["value"]
  | string
  | null
  | undefined;

export default function CampaignLandingPage({
  campaign,
}: {
  campaign: Campaign;
}) {
  const details = campaign.campaignDetails;
  const offerCount = campaign.offers?.length ?? 0;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-12">
      <section className="flex flex-col gap-6 border-b border-border pb-12">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {details?.avatar ? <Badge>{details.avatar}</Badge> : null}
          {details?.containerType ? <Badge>{details.containerType}</Badge> : null}
          {details?.intervalTime ? <Badge>{details.intervalTime}</Badge> : null}
          <Badge>{offerCount} offer{offerCount === 1 ? "" : "s"}</Badge>
        </div>

        <div className="max-w-4xl space-y-4">
          {details?.magneticReason ? (
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {details.magneticReason}
            </p>
          ) : null}

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {campaign.title || "Campaign"}
          </h1>

          {details?.goal ? (
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              {details.goal}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-8">
          {campaign.offers?.map((offer) => (
            <article
              key={offer._id}
              className="space-y-8 rounded-2xl border border-border p-6 sm:p-8"
            >
              <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Core Offer
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {offer.name || "Untitled offer"}
                  </h2>
                </div>

                {offer.priceModel ? (
                  <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                    <p className="font-medium text-foreground">
                      {formatPrice(offer.priceModel.price, offer.priceModel.currency)}
                    </p>
                    {offer.priceModel.billingModel ? (
                      <p>{humanizeToken(offer.priceModel.billingModel)}</p>
                    ) : null}
                    {offer.priceModel.title ? <p>{offer.priceModel.title}</p> : null}
                  </div>
                ) : null}
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                <RichTextPanel
                  title="Dream Outcome"
                  value={offer.valueEquation?.dreamOutcome}
                />
                <RichTextPanel
                  title="Likelihood of Success"
                  value={offer.valueEquation?.perceivedLikelihood}
                />
                <RichTextPanel
                  title="Speed"
                  value={offer.valueEquation?.timeDelay}
                />
                <RichTextPanel
                  title="Ease"
                  value={offer.valueEquation?.effortAndSacrifice}
                />
              </div>

              {offer.featureList ? (
                <Section title="What&apos;s Included">
                  <PortableTextRenderer value={offer.featureList} />
                </Section>
              ) : null}

              <RelatedOffersSection offer={offer} />

              {offer.fulfillmentModel ? (
                <Section title="How Delivery Works">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextPanel
                      title="Delivery Format"
                      value={offer.fulfillmentModel.deliveryFormat}
                    />
                    <TextPanel
                      title="Timeline"
                      value={offer.fulfillmentModel.timeline}
                    />
                    <TextPanel title="Scope" value={offer.fulfillmentModel.scope} />
                    <TextPanel
                      title="Support Model"
                      value={offer.fulfillmentModel.cadenceOrSupportModel}
                    />
                  </div>

                  <StringList
                    title="Deliverables"
                    items={offer.fulfillmentModel.deliverables}
                  />
                  <StringList
                    title="Client Responsibilities"
                    items={offer.fulfillmentModel.clientResponsibilities}
                  />
                  <StringList
                    title="Success Criteria"
                    items={offer.fulfillmentModel.successCriteria}
                  />
                </Section>
              ) : null}

              {offer.bonus?.length ? (
                <Section title="Bonuses">
                  <div className="grid gap-4">
                    {offer.bonus.map((bonus) => (
                      <div
                        key={bonus._id}
                        className="rounded-xl border border-border p-4"
                      >
                        <h3 className="text-base font-medium text-foreground">
                          {bonus.name || "Bonus"}
                        </h3>
                        {bonus.summary ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {bonus.summary}
                          </p>
                        ) : null}
                        {bonus.promisedOutcome ? (
                          <p className="mt-3 text-sm text-foreground">
                            {bonus.promisedOutcome}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {offer.guarantees?.length ? (
                <Section title="Guarantees">
                  <div className="grid gap-4">
                    {offer.guarantees.map((guarantee) => (
                      <div
                        key={guarantee._id}
                        className="rounded-xl border border-border p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-foreground">
                            {guarantee.title || "Guarantee"}
                          </h3>
                          {guarantee.guaranteeType ? (
                            <Badge>{humanizeToken(guarantee.guaranteeType)}</Badge>
                          ) : null}
                        </div>
                        {guarantee.promise ? (
                          <p className="mt-2 text-sm text-foreground">
                            {guarantee.promise}
                          </p>
                        ) : null}
                        {guarantee.claimWindowDays ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Claim window: {guarantee.claimWindowDays} days
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {(offer.urgency?.length || offer.scarcity?.length) ? (
                <Section title="Why Act Now">
                  <div className="grid gap-4 md:grid-cols-2">
                    {offer.urgency?.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border border-border p-4"
                      >
                        <h3 className="text-base font-medium text-foreground">
                          {item.title || "Urgency"}
                        </h3>
                        {item.displayCopy ? (
                          <p className="mt-2 text-sm text-foreground">
                            {item.displayCopy}
                          </p>
                        ) : null}
                        {item.endsAt ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Ends {formatDate(item.endsAt)}
                          </p>
                        ) : null}
                      </div>
                    ))}

                    {offer.scarcity?.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border border-border p-4"
                      >
                        <h3 className="text-base font-medium text-foreground">
                          {item.title || "Scarcity"}
                        </h3>
                        {item.displayCopy ? (
                          <p className="mt-2 text-sm text-foreground">
                            {item.displayCopy}
                          </p>
                        ) : null}
                        {typeof item.quantityLimit === "number" ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Limit: {item.quantityLimit}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-border p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Campaign Snapshot
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Audience</dt>
              <dd className="mt-1 text-foreground">
                {details?.avatar || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Outcome</dt>
              <dd className="mt-1 text-foreground">{details?.goal || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Timeframe</dt>
              <dd className="mt-1 text-foreground">
                {details?.intervalTime || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Format</dt>
              <dd className="mt-1 text-foreground">
                {details?.containerType || "Not set"}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}

function RelatedOffersSection({ offer }: { offer: CoreOffer }) {
  const relatedOffers: RelatedOfferConfig[] = [
    {
      key: "attraction",
      label: "Attraction Offer",
      description: "Entry point that gives this audience a clear first step.",
      offer: offer.attractionOffer,
      fields: [
        { title: "Audience", value: offer.attractionOffer?.audience },
        {
          title: "Entry Mechanism",
          value: offer.attractionOffer?.entryMechanism,
        },
        {
          title: "Easy Yes Reason",
          value: offer.attractionOffer?.easyYesReason,
        },
        { title: "CTA", value: offer.attractionOffer?.cta },
        {
          title: "Urgency or Risk Reversal",
          value: offer.attractionOffer?.urgencyOrRiskReversal,
        },
        {
          title: "Bridge to Core Offer",
          value: offer.attractionOffer?.bridgeToCoreOffer,
        },
      ],
    },
    {
      key: "upsell",
      label: "Upsell Offer",
      description: "Higher-value next step for buyers who want more support.",
      offer: offer.upsellOffer,
      fields: [
        {
          title: "Prerequisite or Core Relationship",
          value: offer.upsellOffer?.prerequisiteOrCoreRelationship,
        },
        {
          title: "Added Scope, Speed, or Support",
          value: offer.upsellOffer?.addedScopeSpeedSupport,
        },
        { title: "Trigger Point", value: offer.upsellOffer?.triggerPoint },
        { title: "Decision Framing", value: offer.upsellOffer?.decisionFraming },
        { title: "Price Delta", value: offer.upsellOffer?.priceDelta },
        { title: "Timing", value: offer.upsellOffer?.timing },
      ],
    },
    {
      key: "continuity",
      label: "Continuity Offer",
      description: "Ongoing relationship that keeps value compounding.",
      offer: offer.continuityOffer,
      fields: [
        {
          title: "Recurring Value",
          value: offer.continuityOffer?.recurringValue,
        },
        {
          title: "Billing Cadence",
          value: offer.continuityOffer?.billingCadence,
        },
        {
          title: "Commitment or Cancellation",
          value: offer.continuityOffer?.commitmentOrCancellation,
        },
        {
          title: "Renewal or Retention Benefits",
          value: offer.continuityOffer?.renewalOrRetentionBenefits,
        },
        {
          title: "Onboarding or Continuity Bonus",
          value: offer.continuityOffer?.onboardingOrContinuityBonus,
        },
        {
          title: "Role Alongside or After Core",
          value: offer.continuityOffer?.roleAlongsideOrAfterCore,
        },
      ],
    },
    {
      key: "downsell",
      label: "Downsell Offer",
      description: "Lower-friction fallback when the core offer is too much.",
      offer: offer.downsellOffer,
      fields: [
        {
          title: "Changed From Original Offer",
          value: offer.downsellOffer?.changedFromOriginalOffer,
        },
        {
          title: "Fallback Reason or Objection",
          value: offer.downsellOffer?.fallbackReasonOrObjection,
        },
        {
          title: "Reduced Scope or Payment Flexibility",
          value: offer.downsellOffer?.reducedScopeOrPaymentFlexibility,
        },
        {
          title: "Trial or Payment Plan Terms",
          value: offer.downsellOffer?.trialOrPaymentPlanTerms,
        },
        { title: "CTA", value: offer.downsellOffer?.cta },
      ],
    },
  ];

  const availableOffers = relatedOffers.filter(hasRelatedOffer);

  if (!availableOffers.length) {
    return null;
  }

  return (
    <Section title="Role-Specific Offers">
      <div className="grid gap-4">
        {availableOffers.map((item) => (
          <RelatedOfferPanel key={item.key} item={item} />
        ))}
      </div>
    </Section>
  );
}

type RelatedOfferConfig = {
  key: string;
  label: string;
  description: string;
  offer?: RelatedOffer | null;
  fields: RelatedOfferField[];
};

type AvailableRelatedOfferConfig = Omit<RelatedOfferConfig, "offer"> & {
  offer: RelatedOffer;
};

type RelatedOfferField = {
  title: string;
  value?: RelatedOfferFieldValue;
};

function hasRelatedOffer(
  item: RelatedOfferConfig,
): item is AvailableRelatedOfferConfig {
  return Boolean(item.offer);
}

function RelatedOfferPanel({ item }: { item: AvailableRelatedOfferConfig }) {
  const offer = item.offer;
  const fields = item.fields.filter((field) => hasFieldValue(field.value));

  return (
    <article className="space-y-5 rounded-xl border border-border p-5">
      <header className="space-y-3 border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.label}</Badge>
          {offer.name ? (
            <h3 className="text-base font-medium text-foreground">{offer.name}</h3>
          ) : null}
        </div>
        <div className="space-y-2">
          <p className="text-sm leading-6 text-muted-foreground">
            {item.description}
          </p>
          {offer.summary ? (
            <p className="text-sm leading-7 text-foreground">{offer.summary}</p>
          ) : null}
        </div>
      </header>

      {fields.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <RelatedOfferFieldPanel
              key={field.title}
              title={field.title}
              value={field.value}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function RelatedOfferFieldPanel({
  title,
  value,
}: {
  title: string;
  value?: RelatedOfferFieldValue;
}) {
  if (!hasFieldValue(value)) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <h4 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h4>
      {Array.isArray(value) ? (
        <div className="text-sm leading-7 text-foreground">
          <PortableTextRenderer value={value} />
        </div>
      ) : typeof value === "string" ? (
        <p className="text-sm leading-7 text-foreground">{value}</p>
      ) : (
        null
      )}
    </div>
  );
}

function hasFieldValue(value: RelatedOfferFieldValue): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Array.isArray(value) && value.length > 0;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function RichTextPanel({
  title,
  value,
}: {
  title: string;
  value?: PortableTextProps["value"] | null;
}) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h3>
      <div className="text-sm leading-7 text-foreground">
        <PortableTextRenderer value={value} />
      </div>
    </div>
  );
}

function TextPanel({ title, value }: { title: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <h3 className="mb-2 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h3>
      <p className="text-sm leading-7 text-foreground">{value}</p>
    </div>
  );
}

function StringList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2 text-sm leading-7 text-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-xl border border-border px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.12em]">
      {children}
    </span>
  );
}

function humanizeToken(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatPrice(price?: number, currency = "USD") {
  if (typeof price !== "number") {
    return "Pricing on request";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
