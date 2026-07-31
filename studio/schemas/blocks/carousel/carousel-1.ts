import { defineField, defineType } from "sanity";
import { GalleryHorizontal } from "lucide-react";

// DEPRECATED (V1): `orientation` is still selected by the frontend GROQ query
// but has no schema field and is never consumed by the renderer.
// V2 follow-up: remove `orientation` from the carousel-1 query once usage is confirmed absent, then drop this comment.
export default defineType({
  name: "carousel-1",
  type: "object",
  title: "Carousel 1",
  icon: GalleryHorizontal,
  description: "A carousel of images",
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    defineField({
      name: "size",
      type: "string",
      title: "Size",
      options: {
        list: [
          { title: "One", value: "one" },
          { title: "Two", value: "two" },
          { title: "Three", value: "three" },
        ],
        layout: "radio",
      },
      initialValue: "one",
    }),
    defineField({
      name: "indicators",
      type: "string",
      title: "Slide Indicators",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Dots", value: "dots" },
          { title: "Count", value: "count" },
        ],
        layout: "radio",
      },
      initialValue: "none",
      description: "Choose how to indicate carousel progress and position",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "images.0.alt",
    },
    prepare({ title }) {
      return {
        title: "Carousel",
        subtitle: title,
      };
    },
  },
});
