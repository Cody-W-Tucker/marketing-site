import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingTestimonialSection",
  type: "object",
  title: "Landing Testimonial Section",
  fields: [
    defineField({
      name: "enabled",
      type: "boolean",
      title: "Enabled",
      initialValue: false,
    }),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      of: [
        defineField({
          type: "reference",
          to: [{ type: "testimonial" }],
        }),
      ],
      validation: (Rule) =>
        Rule.custom((testimonials, context) => {
          const enabled = (context.document as { enabled?: boolean })?.enabled;
          if (enabled && (!testimonials || testimonials.length === 0)) {
            return "At least one testimonial is required when enabled.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      enabled: "enabled",
      testimonials: "testimonials",
    },
    prepare({
      enabled,
      testimonials,
    }: {
      enabled?: boolean;
      testimonials?: unknown[];
    }) {
      const count = testimonials?.length ?? 0;
      return {
        title: enabled ? "Enabled" : "Disabled",
        subtitle: `${count} testimonial${count === 1 ? "" : "s"}`,
      };
    },
  },
});
