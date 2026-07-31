import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type LandingPage = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>;

type PrimaryOffer = LandingPage["primaryOffer"];
type Positioning = LandingPage["positioning"];

type Urgency = NonNullable<NonNullable<PrimaryOffer>["urgency"]>[number];
type Scarcity = NonNullable<NonNullable<PrimaryOffer>["scarcity"]>[number];
type PrimaryCta = NonNullable<Positioning>["primaryCta"];

export type UrgencyCloseSectionProps = {
  urgency?: NonNullable<PrimaryOffer>["urgency"];
  scarcity?: NonNullable<PrimaryOffer>["scarcity"];
  primaryCta?: PrimaryCta;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function hasString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRenderableUrgency(item: Urgency): boolean {
  return Boolean(
    hasString(item.title) ||
      hasString(item.urgencyType) ||
      (item.description && item.description.length > 0),
  );
}

function isRenderableScarcity(item: Scarcity): boolean {
  return Boolean(
    hasString(item.title) ||
      hasString(item.scarcityType) ||
      (item.description && item.description.length > 0),
  );
}

function hasRenderableCta(cta: PrimaryCta | undefined): cta is NonNullable<PrimaryCta> {
  if (!cta) return false;
  return Boolean(hasString(cta.label) && hasString(cta.href));
}

export default function UrgencyCloseSection({
  urgency,
  scarcity,
  primaryCta,
  enabled = true,
}: UrgencyCloseSectionProps) {
  if (!enabled) {
    return null;
  }

  const ctaReady = hasRenderableCta(primaryCta);

  if (!ctaReady) {
    if (IS_DEV) {
      console.warn(
        "[UrgencyCloseSection] Section is enabled but primaryCta is missing or non-renderable. Rendering nothing.",
      );
    }
    return null;
  }

  const renderableUrgency = (urgency ?? []).filter(isRenderableUrgency);
  const renderableScarcity = (scarcity ?? []).filter(isRenderableScarcity);

  const hasUrgencyOrScarcity =
    renderableUrgency.length > 0 || renderableScarcity.length > 0;

  const ctaLabel = primaryCta.label!.trim();
  const ctaHref = primaryCta.href!.trim();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        {hasUrgencyOrScarcity ? (
          <>
            {renderableUrgency.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
                  Why Now
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {renderableUrgency.map((item) => (
                    <div
                      key={item._id}
                      className="flex h-full flex-col rounded-lg border border-border bg-card p-6"
                    >
                      {hasString(item.urgencyType) ? (
                        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {item.urgencyType}
                        </p>
                      ) : null}
                      {hasString(item.title) ? (
                        <h3 className="mt-2 text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                      ) : null}
                      {item.description && item.description.length > 0 ? (
                        <div className="mt-3 text-foreground leading-7">
                          <PortableTextRenderer value={item.description as never} />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {renderableScarcity.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
                  Limited Availability
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {renderableScarcity.map((item) => (
                    <div
                      key={item._id}
                      className="flex h-full flex-col rounded-lg border border-border bg-card p-6"
                    >
                      {hasString(item.scarcityType) ? (
                        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {item.scarcityType}
                        </p>
                      ) : null}
                      {hasString(item.title) ? (
                        <h3 className="mt-2 text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                      ) : null}
                      {item.description && item.description.length > 0 ? (
                        <div className="mt-3 text-foreground leading-7">
                          <PortableTextRenderer value={item.description as never} />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="flex justify-center">
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
