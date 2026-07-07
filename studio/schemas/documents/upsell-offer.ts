import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import {
  offerRoleNameField,
  offerRolePreview,
  offerRoleSummaryField,
} from "./offer-role-fields";

export default defineType({
  name: "upsellOffer",
  title: "Upsell Offer",
  type: "document",
  description:
    "A next-step, higher-value offer presented after an initial yes when the buyer wants more scope, speed, or support.",
  fields: [
    offerRoleNameField("Editor-facing name for this upsell offer."),
    offerRoleSummaryField(
      "Short description of the higher-value path and why it is the right next step.",
    ),
    defineField({
      name: "prerequisiteOrCoreRelationship",
      title: "Prerequisite or Core Relationship",
      type: "block-content",
      description:
        "What someone has already bought, chosen, completed, or believed before this upsell is appropriate.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addedScopeSpeedSupport",
      title: "Added Scope, Speed, or Support",
      type: "block-content",
      description:
        "The expanded deliverables, faster result, deeper service, more access, or higher-touch support this upsell adds.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "triggerPoint",
      title: "Trigger Point",
      type: "block-content",
      description:
        "When the upsell should be presented, such as checkout, onboarding, post-purchase, milestone, usage limit, or sales call moment.",
    }),
    defineField({
      name: "decisionFraming",
      title: "Decision Framing",
      type: "block-content",
      description:
        "How to frame the choice so it feels like the logical next level, not pressure or random expansion.",
    }),
    defineField({
      name: "priceDelta",
      title: "Price Delta",
      type: "text",
      rows: 2,
      description:
        "How the price changes relative to the core offer, including upgrade amount, higher tier, add-on fee, or value justification.",
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "timing",
      title: "Timing",
      type: "text",
      rows: 2,
      description:
        "How long the upsell is available and when fulfillment begins relative to the initial purchase.",
      validation: (Rule) => Rule.max(240),
    }),
    orderRankField({ type: "upsellOffer" }),
  ],
  preview: offerRolePreview("Untitled upsell offer"),
});
