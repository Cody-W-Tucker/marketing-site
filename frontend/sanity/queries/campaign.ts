import { groq } from "next-sanity";

type RichTextBlock = {
  _type: string;
  [key: string]: unknown;
};

type RichTextValue = RichTextBlock[] | null;

export type CampaignDetails = {
  magneticReason?: string;
  avatar?: string;
  goal?: string;
  intervalTime?: string;
  containerType?: string;
};

export function deriveCampaignTitle(
  campaignDetails?: CampaignDetails | null,
): string {
  if (!campaignDetails) return "";

  const d = campaignDetails;
  const parts: string[] = [];
  if (d.magneticReason?.trim()) parts.push(d.magneticReason.trim());
  if (d.avatar?.trim()) parts.push(`for ${d.avatar.trim()}`);
  if (d.goal?.trim()) parts.push(`to ${d.goal.trim()}`);
  if (d.intervalTime?.trim()) parts.push(`in ${d.intervalTime.trim()}`);
  if (d.containerType?.trim()) parts.push(d.containerType.trim());
  return parts.join(" ");
}

type PricingModel = {
  title?: string;
  price?: number;
  currency?: string;
  billingModel?: string;
  paymentTerms?: string;
  valueAnchor?: string;
  stackedValueEstimate?: number;
  discountPolicy?: string;
  description?: RichTextValue;
} | null;

type FulfillmentModel = {
  title?: string;
  deliveryFormat?: string;
  scope?: string;
  deliverables?: string[];
  timeline?: string;
  cadenceOrSupportModel?: string;
  clientResponsibilities?: string[];
  capacityLimit?: string;
  handoffsOrDependencies?: string[];
  successCriteria?: string[];
  description?: RichTextValue;
} | null;

type BonusOffer = {
  _id: string;
  name?: string;
  summary?: string;
  objectionSolved?: RichTextValue;
  promisedOutcome?: string;
  deliverables?: RichTextValue;
  perceivedValue?: string;
  exclusivityOrTrigger?: RichTextValue;
  coreOfferRelationship?: RichTextValue;
};

type Guarantee = {
  _id: string;
  title?: string;
  guaranteeType?: string;
  promise?: string;
  conditions?: string;
  buyerRequirements?: string;
  remedy?: string;
  claimWindowDays?: number;
  exclusions?: string;
  riskReversed?: string;
  description?: RichTextValue;
};

type Urgency = {
  _id: string;
  title?: string;
  urgencyType?: string;
  isEvergreen?: boolean;
  startsAt?: string;
  endsAt?: string;
  expiringElement?: string;
  reasonWhyNow?: string;
  displayCopy?: string;
  description?: RichTextValue;
};

type Scarcity = {
  _id: string;
  title?: string;
  scarcityType?: string;
  quantityLimit?: number;
  capacityBasis?: string;
  replenishmentRule?: string;
  waitlistBehavior?: string;
  displayCopy?: string;
  description?: RichTextValue;
};

type AttractionOffer = {
  _id: string;
  name?: string;
  summary?: string;
  audience?: RichTextValue;
  entryMechanism?: RichTextValue;
  easyYesReason?: RichTextValue;
  cta?: string;
  urgencyOrRiskReversal?: RichTextValue;
  bridgeToCoreOffer?: RichTextValue;
} | null;

type UpsellOffer = {
  _id: string;
  name?: string;
  summary?: string;
  prerequisiteOrCoreRelationship?: RichTextValue;
  addedScopeSpeedSupport?: RichTextValue;
  triggerPoint?: RichTextValue;
  decisionFraming?: RichTextValue;
  priceDelta?: string;
  timing?: string;
} | null;

type ContinuityOffer = {
  _id: string;
  name?: string;
  summary?: string;
  recurringValue?: RichTextValue;
  billingCadence?: string;
  commitmentOrCancellation?: RichTextValue;
  renewalOrRetentionBenefits?: RichTextValue;
  onboardingOrContinuityBonus?: RichTextValue;
  roleAlongsideOrAfterCore?: RichTextValue;
} | null;

type DownsellOffer = {
  _id: string;
  name?: string;
  summary?: string;
  changedFromOriginalOffer?: RichTextValue;
  fallbackReasonOrObjection?: RichTextValue;
  reducedScopeOrPaymentFlexibility?: RichTextValue;
  trialOrPaymentPlanTerms?: string;
  cta?: string;
} | null;

type Offer = {
  _id: string;
  name?: string;
  valueEquation?: {
    dreamOutcome?: RichTextValue;
    perceivedLikelihood?: RichTextValue;
    timeDelay?: RichTextValue;
    effortAndSacrifice?: RichTextValue;
  };
  fulfillmentModel?: FulfillmentModel;
  bonus?: BonusOffer[];
  featureList?: RichTextValue;
  priceModel?: PricingModel;
  guarantees?: Guarantee[];
  urgency?: Urgency[];
  scarcity?: Scarcity[];
  attractionOffer?: AttractionOffer;
  upsellOffer?: UpsellOffer;
  continuityOffer?: ContinuityOffer;
  downsellOffer?: DownsellOffer;
};

export type CampaignLandingPageQueryResult = {
  _id: string;
  slug?: string;
  campaignDetails?: CampaignDetails;
  offers?: Offer[];
} | null;

export type CampaignSlugsQueryResult = { slug?: { current?: string } | null }[];

export const CAMPAIGN_LANDING_PAGE_QUERY = groq`
  *[_type == "campaign" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    campaignDetails{
      magneticReason,
      avatar,
      goal,
      intervalTime,
      containerType
    },
    offers[]->{
      _id,
      name,
      valueEquation{
        dreamOutcome,
        perceivedLikelihood,
        timeDelay,
        effortAndSacrifice
      },
      fulfillmentModel->{
        title,
        deliveryFormat,
        scope,
        deliverables,
        timeline,
        cadenceOrSupportModel,
        clientResponsibilities,
        capacityLimit,
        handoffsOrDependencies,
        successCriteria,
        description
      },
      bonus[]->{
        _id,
        name,
        summary,
        objectionSolved,
        promisedOutcome,
        deliverables,
        perceivedValue,
        exclusivityOrTrigger,
        coreOfferRelationship
      },
      featureList,
      priceModel->{
        title,
        price,
        currency,
        billingModel,
        paymentTerms,
        valueAnchor,
        stackedValueEstimate,
        discountPolicy,
        description
      },
      guarantees[]->{
        _id,
        title,
        guaranteeType,
        promise,
        conditions,
        buyerRequirements,
        remedy,
        claimWindowDays,
        exclusions,
        riskReversed,
        description
      },
      urgency[]->{
        _id,
        title,
        urgencyType,
        isEvergreen,
        startsAt,
        endsAt,
        expiringElement,
        reasonWhyNow,
        displayCopy,
        description
      },
      scarcity[]->{
        _id,
        title,
        scarcityType,
        quantityLimit,
        capacityBasis,
        replenishmentRule,
        waitlistBehavior,
        displayCopy,
        description
      },
      attractionOffer->{
        _id,
        name,
        summary,
        audience,
        entryMechanism,
        easyYesReason,
        cta,
        urgencyOrRiskReversal,
        bridgeToCoreOffer
      },
      upsellOffer->{
        _id,
        name,
        summary,
        prerequisiteOrCoreRelationship,
        addedScopeSpeedSupport,
        triggerPoint,
        decisionFraming,
        priceDelta,
        timing
      },
      continuityOffer->{
        _id,
        name,
        summary,
        recurringValue,
        billingCadence,
        commitmentOrCancellation,
        renewalOrRetentionBenefits,
        onboardingOrContinuityBonus,
        roleAlongsideOrAfterCore
      },
      downsellOffer->{
        _id,
        name,
        summary,
        changedFromOriginalOffer,
        fallbackReasonOrObjection,
        reducedScopeOrPaymentFlexibility,
        trialOrPaymentPlanTerms,
        cta
      }
    }
  }
`;

export const CAMPAIGN_SLUGS_QUERY = groq`
  *[_type == "campaign" && defined(slug.current)]{
    slug
  }
`;
