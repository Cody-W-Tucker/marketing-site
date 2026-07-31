import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingFaqSection",
  type: "object",
  title: "FAQs Section",
  fields: [
    defineField({
      name: "enabled",
      type: "boolean",
      title: "Enabled",
      initialValue: false,
    }),
    defineField({
      name: "faqs",
      type: "array",
      title: "FAQs",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const { parent } = context;
          if (parent?.enabled && (!value || value.length === 0)) {
            return "At least one FAQ is required when this section is enabled.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      enabled: "enabled",
      count: "faqs.length",
    },
    prepare({
      enabled,
      count,
    }: {
      enabled?: boolean;
      count?: number;
    }) {
      return {
        title: enabled ? `FAQs (${count ?? 0} selected)` : `FAQs (disabled)`,
      };
    },
  },
});
