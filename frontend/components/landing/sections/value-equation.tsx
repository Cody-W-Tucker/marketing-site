import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type PrimaryOffer = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>["primaryOffer"];

type ValueEquation = NonNullable<PrimaryOffer>["valueEquation"];

type ValueEquationFields = NonNullable<ValueEquation>;

type Quadrant = {
  key: keyof ValueEquationFields;
  label: string;
};

const QUADRANTS: Quadrant[] = [
  { key: "dreamOutcome", label: "Dream Outcome" },
  { key: "perceivedLikelihood", label: "Likelihood of Success" },
  { key: "timeDelay", label: "Speed" },
  { key: "effortAndSacrifice", label: "Ease" },
];

export type ValueEquationSectionProps = {
  valueEquation?: ValueEquation;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function isNonEmpty(value: ValueEquationFields[keyof ValueEquationFields]): boolean {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export default function ValueEquationSection({
  valueEquation,
  enabled = true,
}: ValueEquationSectionProps) {
  if (!enabled) {
    return null;
  }

  if (!valueEquation) {
    if (IS_DEV) {
      console.warn(
        "[ValueEquationSection] Section is enabled but valueEquation data is missing. Rendering nothing.",
      );
    }
    return null;
  }

  const populatedQuadrants = QUADRANTS.filter((q) =>
    isNonEmpty(valueEquation[q.key]),
  );

  if (populatedQuadrants.length < 2) {
    if (IS_DEV) {
      console.warn(
        `[ValueEquationSection] Section is enabled but only ${populatedQuadrants.length} quadrant(s) have data (minimum 2 required). Rendering nothing.`,
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          The Value Equation
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {populatedQuadrants.map((quadrant) => (
            <div
              key={quadrant.key}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {quadrant.label}
              </p>
              <div className="mt-2 text-foreground">
                <PortableTextRenderer
                  value={valueEquation[quadrant.key] as never}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
