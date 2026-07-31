import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingSectionToggle",
  type: "object",
  title: "Landing Section Toggle",
  fields: [
    defineField({
      name: "enabled",
      type: "boolean",
      title: "Enabled",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      enabled: "enabled",
    },
    prepare({ enabled }: { enabled?: boolean }) {
      return {
        title: enabled ? "Enabled" : "Disabled",
      };
    },
  },
});
