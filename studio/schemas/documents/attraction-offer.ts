import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import {
  offerRoleNameField,
  offerRolePreview,
  offerRoleSummaryField,
} from "./offer-role-fields";

export default defineType({
  name: "attractionOffer",
  title: "Attraction Offer",
  type: "document",
  description:
    "A front-end entry offer or hook that creates an easy first yes before the core offer.",
  fields: [
    offerRoleNameField(
      "Editor-facing name for this attraction offer or entry hook.",
    ),
    offerRoleSummaryField(
      "Short description of the entry offer and the first yes it creates.",
    ),
    defineField({
      name: "audience",
      title: "Audience",
      type: "block-content",
      description:
        "The segment, awareness stage, pain point, or buying context this entry offer is built for.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entryMechanism",
      title: "Entry Mechanism",
      type: "block-content",
      description:
        "The hook, lead magnet, low-ticket offer, event, call, quiz, audit, or other mechanism that gets someone started.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "easyYesReason",
      title: "What Makes It Easy to Say Yes",
      type: "block-content",
      description:
        "Why this feels low-friction, immediately useful, relevant, safe, or worth trying now.",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "string",
      description:
        "The action someone should take to enter this path, such as download, register, book, buy, or start.",
    }),
    defineField({
      name: "urgencyOrRiskReversal",
      title: "Urgency or Risk Reversal",
      type: "block-content",
      description:
        "The reason to act now, guarantee, trial, low-risk promise, or reassurance that reduces hesitation.",
    }),
    defineField({
      name: "bridgeToCoreOffer",
      title: "Bridge to Core Offer",
      type: "block-content",
      description:
        "How this entry offer naturally leads toward the core offer, including the next belief, problem, or decision it opens.",
    }),
    orderRankField({ type: "attractionOffer" }),
  ],
  preview: offerRolePreview("Untitled attraction offer"),
});
