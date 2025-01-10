import TripDetails from './TripDetails';

interface PageProps {
  params: Promise<{
    tripId: string;
    userId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  return {
    title: `Trip Details - ${resolvedParams.tripId}`,
  };
}

export default async function TripPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TripDetails tripId={resolvedParams.tripId} />;
}