import { formatDisplayDate } from "@/lib/utils";

type BookingRow = {
  id: string;
  name: string;
  email: string;
  eventDate: string | Date;
  eventAddress?: string | null;
  eventType: string;
  guestCount: number;
  estimatedPrice?: number;
  notes: string | null;
};

type BookingsTableProps = {
  bookings: BookingRow[];
};

export function BookingsTable({ bookings }: BookingsTableProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-oliveGray/20 bg-white p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-chocolate italic">Booking Requests</h2>
        <span className="bg-lavender/10 text-lavender font-bold text-xs px-3 py-1 rounded-full">
          {bookings.length} Total
        </span>
      </div>
      
      {bookings.length === 0 ? (
        <div className="p-12 text-center bg-cream/10 rounded-2xl border border-dashed border-oliveGray/20 text-chocolate/40 italic font-medium">
          No booking requests yet.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-oliveGray/10">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest font-black text-oliveGray/60">
                  <th className="px-6 py-4 text-left">Event Details</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Guests & Price</th>
                  <th className="px-6 py-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oliveGray/10">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-cream/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-chocolate">{formatDisplayDate(booking.eventDate)}</span>
                        <span className="text-xs text-lavender font-bold uppercase tracking-tight">{booking.eventType}</span>
                        {booking.eventAddress && (
                          <span className="text-[10px] text-chocolate/60 mt-1 italic">{booking.eventAddress}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-chocolate">{booking.name}</span>
                        <span className="text-xs text-chocolate/60">{booking.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-chocolate">{booking.guestCount} Guests</span>
                        {booking.estimatedPrice !== undefined && (
                          <span className="text-caramel font-bold italic text-lg">${booking.estimatedPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-chocolate/70 max-w-xs line-clamp-2 italic">
                        {booking.notes ?? "No additional notes."}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
