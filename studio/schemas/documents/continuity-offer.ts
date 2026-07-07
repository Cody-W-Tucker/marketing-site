import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import {
  offerRoleNameField,
  offerRolePreview,
  offerRoleSummaryField,
} from "./offer-role-fields";

export default defineType({
  name: "continuityOffer",
  title: "Continuity Offer",
  type: "document",
  description:
    "A recurring, membership, retainer, or ongoing support offer that extends the relationship after or alongside the core offer.",
  fields: [
    offerRoleNameField("Editor-facing name for this continuity offer."),
    offerRoleSummaryField(
      "Short description of the recurring value and why someone should stay engaged.",
    ),
    defineField({
      name: "recurringValue",
      title: "Recurring Value",
      type: "block-content",
      description:
        "The ongoing outcome, support, access, maintenance, improvement, community, or accountability delivered over time.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingCadence",
      title: "Billing Cadence",
      type: "string",
      description:
        "How billing recurs, such as monthly, quarterly, annually, usage-based, or retainer.",
    }),
    defineField({
      name: "commitmentOrCancellation",
      title: "Commitment or Cancellation",
      type: "block-content",
      description:
        "Minimum term, cancellation rules, renewal rules, pause options, or commitment expectations.",
    }),
    defineField({
      name: "renewalOrRetentionBenefits",
      title: "Renewal or Retention Benefits",
      type: "block-content",
      description:
        "Benefits that reward staying, renewing, compounding, continued access, or long-term participation.",
    }),
    defineField({
      name: "onboardingOrContinuityBonus",
      title: "Onboarding or Continuity Bonus",
      type: "block-content",
      description:
        "Setup help, activation bonus, member-only resource, or continuity incentive that helps someone start or stay.",
    }),
    defineField({
      name: "roleAlongsideOrAfterCore",
      title: "Role Alongside or After Core Offer",
      type: "block-content",
      description:
        "Whether this supports implementation during the core offer, follows after it, protects the result, or opens the next relationship stage.",
    }),
    orderRankField({ type: "continuityOffer" }),
  ],
  preview: offerRolePreview("Untitled continuity offer"),
});
