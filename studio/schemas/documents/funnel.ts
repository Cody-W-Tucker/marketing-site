import { defineField, defineType } from "sanity";

export default defineType({
  name: "funnel",
  title: "Funnel",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "block-content",
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
