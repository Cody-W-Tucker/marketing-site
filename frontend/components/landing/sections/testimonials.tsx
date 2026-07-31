import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import Image from "next/image";

type LandingPage = NonNullable<
  CampaignLandingPageQueryResult
>["landingPage"];

type Sections = NonNullable<LandingPage>["sections"];

type TestimonialsSection = NonNullable<Sections>["testimonials"];

type TestimonialItem = NonNullable<NonNullable<TestimonialsSection>["items"]>[number];

type ResolvedTestimonial = {
  _id: string;
  name?: string;
  role?: string;
  company?: string;
  quote?: string;
  avatar?: string;
};

export type TestimonialsSectionProps = {
  testimonials?: TestimonialsSection;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function isRenderable(
  item: TestimonialItem | undefined,
): item is TestimonialItem & { quote: string } {
  if (!item) return false;
  const quote = (item as ResolvedTestimonial).quote;
  return typeof quote === "string" && quote.trim().length > 0;
}

export default function TestimonialsSectionComponent({
  testimonials,
  enabled = true,
}: TestimonialsSectionProps) {
  if (!enabled) {
    return null;
  }

  const items = testimonials?.items;

  if (!items || items.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[TestimonialsSection] Section is enabled but no resolved testimonial items exist. Rendering nothing.",
      );
    }
    return null;
  }

  const renderableItems = items.filter(isRenderable) as Array<
    TestimonialItem & ResolvedTestimonial
  >;

  if (renderableItems.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[TestimonialsSection] Section is enabled but no testimonial items have a renderable quote. Rendering nothing.",
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          What Our Clients Are Saying
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {renderableItems.map((item) => (
            <TestimonialCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  item,
}: {
  item: TestimonialItem & ResolvedTestimonial;
}) {
  const name = item.name?.trim();
  const role = item.role?.trim();
  const company = item.company?.trim();
  const avatar = item.avatar?.trim();

  const attribution = [name, role, company].filter(Boolean).join(", ");

  return (
    <figure className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
      <blockquote className="flex-1 space-y-4">
        <p className="text-foreground leading-7 break-words">
          <span className="text-2xl leading-none text-muted-foreground">"</span>
          {item.quote}
          <span className="text-2xl leading-none text-muted-foreground">"</span>
        </p>
      </blockquote>

      {(attribution || avatar) ? (
        <figcaption className="mt-6 flex items-center gap-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={name ? `${name} avatar` : "Testimonial avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
              sizes="40px"
            />
          ) : null}
          {attribution ? (
            <div className="text-sm">
              {name ? (
                <p className="font-medium text-foreground">{name}</p>
              ) : null}
              {role || company ? (
                <p className="text-muted-foreground">
                  {[role, company].filter(Boolean).join(", ")}
                </p>
              ) : null}
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
