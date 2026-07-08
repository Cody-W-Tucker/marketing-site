import type { PortableTextProps } from "@portabletext/react";
import type { ReactNode } from "react";
import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import { deriveCampaignTitle } from "@/sanity/queries/campaign";
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
  const derivedTitle = deriveCampaignTitle(details);

  return (
    <main className="mx-auto max-w-prose px-6 py-16 text-[15px] leading-7 sm:px-8">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-normal text-foreground break-words sm:text-5xl">
          {derivedTitle || "Campaign"}
        </h1>
      </header>

      {campaign.offers?.map((offer, index) => (
        <article key={offer._id} className="mb-16 space-y-8 last:mb-0">
          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {index === 0 ? "Core Offer" : `Offer ${index + 1}`}
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {offer.name || "Untitled offer"}
            </h2>
            {offer.priceModel ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {formatPrice(offer.priceModel.price, offer.priceModel.currency)}
                {offer.priceModel.billingModel
                  ? ` · ${humanizeToken(offer.priceModel.billingModel)}`
                  : ""}
                {offer.priceModel.title ? ` · ${offer.priceModel.title}` : ""}
              </p>
            ) : null}
          </div>

          <div className="space-y-6">
            {offer.valueEquation ? (
              <div className="space-y-4">
                {offer.valueEquation.dreamOutcome ? (
                  <div>
                    <span className="text-muted-foreground">
                      Dream Outcome:
                    </span>{" "}
                    <span className="text-foreground">
                      <PortableTextRenderer
                        value={offer.valueEquation.dreamOutcome}
                      />
                    </span>
                  </div>
                ) : null}
                {offer.valueEquation.perceivedLikelihood ? (
                  <div>
                    <span className="text-muted-foreground">
                      Likelihood of Success:
                    </span>{" "}
                    <span className="text-foreground">
                      <PortableTextRenderer
                        value={offer.valueEquation.perceivedLikelihood}
                      />
                    </span>
                  </div>
                ) : null}
                {offer.valueEquation.timeDelay ? (
                  <div>
                    <span className="text-muted-foreground">Speed:</span>{" "}
                    <span className="text-foreground">
                      <PortableTextRenderer
                        value={offer.valueEquation.timeDelay}
                      />
                    </span>
                  </div>
                ) : null}
                {offer.valueEquation.effortAndSacrifice ? (
                  <div>
                    <span className="text-muted-foreground">Ease:</span>{" "}
                    <span className="text-foreground">
                      <PortableTextRenderer
                        value={offer.valueEquation.effortAndSacrifice}
                      />
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
            {offer.featureList ? (
              <section>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  What&apos;s Included
                </h3>
                <div className="text-foreground">
                  <PortableTextRenderer value={offer.featureList} />
                </div>
              </section>
            ) : null}
          </div>

          <RelatedOffersSection offer={offer} />

          {offer.fulfillmentModel ? (
            <section className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                How Delivery Works
              </h3>
              <div className="space-y-1 text-foreground">
                {offer.fulfillmentModel.deliveryFormat ? (
                  <p>
                    <span className="text-muted-foreground">Format:</span>{" "}
                    {offer.fulfillmentModel.deliveryFormat}
                  </p>
                ) : null}
                {offer.fulfillmentModel.timeline ? (
                  <p>
                    <span className="text-muted-foreground">Timeline:</span>{" "}
                    {offer.fulfillmentModel.timeline}
                  </p>
                ) : null}
                {offer.fulfillmentModel.scope ? (
                  <p>
                    <span className="text-muted-foreground">Scope:</span>{" "}
                    {offer.fulfillmentModel.scope}
                  </p>
                ) : null}
                {offer.fulfillmentModel.cadenceOrSupportModel ? (
                  <p>
                    <span className="text-muted-foreground">Support:</span>{" "}
                    {offer.fulfillmentModel.cadenceOrSupportModel}
                  </p>
                ) : null}
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
            </section>
          ) : null}

          {offer.bonus?.length ? (
            <section>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Bonuses
              </h3>
              <ul className="space-y-3">
                {offer.bonus.map((bonus) => (
                  <li key={bonus._id} className="text-foreground">
                    <span className="font-medium">{bonus.name || "Bonus"}</span>
                    {bonus.summary ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — {bonus.summary}
                      </span>
                    ) : null}
                    {bonus.promisedOutcome ? (
                      <span> · {bonus.promisedOutcome}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {offer.guarantees?.length ? (
            <section>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Guarantees
              </h3>
              <ul className="space-y-3">
                {offer.guarantees.map((guarantee) => (
                  <li key={guarantee._id} className="text-foreground">
                    <span className="font-medium">
                      {guarantee.title || "Guarantee"}
                    </span>
                    {guarantee.guaranteeType ? (
                      <span className="text-muted-foreground">
                        {" "}
                        ({humanizeToken(guarantee.guaranteeType)})
                      </span>
                    ) : null}
                    {guarantee.promise ? (
                      <span> — {guarantee.promise}</span>
                    ) : null}
                    {guarantee.claimWindowDays ? (
                      <span className="text-muted-foreground">
                        {" "}
                        (claim window: {guarantee.claimWindowDays} days)
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {offer.urgency?.length || offer.scarcity?.length ? (
            <section>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Why Act Now
              </h3>
              <ul className="space-y-3">
                {offer.urgency?.map((item) => (
                  <li key={item._id} className="text-foreground">
                    <span className="font-medium">
                      {item.title || "Urgency"}
                    </span>
                    {item.displayCopy ? (
                      <span> — {item.displayCopy}</span>
                    ) : null}
                    {item.endsAt ? (
                      <span className="text-muted-foreground">
                        {" "}
                        (ends {formatDate(item.endsAt)})
                      </span>
                    ) : null}
                  </li>
                ))}
                {offer.scarcity?.map((item) => (
                  <li key={item._id} className="text-foreground">
                    <span className="font-medium">
                      {item.title || "Scarcity"}
                    </span>
                    {item.displayCopy ? (
                      <span> — {item.displayCopy}</span>
                    ) : null}
                    {typeof item.quantityLimit === "number" ? (
                      <span className="text-muted-foreground">
                        {" "}
                        (limit: {item.quantityLimit})
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      ))}
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
        {
          title: "Decision Framing",
          value: offer.upsellOffer?.decisionFraming,
        },
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
    <section>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Role-Specific Offers
      </h3>
      <div className="space-y-6">
        {availableOffers.map((item) => (
          <RelatedOfferPanel key={item.key} item={item} />
        ))}
      </div>
    </section>
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
    <div className="space-y-3">
      <div>
        <span className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
          {item.label}
        </span>
        {offer.name ? (
          <span className="ml-2 font-medium text-foreground">{offer.name}</span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{item.description}</p>
      {offer.summary ? (
        <p className="text-sm text-foreground">{offer.summary}</p>
      ) : null}
      {fields.length ? (
        <div className="space-y-2 pl-1 text-sm">
          {fields.map((field) => (
            <RelatedOfferFieldPanel
              key={field.title}
              title={field.title}
              value={field.value}
            />
          ))}
        </div>
      ) : null}
    </div>
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
      ) : null}
    </div>
  );
}

function hasFieldValue(value: RelatedOfferFieldValue): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Array.isArray(value) && value.length > 0;
}

function StringList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mt-3">
      <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-1 space-y-1 text-sm leading-7 text-foreground">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
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
