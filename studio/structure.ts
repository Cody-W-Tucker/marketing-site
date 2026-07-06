import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  Files,
  BookA,
  User,
  ListCollapse,
  Quote,
  Megaphone,
  BadgeCheck,
  ShoppingBag,
  Hourglass,
  Clock,
  Menu,
  Settings,
  Funnel,
  Monitor,
  CreditCard,
} from "lucide-react";

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
    .items([
      orderableDocumentListDeskItem({
        type: "page",
        title: "Pages",
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title("Posts")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Post")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]), // Default ordering
        ),
      orderableDocumentListDeskItem({
        type: "category",
        title: "Categories",
        icon: BookA,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "author",
        title: "Authors",
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "faq",
        title: "FAQs",
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "testimonial",
        title: "Testimonials",
        icon: Quote,
        S,
        context,
      }),
      S.divider({ title: "Marketing" }),
      orderableDocumentListDeskItem({
        type: "campaign",
        title: "Campaigns",
        icon: Megaphone,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "offer",
        title: "Offers",
        icon: ShoppingBag,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "guarantees",
        title: "Guarantees",
        icon: BadgeCheck,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "scarcity",
        title: "Scarcity",
        icon: Hourglass,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "urgency",
        title: "Urgency",
        icon: Clock,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "funnel",
        title: "Funnels",
        icon: Funnel,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "pricing",
        title: "Pricing",
        icon: CreditCard,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "service",
        title: "Service Descriptions",
        icon: Monitor,
        S,
        context,
      }),
      S.divider({ title: "Global" }),
      S.listItem()
        .title("Navigation")
        .icon(Menu)
        .child(
          S.editor()
            .id("navigation")
            .schemaType("navigation")
            .documentId("navigation"),
        ),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("settings"),
        ),
    ]);
