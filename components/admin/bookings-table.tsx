import { formatDisplayDate } from "@/lib/utils";

type BookingRow = {
  id: string;
  name: string;
  email: string;
  eventDate: string | Date;
  eventType: string;
  guestCount: number;
  notes: string | null;
};

type BookingsTableProps = {
  bookings: BookingRow[];
};

export function BookingsTable({ bookings }: BookingsTableProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-oliveGray/30 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold">Booking Requests</h2>
      {bookings.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-oliveGray/30">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Guests</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0">
                  <td className="p-2">{formatDisplayDate(booking.eventDate)}</td>
                  <td className="p-2">{booking.name}</td>
                  <td className="p-2">{booking.email}</td>
                  <td className="p-2">{booking.eventType}</td>
                  <td className="p-2">{booking.guestCount}</td>
                  <td className="p-2">{booking.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
