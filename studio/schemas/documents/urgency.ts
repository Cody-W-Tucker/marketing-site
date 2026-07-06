import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "urgency",
  title: "Urgency",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "block-content",
    }),
    orderRankField({ type: "urgency" }),
  ],

  preview: {
    select: {
      title: "title",
    },
  },
});
