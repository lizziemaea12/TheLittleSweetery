"use client";

type StarRatingProps = {
  value: number;
  onChange?: (nextValue: number) => void;
  readOnly?: boolean;
};

export function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;

        if (readOnly) {
          return (
            <span key={starValue} aria-hidden="true" className={isFilled ? "text-caramel" : "text-oliveGray/50"}>
              {isFilled ? "★" : "☆"}
            </span>
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange?.(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            className={`text-2xl ${isFilled ? "text-caramel" : "text-oliveGray/50"}`}
          >
            {isFilled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
