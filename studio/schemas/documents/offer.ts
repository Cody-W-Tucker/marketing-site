import { orderRankField } from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

const bonusOfferReference = defineArrayMember({
  type: "reference",
  to: [{ type: "bonusOffer" }],
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
    "A core sellable offer. Use role-specific offer references for supporting bonuses, entry points, upsells, continuity paths, and downsells around this main offer.",
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
          type: "block-content",
          description:
            "The concrete result the buyer wants most from this offer.",
          validation: (Rule) => Rule.max(300),
        }),
        defineField({
          name: "perceivedLikelihood",
          title: "Perceived Likelihood of Success",
          type: "block-content",
          description:
            "Why the buyer should believe they can actually get the outcome.",
          validation: (Rule) => Rule.max(300),
        }),
        defineField({
          name: "timeDelay",
          title: "Time Delay",
          type: "block-content",
          description:
            "How quickly the buyer can expect progress, proof, or the full result.",
          validation: (Rule) => Rule.max(240),
        }),
        defineField({
          name: "effortAndSacrifice",
          title: "Effort & Sacrifice",
          type: "block-content",
          description:
            "What the buyer must do, give up, learn, or endure to succeed—and how the offer reduces that burden.",
          validation: (Rule) => Rule.max(240),
        }),
      ],
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
      name: "bonus",
      title: "Bonus Offers",
      type: "array",
      description:
        "Bonus offers that increase the value or confidence of this core offer without becoming the main thing being sold.",
      of: [bonusOfferReference],
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
      name: "attractionOffer",
      title: "Attraction Offer",
      type: "reference",
      to: [{ type: "attractionOffer" }],
      description:
        "The lighter front-end or entry-point offer that helps someone first pay attention, say yes, or enter the path toward this core offer.",
    }),
    defineField({
      name: "upsellOffer",
      title: "Upsell Offer",
      type: "reference",
      to: [{ type: "upsellOffer" }],
      description:
        "The higher-value or next-step offer shown when someone is ready for more depth, speed, scope, or support than the core offer provides.",
    }),
    defineField({
      name: "continuityOffer",
      title: "Continuity Offer",
      type: "reference",
      to: [{ type: "continuityOffer" }],
      description:
        "The recurring, subscription, retainer, membership, or ongoing support offer that extends the relationship after or alongside the core offer.",
    }),
    defineField({
      name: "downsellOffer",
      title: "Downsell Offer",
      type: "reference",
      to: [{ type: "downsellOffer" }],
      description:
        "The lighter, lower-commitment fallback offer for someone who is interested but not ready for the main or higher-value path.",
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
