export const EVENT_TYPES = [
  "birthday party",
  "school event",
  "neighborhood event",
  "other",
] as const;

export const TREATS = [
  {
    key: "cake-pops",
    name: "Cake Pops",
    description: "Hand-dipped bite-sized cake pops in fun flavors.",
  },
  {
    key: "caramel-corn",
    name: "Caramel Corn",
    description: "Crunchy popcorn coated in buttery caramel goodness.",
  },
  {
    key: "puppy-chow",
    name: "Puppy Chow",
    description: "Chocolatey cereal mix dusted with powdered sugar.",
  },
  {
    key: "seasonal-specials",
    name: "Seasonal Specials",
    description: "Availability varies by event and time of year.",
  },
] as const;
