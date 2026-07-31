import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import { PortableText } from "@portabletext/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type LandingPage = NonNullable<
  CampaignLandingPageQueryResult
>["landingPage"];

type Sections = NonNullable<LandingPage>["sections"];

type FaqsSection = NonNullable<Sections>["faqs"];

type FaqItem = NonNullable<NonNullable<FaqsSection>["items"]>[number];

type ResolvedFaq = {
  _id: string;
  title?: string;
  body?: NonNullable<FaqItem>["body"];
};

export type FaqsSectionProps = {
  faqs?: FaqsSection;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function isRenderable(item: FaqItem | undefined): item is FaqItem & { title: string } {
  if (!item) return false;
  const title = (item as ResolvedFaq).title;
  return typeof title === "string" && title.trim().length > 0;
}

export default function FaqsSectionComponent({
  faqs,
  enabled = true,
}: FaqsSectionProps) {
  if (!enabled) {
    return null;
  }

  const items = faqs?.items;

  if (!items || items.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[FaqsSection] Section is enabled but no resolved FAQ items exist. Rendering nothing.",
      );
    }
    return null;
  }

  const renderableItems = items.filter(isRenderable) as Array<
    FaqItem & ResolvedFaq
  >;

  if (renderableItems.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[FaqsSection] Section is enabled but no FAQ items have a renderable title. Rendering nothing.",
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {renderableItems.map((item) => (
            <AccordionItem key={item._id} value={item._id}>
              <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline">
                {item.title}
              </AccordionTrigger>
              {item.body && item.body.length > 0 && (
                <AccordionContent className="text-foreground leading-7">
                  <PortableText value={item.body} />
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
