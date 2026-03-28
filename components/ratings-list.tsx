import { formatDisplayDate } from "@/lib/utils";
import { StarRating } from "@/components/star-rating";

type RatingItem = {
  id: string;
  name: string;
  stars: number;
  comment: string;
  createdAt: Date | string;
};

type RatingsListProps = {
  ratings: RatingItem[];
};

export function RatingsList({ ratings }: RatingsListProps) {
  if (!ratings.length) {
    return <p>No approved ratings yet. Be the first to share your feedback.</p>;
  }

  return (
    <ul className="space-y-4">
      {ratings.map((rating) => (
        <li key={rating.id} className="rounded-2xl border border-oliveGray/30 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{rating.name}</p>
            <StarRating value={rating.stars} readOnly />
          </div>
          <p className="mt-2">{rating.comment}</p>
          <p className="mt-2 text-sm text-gray-600">{formatDisplayDate(rating.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
}
