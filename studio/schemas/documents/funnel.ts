// DEPRECATED (V1): `funnel` document type is orphaned — not registered in schema-types.ts and has no references.
// V2 follow-up: confirm no dataset documents of this type exist, then delete this file.
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
