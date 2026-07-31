import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type PrimaryOffer = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>["primaryOffer"];

type PriceModel = NonNullable<PrimaryOffer>["priceModel"];

type FeatureList = NonNullable<PrimaryOffer>["featureList"];

export type PricingSectionProps = {
  priceModel?: PriceModel;
  featureList?: FeatureList;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

function hasStringValue(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export default function PricingSection({
  priceModel,
  featureList,
  enabled = true,
}: PricingSectionProps) {
  if (!enabled) {
    return null;
  }

  if (!priceModel) {
    if (IS_DEV) {
      console.warn(
        "[PricingSection] Section is enabled but priceModel data is missing or empty. Rendering nothing.",
      );
    }
    return null;
  }

  const title = hasStringValue(priceModel.title) ? priceModel.title.trim() : null;
  const price = priceModel.price ?? null;
  const currency = hasStringValue(priceModel.currency)
    ? priceModel.currency.trim()
    : null;
  const billingModel = hasStringValue(priceModel.billingModel)
    ? priceModel.billingModel
    : null;
  const paymentTerms = hasStringValue(priceModel.paymentTerms)
    ? priceModel.paymentTerms
    : null;
  const valueAnchor = hasStringValue(priceModel.valueAnchor)
    ? priceModel.valueAnchor
    : null;
  const stackedValueEstimate =
    priceModel.stackedValueEstimate !== null &&
    priceModel.stackedValueEstimate !== undefined
      ? priceModel.stackedValueEstimate
      : null;
  const discountPolicy = hasStringValue(priceModel.discountPolicy)
    ? priceModel.discountPolicy
    : null;
  const description = priceModel.description;
  const features =
    Array.isArray(featureList) && featureList.length > 0 ? featureList : null;

  if (
    !title &&
    price === null &&
    !billingModel &&
    !paymentTerms &&
    !valueAnchor &&
    stackedValueEstimate === null &&
    !discountPolicy &&
    !description &&
    !features
  ) {
    if (IS_DEV) {
      console.warn(
        "[PricingSection] Section is enabled but priceModel has no renderable content. Rendering nothing.",
      );
    }
    return null;
  }

  const hasPriceDisplay = price !== null || currency;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        {title ? (
          <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            {title}
          </h2>
        ) : null}

        <div className="rounded-lg border border-border bg-card p-6">
          {hasPriceDisplay ? (
            <div className="flex items-baseline gap-2">
              {price !== null ? (
                <span className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {price}
                </span>
              ) : null}
              {currency ? (
                <span className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {currency}
                </span>
              ) : null}
            </div>
          ) : null}

          {billingModel ? (
            <div className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Billing
              </p>
              <p className="mt-1 text-foreground">{billingModel}</p>
            </div>
          ) : null}

          {paymentTerms ? (
            <div className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Payment Terms
              </p>
              <p className="mt-1 text-foreground">{paymentTerms}</p>
            </div>
          ) : null}

          {valueAnchor ? (
            <div className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Value Anchor
              </p>
              <p className="mt-1 text-foreground">{valueAnchor}</p>
            </div>
          ) : null}

          {stackedValueEstimate !== null ? (
            <div className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Stacked Value Estimate
              </p>
              <p className="mt-1 text-foreground">
                {String(stackedValueEstimate)}
              </p>
            </div>
          ) : null}

          {discountPolicy ? (
            <div className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Discount
              </p>
              <p className="mt-1 text-foreground">{discountPolicy}</p>
            </div>
          ) : null}

          {description && description.length > 0 ? (
            <div className="mt-4 text-foreground">
              <PortableTextRenderer value={description as never} />
            </div>
          ) : null}

          {features ? (
            <div className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                What&apos;s Included
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-foreground">
                {features.map((item, index) => (
                  <li key={index}>
                    <PortableTextRenderer value={item as never} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
