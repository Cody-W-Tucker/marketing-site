import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Positioning = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>["positioning"];

type PrimaryCta = NonNullable<Positioning>["primaryCta"];

export type HeroSectionProps = {
  positioning?: Positioning;
  primaryOfferName?: string;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

export default function HeroSection({
  positioning,
  primaryOfferName,
  enabled = true,
}: HeroSectionProps) {
  const headline = positioning?.headline;
  const subhead = positioning?.subhead;
  const proofStatement = positioning?.proofStatement;
  const primaryCta = positioning?.primaryCta;

  if (!enabled) {
    return null;
  }

  if (!headline) {
    if (IS_DEV) {
      console.warn(
        "[HeroSection] Section is enabled but headline is missing. Rendering nothing.",
      );
    }
    return null;
  }

  if (!primaryCta?.label || !primaryCta?.href) {
    if (IS_DEV) {
      console.warn(
        "[HeroSection] primaryCta is missing or incomplete (label/href). Skipping section.",
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-6">
        {primaryOfferName ? (
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {primaryOfferName}
          </p>
        ) : null}

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-normal text-foreground break-words sm:text-5xl lg:text-6xl">
          {headline}
        </h1>

        {subhead ? (
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {subhead}
          </p>
        ) : null}

        {proofStatement ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground italic">
            {proofStatement}
          </p>
        ) : null}

        <CtaLink cta={primaryCta} />
      </div>
    </section>
  );
}

function CtaLink({ cta }: { cta: NonNullable<PrimaryCta> }) {
  return (
    <a
      href={cta.href}
      target={cta.openInNewTab ? "_blank" : undefined}
      rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
      className={cn(buttonVariants({ variant: "default", size: "lg" }), "text-base")}
    >
      {cta.label}
    </a>
  );
}
