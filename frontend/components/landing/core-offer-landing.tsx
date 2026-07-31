import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";

import HeroSection from "@/components/landing/sections/hero";
import ValueEquationSection from "@/components/landing/sections/value-equation";
import FulfillmentSection from "@/components/landing/sections/fulfillment";
import BonusStackSection from "@/components/landing/sections/bonus-stack";
import PricingSection from "@/components/landing/sections/pricing";
import TestimonialsSection from "@/components/landing/sections/testimonials";

type LandingPage = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>;

type Sections = NonNullable<LandingPage["sections"]>;

export type CoreOfferLandingProps = {
  landingPage: LandingPage;
};

/**
 * Top-level landing renderer.
 *
 * Reads `landingPage.sections` and emits each currently implemented semantic
 * section in fixed plan order, gated by its `enabled` flag.
 *
 * Incremental limitations (plan-required section components not yet implemented):
 *   - guarantees
 *   - urgencyClose
 *   - faqs
 * These are intentionally omitted rather than fabricated.
 */
export default function CoreOfferLanding({ landingPage }: CoreOfferLandingProps) {
  const sections: Sections = landingPage.sections ?? {};
  const primaryOffer = landingPage.primaryOffer;
  const positioning = landingPage.positioning;

  return (
    <>
      <HeroSection
        positioning={positioning}
        primaryOfferName={primaryOffer?.name}
        enabled={sections.hero?.enabled ?? false}
      />

      <ValueEquationSection
        valueEquation={primaryOffer?.valueEquation}
        enabled={sections.valueEquation?.enabled ?? false}
      />

      <FulfillmentSection
        fulfillmentModel={primaryOffer?.fulfillmentModel}
        enabled={sections.fulfillment?.enabled ?? false}
      />

      <BonusStackSection
        bonus={primaryOffer?.bonus}
        enabled={sections.bonusStack?.enabled ?? false}
      />

      <PricingSection
        priceModel={primaryOffer?.priceModel}
        featureList={primaryOffer?.featureList}
        enabled={sections.pricing?.enabled ?? false}
      />

      <TestimonialsSection
        testimonials={sections.testimonials}
        enabled={sections.testimonials?.enabled ?? false}
      />
    </>
  );
}
