import { TourClient } from "./tour-client";
import { getTours } from "@/lib/helpers/tours.helpers";

export type Tour = {
  id: string;
  destination?: Destination;
  dates: string;
  duration: string;
  groupSize: string;
  price: string;
  title: string;
  intro: string;
  tourImage: string;
  included: string[];
  excluded: string[];
  activities: string[];
  itinerary?: Itinerary[];
  bookings?: Booking[];
  createdAt: string;
  updatedAt: string;
}

export type Destination = {
  id: string;
  name: string;
  tourId: string;
  destinationImage: string;
  tour: Tour;
  guide?: Guide[];
  createdAt: string;
  updatedAt: string;
}

export type Guide = {
  id: string;
  subtitle: string;
  content: string;
  destinationId: string;
  destination: Destination;
  createdAt: string;
  updatedAt: string;
}

export type Itinerary = {
  id: string;
  day: string;
  title: string;
  activities: string[];
  dayImage: string;
  tourId: string;
  tour: Tour;
  createdAt: string;
  updatedAt: string;
}

export type Booking = {
  id: string;
  email: string;
  name: string;
  tourId: string;
  tour: Tour;
  createdAt: string;
  updatedAt: string;
}

export default async function Page() {
  const { success, data } = await getTours();

  if (!success) {
    return <div>Error fetching tours</div>;
  }

  return <TourClient initialData={data} />;
}
