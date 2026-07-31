import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";

import HeroSection from "@/components/landing/sections/hero";
import ValueEquationSection from "@/components/landing/sections/value-equation";
import FulfillmentSection from "@/components/landing/sections/fulfillment";
import BonusStackSection from "@/components/landing/sections/bonus-stack";
import GuaranteesSection from "@/components/landing/sections/guarantees";
import PricingSection from "@/components/landing/sections/pricing";
import TestimonialsSection from "@/components/landing/sections/testimonials";
import FaqsSection from "@/components/landing/sections/faqs";
import UrgencyCloseSection from "@/components/landing/sections/urgency-close";

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

      <GuaranteesSection
        guarantees={primaryOffer?.guarantees}
        enabled={sections.guarantees?.enabled ?? false}
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

      <FaqsSection
        faqs={sections.faqs}
        enabled={sections.faqs?.enabled ?? false}
      />

      <UrgencyCloseSection
        urgency={primaryOffer?.urgency}
        scarcity={primaryOffer?.scarcity}
        primaryCta={positioning?.primaryCta}
        enabled={sections.urgencyClose?.enabled ?? false}
      />
    </>
  );
}
