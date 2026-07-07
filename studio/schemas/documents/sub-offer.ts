import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const roleOptions = [
  { title: "Bonus", value: "bonus" },
  { title: "Attraction", value: "attraction" },
  { title: "Upsell", value: "upsell" },
  { title: "Continuity", value: "continuity" },
  { title: "Downsell", value: "downsell" },
];

const statusOptions = [
  { title: "Draft", value: "draft" },
  { title: "Active", value: "active" },
  { title: "Retired", value: "retired" },
];

export default defineType({
  name: "subOffer",
  title: "Sub-offer",
  type: "document",
  description:
    "A lighter reusable offer component used around a core offer: bonuses, entry points, upsells, continuity paths, or fallback options. Use it to solve objections, increase confidence, reduce effort, or add value without discounting the core offer.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "Editor-facing name for this sub-offer. Keep it specific enough to recognize when selecting it from an offer.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description:
        "The slot this sub-offer is designed to fill in relation to a core offer. This helps editors choose the right item for bonuses, entry offers, next steps, continuity, or fallback paths.",
      options: {
        list: roleOptions,
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "text",
      rows: 3,
      description:
        "Explain the value job this sub-offer does for the buyer and the main offer. For example: solve a concern, increase confidence, create an easy first yes, shorten time to value, deepen support, or preserve a lighter path.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatItIncludes",
      title: "What It Includes",
      type: "text",
      rows: 4,
      description:
        "List the concrete deliverables, assets, services, access, or promises included. Keep this lighter than the main offer detail.",
    }),
    defineField({
      name: "whenPresented",
      title: "When Presented",
      type: "text",
      rows: 3,
      description:
        "Describe when someone sees this sub-offer in the journey, checkout flow, campaign, sales conversation, or renewal path.",
    }),
    defineField({
      name: "differenceFromCoreOffer",
      title: "Difference From Core Offer",
      type: "text",
      rows: 3,
      description:
        "Clarify how this differs from the main offer so editors do not accidentally duplicate the core promise, scope, or pricing logic.",
    }),
    defineField({
      name: "pricingNote",
      title: "Pricing Note",
      type: "text",
      rows: 2,
      description:
        "Optional pricing guidance for this sub-offer, such as included bonus, one-time add-on, recurring support, or priced separately. Avoid making the sub-offer rely on discounting as its main value.",
    }),
    defineField({
      name: "ctaOrNextStep",
      title: "CTA or Next Step",
      type: "string",
      description:
        "The intended action after this sub-offer is shown, such as add to cart, book a call, continue to checkout, subscribe, or choose the lighter option.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description:
        "Editorial readiness for reuse. Draft sub-offers are still being shaped; active sub-offers are ready to attach to offers; retired sub-offers should not be selected for new work.",
      options: {
        list: statusOptions,
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "problemOrObjectionSolved",
      title: "Problem or Objection Solved",
      type: "text",
      rows: 3,
      description:
        "The buyer hesitation, missing belief, effort, time delay, or implementation risk this sub-offer reduces.",
      validation: (Rule) => Rule.max(500),
    }),
    orderRankField({ type: "subOffer" }),
  ],
  preview: {
    select: {
      title: "name",
      role: "role",
      status: "status",
    },
    prepare({
      title,
      role,
      status,
    }: {
      title?: string;
      role?: string;
      status?: string;
    }) {
      const roleTitle = roleOptions.find(
        (option) => option.value === role,
      )?.title;
      const statusTitle = statusOptions.find(
        (option) => option.value === status,
      )?.title;

      return {
        title: title ?? "Untitled sub-offer",
        subtitle: [roleTitle, statusTitle].filter(Boolean).join(" • "),
      };
    },
  },
});
