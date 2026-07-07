import { orderRankField } from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

const subOfferReference = defineArrayMember({
  type: "reference",
  to: [{ type: "subOffer" }],
});

const guaranteeReference = defineArrayMember({
  type: "reference",
  to: [{ type: "guarantees" }],
});

const urgencyReference = defineArrayMember({
  type: "reference",
  to: [{ type: "urgency" }],
});

const scarcityReference = defineArrayMember({
  type: "reference",
  to: [{ type: "scarcity" }],
});

export default defineType({
  name: "offer",
  title: "Offer",
  type: "document",
  description:
    "A core sellable offer. Use sub-offer references for supporting bonuses, entry points, upsells, continuity paths, and downsells around this main offer.",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "valueEquation",
      title: "Value Equation",
      type: "object",
      description:
        "The four value drivers this offer must make clear: desired outcome, likelihood of success, speed, and ease.",
      fields: [
        defineField({
          name: "dreamOutcome",
          title: "Dream Outcome",
          type: "text",
          rows: 3,
          description:
            "The concrete result the buyer wants most from this offer.",
          validation: (Rule) => Rule.max(300),
        }),
        defineField({
          name: "perceivedLikelihood",
          title: "Perceived Likelihood of Success",
          type: "text",
          rows: 3,
          description:
            "Why the buyer should believe they can actually get the outcome.",
          validation: (Rule) => Rule.max(300),
        }),
        defineField({
          name: "timeDelay",
          title: "Time Delay",
          type: "text",
          rows: 2,
          description:
            "How quickly the buyer can expect progress, proof, or the full result.",
          validation: (Rule) => Rule.max(240),
        }),
        defineField({
          name: "effortAndSacrifice",
          title: "Effort & Sacrifice",
          type: "text",
          rows: 2,
          description:
            "What the buyer must do, give up, learn, or endure to succeed—and how the offer reduces that burden.",
          validation: (Rule) => Rule.max(240),
        }),
      ],
    }),
    defineField({
      name: "serviceOrProduct",
      title: "Fulfillment or Product",
      type: "block-content",
      description:
        "What is delivered to create the dream outcome, increase confidence, shorten time delay, or reduce effort.",
    }),
    defineField({
      name: "bonus",
      title: "Bonus Offers",
      type: "array",
      description:
        "Reusable sub-offers that increase the value or confidence of this core offer without becoming the main thing being sold.",
      of: [subOfferReference],
    }),
    defineField({
      name: "featureList",
      title: "Feature List",
      type: "block-content",
    }),
    defineField({
      name: "priceModel",
      title: "Price Model",
      type: "reference",
      to: [{ type: "pricing" }],
    }),
    defineField({
      name: "guarantees",
      title: "Guarantees",
      type: "array",
      description:
        "Offer-owned risk reversals or promises that make this specific offer easier to trust. Campaigns group offers; they should not own guarantees.",
      of: [guaranteeReference],
    }),
    defineField({
      name: "urgency",
      title: "Urgency",
      type: "array",
      description:
        "Offer-owned reasons to act now, such as deadlines, windows, or timing incentives tied to this offer. Keep campaign timing context in the campaign details.",
      of: [urgencyReference],
    }),
    defineField({
      name: "scarcity",
      title: "Scarcity",
      type: "array",
      description:
        "Offer-owned limits, caps, or availability constraints for this offer. Campaigns contain and contextualize offers rather than owning scarcity directly.",
      of: [scarcityReference],
    }),
    defineField({
      name: "fulfillmentModel",
      title: "Fulfillment Model",
      type: "reference",
      to: [{ type: "fulfillment" }],
      description:
        "Optional link to the fulfillment model this offer uses. Keep this reference for now; fulfillment documents are still managed separately.",
    }),
    defineField({
      name: "attractionOffer",
      title: "Attraction Offer",
      type: "reference",
      to: [{ type: "subOffer" }],
      description:
        "The lighter front-end or entry-point sub-offer that helps someone first pay attention, say yes, or enter the path toward this core offer.",
    }),
    defineField({
      name: "upsellOffer",
      title: "Upsell Offer",
      type: "reference",
      to: [{ type: "subOffer" }],
      description:
        "The higher-value or next-step sub-offer shown when someone is ready for more depth, speed, scope, or support than the core offer provides.",
    }),
    defineField({
      name: "continuityOffer",
      title: "Continuity Offer",
      type: "reference",
      to: [{ type: "subOffer" }],
      description:
        "The recurring, subscription, retainer, membership, or ongoing support sub-offer that extends the relationship after or alongside the core offer.",
    }),
    defineField({
      name: "downsellOffer",
      title: "Downsell Offer",
      type: "reference",
      to: [{ type: "subOffer" }],
      description:
        "The lighter, lower-commitment fallback sub-offer for someone who is interested but not ready for the main or higher-value path.",
    }),
    orderRankField({ type: "offer" }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "serviceOrProduct",
    },
  },
});
