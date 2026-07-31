import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type PrimaryOffer = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>["primaryOffer"];

type Guarantee = NonNullable<NonNullable<PrimaryOffer>["guarantees"]>[number];

export type GuaranteesSectionProps = {
  guarantees?: NonNullable<PrimaryOffer>["guarantees"];
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function isRenderable(g: Guarantee): boolean {
  return Boolean(
    g.title?.trim() ||
      g.promise?.trim() ||
      g.remedy?.trim() ||
      typeof g.claimWindowDays === "number" ||
      (g.description && g.description.length > 0),
  );
}

export default function GuaranteesSection({
  guarantees,
  enabled = true,
}: GuaranteesSectionProps) {
  if (!enabled) {
    return null;
  }

  if (!guarantees || guarantees.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[GuaranteesSection] Section is enabled but guarantees data is missing or empty. Rendering nothing.",
      );
    }
    return null;
  }

  const renderableGuarantees = guarantees.filter(isRenderable);

  if (renderableGuarantees.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[GuaranteesSection] Section is enabled but no guarantee items have renderable content. Rendering nothing.",
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          Our Guarantee
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {renderableGuarantees.map((g) => (
            <div
              key={g._id}
              className="flex h-full flex-col rounded-lg border border-border bg-card p-6"
            >
              {g.title ? (
                <h3 className="text-lg font-semibold text-foreground">
                  {g.title}
                </h3>
              ) : null}

              {typeof g.claimWindowDays === "number" ? (
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {g.claimWindowDays}-Day Window
                </p>
              ) : null}

              {g.promise ? (
                <p className="mt-3 text-foreground leading-7 break-words">
                  {g.promise}
                </p>
              ) : null}

              {g.remedy ? (
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Remedy
                  </p>
                  <p className="mt-1 text-foreground break-words">{g.remedy}</p>
                </div>
              ) : null}

              {g.description && g.description.length > 0 ? (
                <div className="mt-4 text-foreground">
                  <PortableTextRenderer value={g.description} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
