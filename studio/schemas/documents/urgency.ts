import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "urgency",
  title: "Urgency",
  type: "document",
  description:
    "Time-based reasons to act now. Use only when the timing is real and explainable.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "urgencyType",
      title: "Urgency Type",
      type: "string",
      description: "The timing mechanism behind the urgency.",
      options: {
        list: [
          { title: "Deadline", value: "deadline" },
          { title: "Enrollment window", value: "enrollmentWindow" },
          { title: "Bonus expires", value: "bonusExpires" },
          { title: "Price changes", value: "priceChange" },
          { title: "Event/date driven", value: "eventDriven" },
        ],
      },
    }),
    defineField({
      name: "isEvergreen",
      title: "Evergreen",
      type: "boolean",
      description:
        "Use when urgency is triggered per buyer or cycle rather than tied to one fixed public date.",
      initialValue: false,
    }),
    defineField({
      name: "startsAt",
      title: "Starts At",
      type: "datetime",
      description: "When this urgency window begins, if publicly fixed.",
    }),
    defineField({
      name: "endsAt",
      title: "Ends At",
      type: "datetime",
      description: "When this urgency window ends, if publicly fixed.",
    }),
    defineField({
      name: "expiringElement",
      title: "Expiring Element",
      type: "string",
      description:
        "What the buyer loses or sees change after the window closes.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "reasonWhyNow",
      title: "Reason Why Now",
      type: "text",
      rows: 3,
      description:
        "The honest explanation for the timing, so urgency feels grounded rather than manufactured.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "displayCopy",
      title: "Display Copy",
      type: "text",
      rows: 3,
      description: "Buyer-facing urgency copy for the page or campaign.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "description",
      type: "block-content",
      description:
        "Additional internal context or longer copy for this urgency mechanism.",
    }),
    orderRankField({ type: "urgency" }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "urgencyType",
    },
  },
});
