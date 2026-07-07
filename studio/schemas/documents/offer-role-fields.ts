import { defineField } from "sanity";

export const offerRoleNameField = (description: string) =>
  defineField({
    name: "name",
    title: "Name",
    type: "string",
    description,
    validation: (Rule) => Rule.required(),
  });

export const offerRoleSummaryField = (description: string) =>
  defineField({
    name: "summary",
    title: "Summary",
    type: "text",
    rows: 3,
    description,
    validation: (Rule) => Rule.max(300),
  });

export const offerRolePreview = (fallbackTitle: string) => ({
  select: {
    title: "name",
    subtitle: "summary",
  },
  prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
    return {
      title: title ?? fallbackTitle,
      subtitle,
    };
  },
});
