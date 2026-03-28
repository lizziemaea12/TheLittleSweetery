type TreatCardProps = {
  name: string;
  description: string;
};

export function TreatCard({ name, description }: TreatCardProps) {
  return (
    <article className="rounded-2xl border border-oliveGray/30 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-lavender">{name}</h3>
      <p className="mt-1 text-sm text-chocolate">{description}</p>
    </article>
  );
}
