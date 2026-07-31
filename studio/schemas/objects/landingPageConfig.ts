import { defineField, defineType } from "sanity";

type OfferRefLike = string | { _ref?: string } | null | undefined;

function extractOfferRef(value: OfferRefLike): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value._ref === "string") {
    return value._ref;
  }
  return undefined;
}

export default defineType({
  name: "landingPageConfig",
  title: "Landing Page Config",
  type: "object",
  fields: [
    defineField({
      name: "archetype",
      title: "Archetype",
      description:
        "Landing page archetype. V1 only supports one archetype.",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [{ title: "Core Offer Landing", value: "coreOfferLanding" }],
      },
    }),
    defineField({
      name: "primaryOffer",
      title: "Primary Offer",
      description:
        "The primary offer for this landing page. Must be one of the offers already added to the campaign's offers list.",
      type: "reference",
      to: [{ type: "offer" }],
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          if (!value?._ref) return true;
          const doc = context.document as
            | { offers?: ReadonlyArray<OfferRefLike> }
            | undefined;
          const offers = doc?.offers ?? [];
          const campaignOfferRefs = offers
            .map((o) => (typeof o === "string" ? o : o?._ref))
            .filter((r): r is string => Boolean(r));
          if (campaignOfferRefs.length === 0) {
            return "Campaign has no offers added yet. Add at least one offer to the campaign before selecting a primary offer.";
          }
          if (!campaignOfferRefs.includes(value._ref)) {
            return "Primary offer must be one of the offers already added to this campaign's offers list.";
          }
          return true;
        }),
    }),
    defineField({
      name: "positioning",
      title: "Positioning",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          validation: (Rule) => Rule.required().max(120),
        }),
        defineField({
          name: "subhead",
          title: "Subhead",
          type: "string",
          validation: (Rule) => Rule.max(240),
        }),
        defineField({
          name: "proofStatement",
          title: "Proof Statement",
          type: "string",
          validation: (Rule) => Rule.max(280),
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "ctaLink",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description:
        "Fixed section composition for the landing page. Testimonials and FAQs are explicit selections — enable them only when curated content is ready.",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "hero",
          title: "Hero",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
        defineField({
          name: "valueEquation",
          title: "Value Equation",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
        defineField({
          name: "fulfillment",
          title: "Fulfillment",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
        defineField({
          name: "bonusStack",
          title: "Bonus Stack",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
        defineField({
          name: "pricing",
          title: "Pricing",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
        defineField({
          name: "guarantees",
          title: "Guarantees",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
        defineField({
          name: "testimonials",
          title: "Testimonials",
          description:
            "Enable only when testimonials have been curated for this campaign.",
          type: "landingTestimonialSection",
          initialValue: { enabled: false },
        }),
        defineField({
          name: "faqs",
          title: "FAQs",
          description:
            "Enable only when FAQs have been curated for this campaign.",
          type: "landingFaqSection",
          initialValue: { enabled: false },
        }),
        defineField({
          name: "urgencyClose",
          title: "Urgency Close",
          type: "landingSectionToggle",
          initialValue: { enabled: true },
        }),
      ],
    }),
  ],
});
