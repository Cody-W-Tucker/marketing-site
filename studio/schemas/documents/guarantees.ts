import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "guarantees",
  title: "Guarantees",
  type: "document",
  description:
    "Risk reversal promises that increase trust without creating vague or unlimited commitments.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "guaranteeType",
      title: "Guarantee Type",
      type: "string",
      description: "The primary kind of risk being reversed.",
      options: {
        list: [
          { title: "Money-back", value: "moneyBack" },
          { title: "Outcome", value: "outcome" },
          { title: "Satisfaction", value: "satisfaction" },
          { title: "Service level", value: "serviceLevel" },
          { title: "Try before commitment", value: "trial" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promise",
      title: "Promise",
      type: "text",
      rows: 3,
      description:
        "The clear buyer-facing commitment. Make it specific enough to be believable.",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "conditions",
      title: "Conditions",
      type: "text",
      rows: 3,
      description:
        "What must be true for the guarantee to apply, stated plainly.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "buyerRequirements",
      title: "Buyer Requirements",
      type: "text",
      rows: 3,
      description:
        "Actions, participation, documentation, or timelines required from the buyer.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "remedy",
      title: "Remedy",
      type: "text",
      rows: 3,
      description:
        "What the buyer receives if the promise is not met: refund, rework, credit, extension, or other remedy.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "claimWindowDays",
      title: "Claim Window (Days)",
      type: "number",
      description: "Number of days the buyer has to make a valid claim.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "exclusions",
      title: "Exclusions",
      type: "text",
      rows: 3,
      description:
        "Clear limits that prevent the guarantee from promising more than the business can responsibly honor.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "riskReversed",
      title: "Risk Reversed",
      type: "text",
      rows: 2,
      description:
        "The buyer fear this guarantee reduces, such as wasted money, poor fit, slow results, or failed implementation.",
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "description",
      type: "block-content",
      description:
        "Additional guarantee explanation or legal/editorial copy beyond the structured promise and limits.",
    }),
    orderRankField({ type: "guarantees" }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "guaranteeType",
    },
  },
});
