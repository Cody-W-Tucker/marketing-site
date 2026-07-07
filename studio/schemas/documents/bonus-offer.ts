import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import {
  offerRoleNameField,
  offerRolePreview,
  offerRoleSummaryField,
} from "./offer-role-fields";

export default defineType({
  name: "bonusOffer",
  title: "Bonus Offer",
  type: "document",
  description:
    "A value-add offer that removes objections or increases perceived value after the core offer price is understood.",
  fields: [
    offerRoleNameField(
      "Editor-facing name for this bonus. Keep it specific enough to recognize when attaching it to a core offer.",
    ),
    offerRoleSummaryField(
      "Short description of the bonus and why it makes the core offer easier to buy.",
    ),
    defineField({
      name: "objectionSolved",
      title: "Objection Solved",
      type: "block-content",
      description:
        "The buyer hesitation, missing belief, implementation concern, or risk this bonus removes.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promisedOutcome",
      title: "Promised Outcome",
      type: "text",
      rows: 3,
      description:
        "The specific result, confidence, speed, or ease this bonus helps create.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "block-content",
      description:
        "Concrete assets, services, templates, access, support, or implementation help included in the bonus.",
    }),
    defineField({
      name: "perceivedValue",
      title: "Perceived Value",
      type: "text",
      rows: 2,
      description:
        "How the value should be framed, including standalone value, replacement cost, time saved, or confidence gained.",
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "exclusivityOrTrigger",
      title: "Exclusivity or Trigger",
      type: "block-content",
      description:
        "When this bonus applies, who gets it, and any deadline, condition, cohort, or purchase trigger.",
    }),
    defineField({
      name: "coreOfferRelationship",
      title: "Relationship to Core Offer",
      type: "block-content",
      description:
        "How this bonus supports the main promise without duplicating or replacing the core offer.",
    }),
    orderRankField({ type: "bonusOffer" }),
  ],
  preview: offerRolePreview("Untitled bonus offer"),
});
