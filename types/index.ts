export type BookingFormInput = {
  name: string;
  email: string;
  eventDate: string;
  eventType: "birthday party" | "school event" | "neighborhood event" | "other";
  guestCount: number;
  notes?: string;
};

export type RatingFormInput = {
  name: string;
  stars: number;
  comment: string;
};
