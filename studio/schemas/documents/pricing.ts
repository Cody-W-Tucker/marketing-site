import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "pricing",
  title: "Pricing Model",
  type: "document",
  description:
    "How the offer captures value, frames price against outcomes, and handles discounts without weakening the offer.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Primary buyer-facing price before taxes or optional add-ons.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      description: "ISO currency code used for this price.",
      initialValue: "USD",
      options: {
        list: ["USD", "CAD", "EUR", "GBP"],
      },
      validation: (Rule) => Rule.uppercase().length(3),
    }),
    defineField({
      name: "billingModel",
      title: "Billing Model",
      type: "string",
      description: "How the buyer is charged.",
      options: {
        list: [
          { title: "One-time", value: "oneTime" },
          { title: "Subscription", value: "subscription" },
          { title: "Payment plan", value: "paymentPlan" },
          { title: "Usage-based", value: "usageBased" },
          { title: "Custom quote", value: "customQuote" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "paymentTerms",
      title: "Payment Terms",
      type: "text",
      rows: 3,
      description:
        "Deposit, installment, renewal, cancellation, or invoicing terms that affect the buyer's commitment.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "valueAnchor",
      title: "Value Anchor",
      type: "text",
      rows: 3,
      description:
        "The outcome, avoided cost, alternative, or opportunity this price should be compared against.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "stackedValueEstimate",
      title: "Stacked Value Estimate",
      type: "number",
      description:
        "Optional total estimated value of included components, used only when the stack is credible and specific.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "discountPolicy",
      title: "Discount Policy",
      type: "text",
      rows: 3,
      description:
        "When discounts are allowed, why they are justified, and how to avoid training buyers to wait for price cuts.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "description",
      type: "block-content",
      description:
        "Additional pricing context, value proof, or terms that do not fit the structured fields above.",
    }),
    orderRankField({ type: "pricing" }),
  ],

  preview: {
    select: {
      title: "title",
      price: "price",
      currency: "currency",
    },
    prepare({ title, price, currency }) {
      return {
        title,
        subtitle:
          typeof price === "number" ? `${currency || "USD"} ${price}` : undefined,
      };
    },
  },
});
