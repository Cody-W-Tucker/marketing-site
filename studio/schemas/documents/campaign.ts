import { orderRankField } from "@sanity/orderable-document-list";
import {
  defineField,
  defineType,
} from "sanity";

type CampaignDetails = {
  magneticReason?: string;
  avatar?: string;
  goal?: string;
  intervalTime?: string;
  containerType?: string;
};

function isCampaignDetails(value: unknown): value is CampaignDetails {
  return typeof value === "object" && value !== null;
}

function deriveCampaignTitle(campaignDetails: unknown) {
  if (!isCampaignDetails(campaignDetails)) {
    return "";
  }

  const d = campaignDetails;
  const parts: string[] = [];
  if (d.magneticReason?.trim()) parts.push(d.magneticReason.trim());
  if (d.avatar?.trim()) parts.push(`for ${d.avatar.trim()}`);
  if (d.goal?.trim()) parts.push(`to ${d.goal.trim()}`);
  if (d.intervalTime?.trim()) parts.push(`in ${d.intervalTime.trim()}`);
  if (d.containerType?.trim()) parts.push(d.containerType.trim());
  return parts.join(" ");
}

export default defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  description:
    "Campaign-level naming wrapper and offer containment. Use the Magic Name fields to shape the market-facing name, not the underlying offer mechanics. Guarantees, urgency, and scarcity belong on each offer so the conversion mechanics stay attached to what is being sold.",
  fields: [
    defineField({
      name: "campaignDetails",
      title: "Magic Name Wrapper",
      type: "object",
      description:
        "Alex Hormozi's Magic Name formula: choose the 3-5 strongest MAGI(C) name components for the wrapper/name. These fields shape how the offer is named and positioned; they do not define fulfillment, guarantees, urgency, or scarcity.",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "magneticReason",
          title: "Magnet: Magnetic Reason",
          description:
            "The attention-pulling reason someone should care about the named offer. Use the clearest hook, mechanism, novelty, or pain-point magnet that belongs in the name.",
          type: "string",
        }),
        defineField({
          name: "avatar",
          title: "Avatar: Who It Is For",
          description:
            "The specific audience named in the wrapper. Use only if naming the buyer, role, segment, or situation makes the offer feel more relevant.",
          type: "string",
        }),
        defineField({
          name: "goal",
          title: "Goal: Desired Outcome",
          description:
            "The outcome promised or implied by the name. Keep this focused on the result the audience wants, not the internal campaign objective.",
          type: "string",
        }),
        defineField({
          name: "intervalTime",
          title: "Interval: Timeframe",
          description:
            "The timeframe or interval used in the name, such as 'in 30 days' or 'weekly'. Include only when time makes the name more concrete or compelling.",
          type: "string",
        }),
        defineField({
          name: "containerType",
          title: "Container: Format Type",
          description:
            "The named container for the promise, such as challenge, sprint, bootcamp, audit, blueprint, or system. This is the wrapper format, not the full fulfillment model.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "The slug for the campaign, generated from the derived title.",
      type: "slug",
      options: {
        source: (document) => deriveCampaignTitle(document.campaignDetails),
        maxLength: 96,
      },
    }),
    defineField({
      name: "offers",
      title: "Offers",
      type: "array",
      description:
        "The offers contained in this campaign. Configure each offer's guarantees, urgency, and scarcity on the offer itself.",
      of: [{ type: "reference", to: [{ type: "offer" }] }],
    }),
    orderRankField({ type: "campaign" }),
  ],
  preview: {
    select: {
      campaignDetails: "campaignDetails",
      slug: "slug.current",
    },
    prepare({ campaignDetails, slug }) {
      return {
        title: deriveCampaignTitle(campaignDetails),
        subtitle: slug,
      };
    },
  },
});
