import Image from "next/image";
import Button from "./Button";

interface BookingCancelModel {
  isShow: boolean;
  cancelBooking: () => void;
  closeModal: () => void;
  isLoading: boolean;
}

function BookingCancelModal({
  isShow,
  cancelBooking,
  closeModal,
  isLoading,
}: BookingCancelModel) {
  return (
    <>
      <div
        className={`${isShow ? " z-[100] translate-y-0" : " opacity-0 translate-y-5 -z-50"} fixed top-0 right-0 left-0 w-full md:max-w-xl md:flex md:items-center md:justify-center h-full transition-all duration-250 ease-in-out md:p-4 md:mx-auto `}
      >
        {/* <!-- Modal content --> */}
        <div className="absolute w-full h-fit bg-white rounded-tl-md rounded-tr-md shadow bottom-0 md:relative md:rounded-md ">
          {/* <!-- Modal body --> */}
          <div className="pt-8 pb-10 px-4 text-center ">
            <Image
              src="/deleted.webp"
              alt="Cancel Booking"
              width={720}
              height={720}
              className="w-[300px] h-[300px] object-cover object-center mx-auto -mt-12 -mb-5 lg:max-w-40 rounded-md lg:rounded"
            />
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-950 uppercase mb-4 lg:text-3xl">
                Cancel Booking?
              </h2>
              <p className="text-gray-600">
                By canceling your booking, you'll be freeing up a seat for
                another eager attendee.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:gap-8 justify-center">
              <Button
                isButton={true}
                text="Close"
                type="primary"
                width="w-full"
                onClick={closeModal}
              />
              <Button
                isButton={true}
                text="Confirm Cancellation"
                type="primary-border"
                width="w-full"
                isLoading={isLoading}
                onClick={cancelBooking}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingCancelModal;
