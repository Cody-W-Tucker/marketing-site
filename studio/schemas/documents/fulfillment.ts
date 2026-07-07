import { orderRankField } from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "fulfillment",
  title: "Fulfillment Model",
  type: "document",
  description:
    "A fulfillment model an offer can use: what gets done, how support is provided, and how delivery reduces time delay, lowers effort, and increases likelihood of success.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Name the fulfillment model, not the market-facing offer or campaign.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deliveryFormat",
      title: "Delivery Format",
      type: "string",
      description:
        "How the work is delivered in practice: done-for-you, done-with-you, cohort, async review, live sessions, self-serve portal, hybrid, or another clear operating format.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "text",
      rows: 4,
      description:
        "Define the boundaries of what fulfillment includes and excludes. Write this so the operator knows what to do, what not to absorb, and which parts of the buyer's effort are reduced.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      description:
        "Concrete outputs the client receives. Add one deliverable per item so the fulfillment promise can be reviewed and operated.",
      of: [
        defineArrayMember({
          title: "Deliverable",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      description:
        "Expected delivery window or phases, such as '10 business days', '6-week cohort', or 'monthly cycle'. Use this to make time-to-value and operating rhythm clear.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cadenceOrSupportModel",
      title: "Cadence or Support Model",
      type: "text",
      rows: 3,
      description:
        "How and when support happens: calls, async feedback, office hours, Slack access, review cycles, escalation paths, and expected response windows.",
    }),
    defineField({
      name: "clientResponsibilities",
      title: "Client Responsibilities",
      type: "array",
      description:
        "Inputs, access, decisions, approvals, prep work, or participation the client must provide for fulfillment to succeed. Keep this honest so effort and sacrifice are not hidden.",
      of: [
        defineArrayMember({
          title: "Responsibility",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "capacityLimit",
      title: "Capacity Limit",
      type: "string",
      description:
        "Operational limits that protect delivery quality: seats per cohort, clients per month, review volume, turnaround limits, or team constraints.",
    }),
    defineField({
      name: "handoffsOrDependencies",
      title: "Handoffs or Dependencies",
      type: "array",
      description:
        "Dependencies that must happen before or during fulfillment, including intake forms, sales handoff notes, assets, account access, third-party tools, or internal team steps.",
      of: [
        defineArrayMember({
          title: "Dependency",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "successCriteria",
      title: "Success Criteria",
      type: "array",
      description:
        "Observable signs that fulfillment worked. Use concrete completion, quality, outcome, or adoption criteria that raise confidence in the buyer's likelihood of success.",
      of: [
        defineArrayMember({
          title: "Criterion",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Overview Notes",
      type: "block-content",
      description:
        "Optional richer notes for context that does not fit the structured fields. Do not use this as a replacement for scope, deliverables, timeline, responsibilities, or success criteria tied to the value equation.",
    }),
    orderRankField({ type: "fulfillment" }),
  ],

  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Fulfillment model",
      };
    },
  },
});
