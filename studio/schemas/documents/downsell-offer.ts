import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import {
  offerRoleNameField,
  offerRolePreview,
  offerRoleSummaryField,
} from "./offer-role-fields";

export default defineType({
  name: "downsellOffer",
  title: "Downsell Offer",
  type: "document",
  description:
    "A fallback offer presented after a no, preserving a useful lower-commitment path without discounting the original promise into confusion.",
  fields: [
    offerRoleNameField("Editor-facing name for this downsell offer."),
    offerRoleSummaryField(
      "Short description of the fallback path and the reason it exists.",
    ),
    defineField({
      name: "changedFromOriginalOffer",
      title: "What Changed From Original Offer",
      type: "block-content",
      description:
        "What is different from the original offer, such as scope, support, access, timing, payment structure, or commitment.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fallbackReasonOrObjection",
      title: "Fallback Reason or Objection",
      type: "block-content",
      description:
        "The reason for the no that this downsell is designed to address, such as budget, readiness, trust, time, or fit.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reducedScopeOrPaymentFlexibility",
      title: "Reduced Scope or Payment Flexibility",
      type: "block-content",
      description:
        "The smaller scope, lower-touch path, payment option, limited version, or phased approach that makes this easier to accept.",
    }),
    defineField({
      name: "trialOrPaymentPlanTerms",
      title: "Trial or Payment-plan Terms",
      type: "block-content",
      description:
        "Any trial, pilot, deposit, payment plan, delayed start, cancellation, or conversion terms attached to this fallback.",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "string",
      description:
        "The action someone should take to choose the fallback path, such as start smaller, try first, split payments, or book a fit call.",
    }),
    orderRankField({ type: "downsellOffer" }),
  ],
  preview: offerRolePreview("Untitled downsell offer"),
});
