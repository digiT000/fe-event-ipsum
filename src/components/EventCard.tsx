import { EventCardProps } from "@/models/models";
import Image from "next/image";
import Chips from "./Chips";
import { formatDate } from "@/utils/formatter/formatDate";
import { formatNumber } from "@/utils/formatter/formatNumber";

function EventCard({
  event_name,
  category_name,
  event_start_date,
  event_end_date,
  is_paid,
  is_online,
  event_price,
  discounted_price,
  event_image,
  event_capacity,
  onClick,
}: EventCardProps) {
  // FORMATTER
  const formatedEventStartDate = formatDate(event_start_date.toLocaleString());
  const formatedEndStartDate = formatDate(event_end_date.toLocaleString());
  const formattedNumber = formatNumber(event_price);

  const eventDate =
    formatedEventStartDate === formatedEndStartDate ? (
      <p className="text-sm text-gray-900 font-medium">
        {formatedEventStartDate}
      </p>
    ) : (
      <p className="text-sm text-gray-900 font-medium">
        {formatedEventStartDate} - {formatedEndStartDate}
      </p>
    );

  return (
    <a
      onClick={onClick}
      className="cursor-pointer border border-[#e5e5e5] rounded-md bg-white lg:flex lg:p-4 hover:border-[#1E1B4B] hover:shadow-lg transition-all"
    >
      <Image
        src={event_image}
        width={400}
        height={400}
        alt={`image - ${event_name}`}
        className="w-full h-36 object-cover object-center lg:max-w-40 lg:rounded"
      />
      <div className="p-4 w-full lg:flex lg:items-center">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:w-full">
          <div>
            <Chips type="CATEGORY" text={category_name} />
            <h2 className="break-all text-lg font-bold text-gray-950 uppercase mb-4 lg:text-xl">
              {event_name}
            </h2>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:w-full">
              <div className="flex gap-2  w-fit">
                <Image
                  width={100}
                  height={100}
                  className="w-5"
                  src="/icon/calendar.svg"
                  alt="Calendar Icon"
                />
                {eventDate}
              </div>
            </div>
          </div>
          <h3
            className={`text-lg font-bold ${is_paid ? "" : "text-green-600"}`}
          >
            {is_paid ? `Rp ${formattedNumber}` : "FREE!"}
          </h3>
        </div>
      </div>
    </a>
  );
}

export default EventCard;
