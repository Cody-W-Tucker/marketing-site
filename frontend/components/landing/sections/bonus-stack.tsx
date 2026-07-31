import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type PrimaryOffer = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>["primaryOffer"];

type Bonus = NonNullable<NonNullable<PrimaryOffer>["bonus"]>[number];

export type BonusStackSectionProps = {
  bonus?: NonNullable<PrimaryOffer>["bonus"];
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function hasRenderableContent(b: Bonus): boolean {
  return Boolean(
    b.name?.trim() ||
      b.summary?.trim() ||
      (b.objectionSolved && b.objectionSolved.length > 0) ||
      b.promisedOutcome?.trim() ||
      (b.deliverables && b.deliverables.length > 0) ||
      b.perceivedValue?.trim() ||
      (b.exclusivityOrTrigger && b.exclusivityOrTrigger.length > 0) ||
      (b.coreOfferRelationship && b.coreOfferRelationship.length > 0),
  );
}

export default function BonusStackSection({
  bonus,
  enabled = true,
}: BonusStackSectionProps) {
  if (!enabled) {
    return null;
  }

  if (!bonus || bonus.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[BonusStackSection] Section is enabled but bonus data is missing or empty. Rendering nothing.",
      );
    }
    return null;
  }

  const renderableBonuses = bonus.filter(hasRenderableContent);

  if (renderableBonuses.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[BonusStackSection] Section is enabled but no bonus items have renderable content. Rendering nothing.",
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          Here&apos;s Everything You Get
        </h2>

        <div className="space-y-6">
          {renderableBonuses.map((b, index) => (
            <div
              key={b._id}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Bonus {index + 1}
                </span>
                {b.name ? (
                  <h3 className="text-lg font-semibold text-foreground">
                    {b.name}
                  </h3>
                ) : null}
              </div>

              {b.summary ? (
                <p className="mt-2 text-muted-foreground">{b.summary}</p>
              ) : null}

              {b.objectionSolved && b.objectionSolved.length > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Objection Solved
                  </p>
                  <div className="mt-1 text-foreground">
                    <PortableTextRenderer value={b.objectionSolved} />
                  </div>
                </div>
              ) : null}

              {b.promisedOutcome ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Promised Outcome
                  </p>
                  <p className="mt-1 text-foreground">{b.promisedOutcome}</p>
                </div>
              ) : null}

              {b.deliverables && b.deliverables.length > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    What&apos;s Included
                  </p>
                  <div className="mt-1 text-foreground">
                    <PortableTextRenderer value={b.deliverables} />
                  </div>
                </div>
              ) : null}

              {b.perceivedValue ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Value
                  </p>
                  <p className="mt-1 text-foreground">{b.perceivedValue}</p>
                </div>
              ) : null}

              {b.exclusivityOrTrigger && b.exclusivityOrTrigger.length > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Exclusivity
                  </p>
                  <div className="mt-1 text-foreground">
                    <PortableTextRenderer value={b.exclusivityOrTrigger} />
                  </div>
                </div>
              ) : null}

              {b.coreOfferRelationship &&
              b.coreOfferRelationship.length > 0 ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    How It Connects
                  </p>
                  <div className="mt-1 text-foreground">
                    <PortableTextRenderer
                      value={b.coreOfferRelationship}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
