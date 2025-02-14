import { useRouter } from "next/router";
import { EventCardProps, ReviewResponse } from "@/models/models";
import { useEffect, useState } from "react";
import { EventHandlerApi } from "@/utils/eventHandler";
import Image from "next/image";
import Chips from "@/components/Chips";
import Button from "@/components/Button";
import NavigationBar from "@/components/NavigationBar";
import { useAuth } from "@/utils/userContext";
import LoadingEventDetail from "./loading";
import { formatDate } from "@/utils/formatter/formatDate";
import BookingModal from "@/components/BookingModal";
import Header from "@/components/Header";
import { formatNumber } from "@/utils/formatter/formatNumber";
import ReviewCard from "@/components/ReviewCard";

function DetailEvent() {
  const { isLogin, user } = useAuth();
  const [eventId, setEventId] = useState<number>(0);
  const eventHandlerApi = new EventHandlerApi(); // Initialize event handler API
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Track data loading state
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false); // Track data loading state

  const [event, setEvent] = useState<EventCardProps>({
    event_id: "",
    category_name: "",
    event_name: "",
    event_description: "",
    event_price: 0,
    event_capacity: 0,
    event_image: "",
    is_online: false,
    is_paid: false,
    event_end_date: "",
    event_start_date: "",
    discounted_price: 0,
    event_location: "",
    is_active: false,
  });
  const [review, setReview] = useState<ReviewResponse[]>([]);
  const currentDate = new Date();
  const eventStartDate = new Date(event.event_start_date);
  const eventEndDate = new Date(event.event_end_date);

  const formatedEventStartDate = formatDate(
    event?.event_start_date.toLocaleString()
  );
  const formatedEndStartDate = formatDate(
    event?.event_end_date.toLocaleString()
  );
  const formatNumberPrice = formatNumber(event.event_price);
  const formatDiscountPrice = formatNumber(event.discounted_price);

  const eventDate =
    formatedEventStartDate === formatedEndStartDate ? (
      <p className=" text-gray-900 ">{formatedEventStartDate}</p>
    ) : (
      <p className=" text-gray-900 ">
        {formatedEventStartDate} - {formatedEndStartDate}
      </p>
    );

  const callToActionSection = () => {
    if (currentDate < eventStartDate) {
      return (
        <div className="bg-indigo-600 p-4 rounded-md mb-5">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-white text-2xl font-extrabold">
              {event.is_paid ? (
                event.is_active ? (
                  <>
                    {`Rp ${formatDiscountPrice}`}
                    {"    "}
                    <span className="text-red-200 text-sm line-through font-medium">{`Rp ${formatNumberPrice}`}</span>
                  </>
                ) : (
                  `Rp ${formatNumberPrice}`
                )
              ) : (
                "FREE!"
              )}
            </p>
            <div className="p-2 bg-indigo-400 rounded-md w-fit ">
              <span className="text-white text-sm font-semibold">
                {event?.event_capacity} Seats available
              </span>
            </div>
          </div>
          {isLogin ? (
            <Button
              isButton={true}
              onClick={handleShowModal}
              width="w-full"
              type="secondary"
              text="Book Ticket"
              isButtonDisable={false}
            />
          ) : (
            <div className="mb-4">
              <p className="text-white font-semibold mb-4 text-sm">
                Before continue, let’s login to your account
              </p>
              <Button
                isButton={false}
                href="/auth/login"
                width="w-full"
                type="secondary"
                text="Login"
              />
            </div>
          )}
        </div>
      );
    } else if (currentDate >= eventStartDate && currentDate <= eventEndDate) {
      return (
        <div className="bg-indigo-600 p-4 rounded-md mb-5">
          <div className="flex justify-between items-center">
            <p className="text-white ">
              We apologize, but registration for this event has closed. We hope
              to see you at our next event!
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-indigo-600 p-4 rounded-md mb-5">
          <div className="flex justify-between items-center">
            <p className="text-white text ">
              Want to know what happened at this event? Read the stories of
              attendees.
            </p>
          </div>
        </div>
      );
    }
  };

  async function handleGetEventById(eventId: number): Promise<void> {
    try {
      setIsLoading(true);
      const response = await eventHandlerApi.geEventById(eventId);
      setEvent(response.data);
      setReview(response.data.Review);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  function handleShowModal(): void {
    setShowBookingModal(true);
  }
  function handleCloseModal(): void {
    setShowBookingModal(false);
  }

  useEffect(() => {
    const { eventId } = router.query;
    if (eventId) {
      // Fetch event data when component mounts or when eventId changes in the URL query
      handleGetEventById(Number(eventId));
      setEventId(Number(eventId));
    }
  }, [router.query]); // Specify router.query as a dependency

  return (
    <>
      <Header>
        <title>{event.event_name}</title>
        <meta
          name="description"
          content={`Discover ${event.event_name} at ${event.event_location}`}
        />
      </Header>
      {showBookingModal ? (
        <BookingModal
          event_id={eventId}
          event_date={eventDate}
          event_image={event?.event_image}
          event_name={event?.event_name}
          event_price={event?.event_price}
          user_points={user?.points as number}
          isShow={showBookingModal}
          closeModal={handleCloseModal}
          end_date={formatedEndStartDate}
          start_date={formatedEventStartDate}
          isPaid={event.is_paid}
          discounted_price={event.discounted_price}
          is_active={event.is_active}
        />
      ) : (
        ""
      )}

      <NavigationBar
        userRole="user"
        isLogin={isLogin}
        name={user?.name}
        point={user?.points}
      />
      {isLoading ? (
        <LoadingEventDetail />
      ) : (
        <div className="px-3 py-5 md:py-10 ">
          <section className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-0 mb-16 sm:mb-24">
            <Image
              alt={event?.event_name as string | `/mainLogo.png`}
              src={event?.event_image as string}
              width={600}
              height={600}
              className="max-h-64 object-cover object-center rounded-md md:max-h-[450px]"
            />
            <div className="flex flex-col gap-6 bg-white lg:p-5">
              <div id="header">
                <Chips type="CATEGORY" text={event?.category_name as string} />
                <h1 className="break-all text-3xl font-bold uppercase">
                  {event?.event_name}
                </h1>
              </div>

              <div>
                <div className="mb-3 lg:flex lg:gap-2">
                  <div className="flex gap-2 items-center mb-3">
                    <Image
                      width={100}
                      height={100}
                      className="w-6"
                      src="/icon/calendar.svg"
                      alt="Calendar Icon"
                    />
                    <p className="text-gray-900 font-semibold">Event Date</p>
                  </div>
                  <p className="hidden lg:block">-</p>
                  {eventDate}
                </div>
                <div className="lg:flex lg:gap-2">
                  <div className="flex gap-2 items-center mb-3">
                    <Image
                      width={100}
                      height={100}
                      className="w-6"
                      src="/icon/location.svg"
                      alt="Location Icon"
                    />
                    <p className="text-gray-900 font-semibold">
                      Event Location
                    </p>
                  </div>
                  <p className="hidden lg:block">-</p>
                  <p className="text-gray-900">
                    {event.is_online ? "Online" : event.event_location}
                  </p>
                </div>
              </div>
              {callToActionSection()}
              <div>
                <h3 className="text-lg font-bold mb-2">About this event</h3>
                <p>{event?.event_description}</p>
              </div>
            </div>
          </section>
          {currentDate < eventStartDate ? (
            <section className="max-w-screen-xl mx-auto ">
              <div className="bg-zinc-100 p-5 rounded-sm text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {` Don't miss out on the insights! Join the event now and share
                  your thoughts with the community. After the event, you can
                  explore the shared thoughts of others.`}
                </p>
              </div>
            </section>
          ) : currentDate >= eventStartDate && currentDate <= eventEndDate ? (
            <section className="max-w-screen-xl mx-auto ">
              <div className="bg-zinc-100 p-5 rounded-sm text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {` Don't miss out on the insights! After the event, you can
                  explore the shared thoughts of others.`}
                </p>
              </div>
            </section>
          ) : (
            <section className="max-w-screen-xl mx-auto  ">
              {review.length !== 0 ? (
                <>
                  <h2 className="text-lg font-bold mb-4">
                    Their thought about the events
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {review.map((review: ReviewResponse, index: number) => {
                      return (
                        <ReviewCard
                          key={index}
                          name={review.User.name}
                          reviewText={review.review_content}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-zinc-100 p-5 rounded-sm text-center">
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {`Don't miss out on the insights! you can explore the shared
                    thoughts of others in here.`}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </>
  );
}

export default DetailEvent;
