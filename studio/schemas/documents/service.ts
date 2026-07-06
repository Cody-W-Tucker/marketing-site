import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service Model",
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
    orderRankField({ type: "service" }),
  ],

  preview: {
    select: {
      title: "title",
    },
  },
});
