import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  fields: [
    defineField({
      name: "campaignDetails",
      title: "Magic Name",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "magneticReason",
          title: "Magnetic Reason",
          description:
            "The compelling factor that draws the audience's attention and interest towards the campaign.",
          type: "string",
        }),
        defineField({
          name: "avatar",
          title: "Avatar",
          description: "The target audience or customer persona.",
          type: "string",
        }),
        defineField({
          name: "goal",
          title: "Goal",
          description:
            "The primary objective or desired outcome of the campaign.",
          type: "string",
        }),
        defineField({
          name: "intervalTime",
          title: "Interval Time",
          description:
            "The time interval for the campaign's activities or events.",
          type: "string",
        }),
        defineField({
          name: "containerType",
          title: "Container Type",
          description:
            "The format or structure in which the outcome is delivered.",
          type: "string",
        }),
      ],
      preview: {
        select: {
          magneticReason: "magneticReason",
          avatar: "avatar",
          goal: "goal",
          intervalTime: "intervalTime",
          containerType: "containerType",
        },
        prepare({ magneticReason, avatar, goal, intervalTime, containerType }) {
          return {
            title: [magneticReason, avatar, goal, intervalTime, containerType]
              .filter(Boolean)
              .join(" - "),
          };
        },
      },
    }),
    defineField({
      name: "offers",
      title: "Offers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "offer" }] }],
    }),
    defineField({
      name: "urgency",
      title: "Urgency",
      type: "array",
      of: [{ type: "reference", to: [{ type: "urgency" }] }],
    }),
    defineField({
      name: "scarcity",
      title: "Scarcity",
      type: "array",
      of: [{ type: "reference", to: [{ type: "scarcity" }] }],
    }),
    defineField({
      name: "guarantees",
      title: "Guarantees",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guarantees" }] }],
    }),
    orderRankField({ type: "campaign" }),
  ],
});
