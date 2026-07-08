import CampaignLandingPage from "@/components/campaign-landing-page";
import {
  fetchCampaignLandingPage,
  fetchCampaignLandingPagesStaticParams,
} from "@/sanity/lib/fetch";
import { deriveCampaignTitle } from "@/sanity/queries/campaign";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const campaigns = await fetchCampaignLandingPagesStaticParams();

  return campaigns.map((campaign) => ({
    slug: campaign.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const campaign = await fetchCampaignLandingPage({ slug: params.slug });

  if (!campaign) {
    notFound();
  }

  const derivedTitle = deriveCampaignTitle(campaign.campaignDetails);

  return {
    title: derivedTitle || "Campaign",
    description:
      campaign.campaignDetails?.goal ||
      campaign.offers?.[0]?.name ||
      derivedTitle ||
      "Campaign landing page",
  };
}

export default async function CampaignPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const campaign = await fetchCampaignLandingPage({ slug: params.slug });

  if (!campaign) {
    notFound();
  }

  return <CampaignLandingPage campaign={campaign} />;
}
