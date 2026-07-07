import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "scarcity",
  title: "Scarcity",
  type: "document",
  description:
    "Availability constraints based on real capacity, inventory, cohort size, or access limits.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "scarcityType",
      title: "Scarcity Type",
      type: "string",
      description: "The constraint that limits availability.",
      options: {
        list: [
          { title: "Limited seats", value: "limitedSeats" },
          { title: "Limited inventory", value: "limitedInventory" },
          { title: "Capacity cap", value: "capacityCap" },
          { title: "Application only", value: "applicationOnly" },
          { title: "Limited access", value: "limitedAccess" },
        ],
      },
    }),
    defineField({
      name: "quantityLimit",
      title: "Quantity / Capacity Limit",
      type: "number",
      description:
        "The maximum available quantity, seats, clients, or units when there is a numeric cap.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "capacityBasis",
      title: "Capacity Basis",
      type: "text",
      rows: 2,
      description:
        "Why the cap exists: team bandwidth, cohort quality, inventory, calendar slots, partner limits, or access constraints.",
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "replenishmentRule",
      title: "Replenishment Rule",
      type: "text",
      rows: 2,
      description:
        "When or how availability opens again, if it does.",
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "waitlistBehavior",
      title: "Waitlist Behavior",
      type: "string",
      description: "What happens when the cap is reached.",
      options: {
        list: [
          { title: "No waitlist", value: "none" },
          { title: "Join waitlist", value: "joinWaitlist" },
          { title: "Apply for next opening", value: "applyNext" },
          { title: "Notify when available", value: "notify" },
        ],
      },
    }),
    defineField({
      name: "displayCopy",
      title: "Display Copy",
      type: "text",
      rows: 3,
      description: "Buyer-facing scarcity copy that states the real limit clearly.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "description",
      type: "block-content",
      description:
        "Additional internal context or longer copy for the scarcity mechanism.",
    }),
    orderRankField({ type: "scarcity" }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "scarcityType",
    },
  },
});
