import type { CampaignLandingPageQueryResult } from "@/sanity/queries/campaign";
import PortableTextRenderer from "@/components/portable-text-renderer";

type PrimaryOffer = NonNullable<
  NonNullable<CampaignLandingPageQueryResult>["landingPage"]
>["primaryOffer"];

export type FulfillmentModel = NonNullable<PrimaryOffer>["fulfillmentModel"];

export type FulfillmentSectionProps = {
  fulfillmentModel?: FulfillmentModel;
  enabled?: boolean;
};

const IS_DEV = process.env.NODE_ENV === "development";

type Row = {
  key: NonNullable<
    keyof NonNullable<FulfillmentModel>
  >;
  label: string;
  kind: "string" | "stringArray";
};

const ROWS: Row[] = [
  { key: "deliveryFormat", label: "Delivery Format", kind: "string" },
  { key: "scope", label: "Scope", kind: "string" },
  { key: "deliverables", label: "Deliverables", kind: "stringArray" },
  { key: "timeline", label: "Timeline", kind: "string" },
  {
    key: "cadenceOrSupportModel",
    label: "Cadence & Support",
    kind: "string",
  },
  {
    key: "clientResponsibilities",
    label: "Client Responsibilities",
    kind: "stringArray",
  },
  { key: "capacityLimit", label: "Capacity", kind: "string" },
  {
    key: "handoffsOrDependencies",
    label: "Handoffs & Dependencies",
    kind: "stringArray",
  },
  { key: "successCriteria", label: "Success Criteria", kind: "stringArray" },
];

function hasStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.some((v) => typeof v === "string" && v.trim().length > 0);
}

function hasStringValue(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRowPopulated(
  model: NonNullable<FulfillmentModel>,
  row: Row,
): boolean {
  const value = model[row.key];
  return row.kind === "stringArray"
    ? hasStringArray(value)
    : hasStringValue(value);
}

export default function FulfillmentSection({
  fulfillmentModel,
  enabled = true,
}: FulfillmentSectionProps) {
  if (!enabled) {
    return null;
  }

  if (!fulfillmentModel) {
    if (IS_DEV) {
      console.warn(
        "[FulfillmentSection] Section is enabled but fulfillmentModel data is missing. Rendering nothing.",
      );
    }
    return null;
  }

  const title = fulfillmentModel.title?.trim();
  const description = fulfillmentModel.description;
  const populatedRows = ROWS.filter((row) =>
    isRowPopulated(fulfillmentModel, row),
  );

  if (!title && !description && populatedRows.length === 0) {
    if (IS_DEV) {
      console.warn(
        "[FulfillmentSection] Section is enabled but fulfillmentModel has no renderable content (title, description, or rows). Rendering nothing.",
      );
    }
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="space-y-8">
        {title ? (
          <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            {title}
          </h2>
        ) : null}

        {description && description.length > 0 ? (
          <div className="text-foreground">
            <PortableTextRenderer value={description as never} />
          </div>
        ) : null}

        {populatedRows.length > 0 ? (
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {populatedRows.map((row) => {
              const value = fulfillmentModel[row.key];
              return (
                <div
                  key={row.key}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <dt className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="mt-2 text-foreground">
                    {row.kind === "stringArray" ? (
                      <ul className="list-disc space-y-1 pl-5">
                        {(value as string[]).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="break-words">{value as string}</p>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
