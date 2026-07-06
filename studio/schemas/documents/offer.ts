import { orderRankField } from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

const offerReference = defineArrayMember({
  type: "reference",
  to: [{ type: "offer" }],
});

const funnelReference = defineArrayMember({
  type: "reference",
  to: [{ type: "funnel" }],
});

export default defineType({
  name: "offer",
  title: "Offer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "serviceOrProduct",
      title: "Service or Product",
      type: "block-content",
    }),
    defineField({
      name: "bonus",
      title: "Bonus",
      type: "array",
      of: [offerReference],
    }),
    defineField({
      name: "featureList",
      title: "Feature List",
      type: "block-content",
    }),
    defineField({
      name: "priceModel",
      title: "Price Model",
      type: "reference",
      to: [{ type: "pricing" }],
    }),
    defineField({
      name: "serviceModel",
      title: "Service Model",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "packages",
      type: "object",
      fields: [
        defineField({
          name: "attraction",
          type: "array",
          of: [funnelReference],
        }),
        defineField({
          name: "upsell",
          type: "array",
          of: [funnelReference],
        }),
        defineField({
          name: "continuity",
          type: "array",
          of: [funnelReference],
        }),
        defineField({
          name: "downSell",
          title: "Down Sell",
          type: "array",
          of: [funnelReference],
        }),
      ],
    }),
    orderRankField({ type: "offer" }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "serviceOrProduct",
    },
  },
});
