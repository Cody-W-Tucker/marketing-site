import { defineField, defineType } from "sanity";

export default defineType({
  name: "ctaLink",
  type: "object",
  title: "CTA Link",
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      type: "url",
      title: "URL",
      validation: (Rule) =>
        Rule.required().uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "openInNewTab",
      type: "boolean",
      title: "Open in new tab",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      label: "label",
      href: "href",
    },
    prepare({ label, href }: { label?: string; href?: string }) {
      return {
        title: label || "CTA",
        subtitle: href,
      };
    },
  },
});
