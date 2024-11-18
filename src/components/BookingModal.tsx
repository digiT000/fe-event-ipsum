import Image from "next/image";
import { useRouter } from "next/router";
import { title } from "process";
import { useAuth } from "@/utils/userContext";
import { ReactElement, useEffect, useState } from "react";
import Button from "./Button";
import { formatNumber } from "@/utils/formatter/formatNumber";
import { BookingHandler } from "@/utils/bookingHandler";
import {
  BookingData,
  PaymentMethod,
  BookingServiceCode,
} from "@/models/models";
import Cookies from "js-cookie";
import AlertToast, { Toast } from "./alert";
import Overlay from "./Overlay";
import MultiPurposeModal, { ModalProps } from "./MultiPurposeModal";
import { UniqueCode } from "@/models/models";

interface BookingModalProps {
  event_id: number;
  event_image: string;
  event_name: string;
  event_date: ReactElement<any, any>;
  event_price: number;
  user_points: number;
  start_date: string;
  end_date: string;
  closeModal: () => void;
  isShow: boolean;
  isPaid: boolean;
}

function BookingModal({
  event_id,
  event_name,
  event_price,
  event_image,
  user_points,
  closeModal,
  start_date,
  end_date,
  isShow,
  isPaid,
}: BookingModalProps) {
  const router = useRouter();
  const { user, decreseUserPoint } = useAuth();
  const bookingHandler = new BookingHandler();
  const [usePoint, setUsePoint] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | string>(
    "none"
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDelayedModal, setShowDelayedModal] = useState<boolean>(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = Cookies.get(`access${UniqueCode.USER}_token`);
  const [toast, setToast] = useState<Toast>({
    highlightText: "",
    text: "",
    type: "FAILED",
    showToast: false,
  });

  const paymentSuccessModalProps: ModalProps = {
    type: "BOOKING SUCCESS",
    isShow: showDelayedModal,
    title: "Booking Successful!",
    subTitle: `Congratulations! You've successfully booked your spot for ${event_name}. We're excited to have you join us!`,
    primaryButton: {
      text: "View Order",
      href: "/user/transaction-history",
    },
    secondaryButton: {
      text: "Explore More Event",
      href: "/",
    },
  };

  const formattedPrice = formatNumber(event_price);
  const eventDate =
    start_date === end_date ? (
      <p className=" text-sm text-gray-900 ">{start_date}</p>
    ) : (
      <p className="text-smtext-gray-900 ">
        {start_date} - {end_date}
      </p>
    );

  // handle booking process
  async function handleBooking() {
    const bookingData: BookingData = {
      event_id: event_id,
      usePoint: usePoint ? user_points : 0,
      payment_method: paymentMethod as PaymentMethod,
      is_paid: isPaid,
    };
    try {
      setIsLoading(true);
      const bookingResult = await bookingHandler.bookingEvent(
        bookingData,
        token as string
      );
      console.log(bookingResult);
      if (bookingResult.status === 201 || bookingResult.status === 200) {
        // handle success booking
        if (isPaid) {
          if (usePoint) {
            decreseUserPoint(user?.points as number);
          }
          setToast({
            highlightText: "Booking successful!, ",
            text: "we'll redirect you to payment page",
            type: "SUCCESS",
            showToast: true,
          });
          setTimeout(() => {
            router.push(
              `/event/waiting-payment/${bookingResult.data.transaction_id}`
            );
          }, 500);
        } else {
          setIsLoading(false);
          setShowModal(true);
        }
      } else if (bookingResult.errorCode === BookingServiceCode.NAQuoata) {
        // handle failed booking
        setToast({
          highlightText: "Event is already full, ",
          text: "Please check other events",
          type: "FAILED",
          showToast: true,
        });
        setTimeout(() => {
          setToast({
            highlightText: "",
            text: "",
            type: "FAILED",
            showToast: false,
          });
        }, 2000);
        setIsLoading(false);
      } else if (
        bookingResult.errorCode === BookingServiceCode.RegistarationClose
      ) {
        setToast({
          highlightText: "Event is already closed, ",
          text: "Please check other events",
          type: "FAILED",
          showToast: true,
        });
        setTimeout(() => {
          setToast({
            highlightText: "",
            text: "",
            type: "FAILED",
            showToast: false,
          });
        }, 2000);
        setIsLoading(false);
      } else if (
        bookingResult.errorCode === BookingServiceCode.WaitingForPayment
      ) {
        setToast({
          highlightText: "You already Book this event, ",
          text: "Please complete the payment to order it again",
          type: "FAILED",
          showToast: true,
        });
        setTimeout(() => {
          setToast({
            highlightText: "",
            text: "",
            type: "FAILED",
            showToast: false,
          });
        }, 2000);
        setIsLoading(false);
      }
    } catch (error) {
      alert("Failed to book the event. Please try again.");
    }
  }

  async function handleChangePaymentMethod(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setPaymentMethod(event.target.value as PaymentMethod);
    setIsButtonDisabled(paymentMethod !== "none");
  }
  // USE EFFECT FOR MODAL
  useEffect(() => {
    if (showModal) {
      console.log("exec");
      setTimeout(() => {
        setShowDelayedModal(showModal);
      }, 10); // Adjust the delay as needed
    } else {
      setTimeout(() => {
        setShowDelayedModal(showModal);
      }, 10); // Adjust the delay as needed
    }
  }, [showModal]);

  return (
    <>
      {/* OVERLAY */}
      {toast.showToast ? <Overlay /> : ""}
      <AlertToast
        highlightText={toast.highlightText}
        text={toast.text}
        type={toast.type}
        showToast={toast.showToast}
      />

      {showModal ? (
        <>
          <Overlay />
          <MultiPurposeModal {...paymentSuccessModalProps} />
        </>
      ) : (
        ""
      )}

      <div
        id="default-modal"
        tabIndex={isShow ? -1 : 99}
        aria-hidden={isShow ? "false" : "true"}
        className={`${isShow ? "block" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-gray-950 bg-opacity-50`}
      >
        <div className="relative w-full md:max-w-xl h-full md:p-4 md:mx-auto ">
          {/* <!-- Modal content --> */}
          <div className="absolute w-full bg-white rounded-tl-md rounded-tr-md shadow bottom-0 md:relative md: ">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-xl font-bold text-gray-900 ">
                Booking Confirmation
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="py-8 px-4 md:p-5 ">
              <div className="flex flex-col gap-7">
                <div className="flex gap-4">
                  <Image
                    src={event_image}
                    alt={title}
                    width={120}
                    height={120}
                    className="w-16 h-16 object-cover object-center lg:max-w-40 rounded-md lg:rounded"
                  />
                  <div>
                    <h2 className="break-all text-lg font-bold text-gray-950 uppercase mb-1 lg:text-xl">
                      {event_name}
                    </h2>
                    <div className="flex gap-2 w-fit">
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
                {isPaid ? (
                  <>
                    <div className="">
                      <div className="flex gap-4 items-center justify-between ">
                        <div className="flex gap-4 items-center">
                          <Image
                            src="/icon/coin.svg"
                            width={44}
                            height={44}
                            alt="coin"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 md:text-base">
                              Ipsum Points
                            </h3>
                            <p className="text-sm text-gray-600 md:text-base">
                              Points: {formatNumber(user_points)}
                            </p>
                          </div>
                        </div>
                        <input
                          id="purple-checkbox"
                          type="checkbox"
                          value=""
                          checked={usePoint}
                          onChange={(e: any) => setUsePoint(e.target.checked)}
                          className="w-6 h-6 text-indigo-600 bg-zinc-100 border-zinc-300 rounded focus:ring-indigo-600 focus:ring-2 "
                        />
                      </div>
                    </div>
                    <div className="sm:flex sm:justify-between sm:items-center">
                      <p className="font-semibold w-full text-gray-900 mb-2 sm:mb-0">
                        Select Payment Method
                      </p>
                      <select
                        id="payment_method"
                        defaultValue="none"
                        onChange={handleChangePaymentMethod}
                        className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 "
                      >
                        <option className=":text-red-900" value="none">
                          Select Payment Method
                        </option>
                        <option value={PaymentMethod.QRIS}>
                          {PaymentMethod.QRIS}
                        </option>
                        <option value={PaymentMethod.BankBCA}>
                          {PaymentMethod.BankBCA}
                        </option>
                        <option value={PaymentMethod.BCAVirtualAccount}>
                          {PaymentMethod.BCAVirtualAccount}
                        </option>
                      </select>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex items-center gap-5 p-4 border-t border-t-gray-200">
              {isPaid ? (
                <h2 className="text-2xl w-full font-bold">
                  Rp{" "}
                  {usePoint
                    ? formatNumber(event_price - user_points)
                    : formattedPrice}
                </h2>
              ) : (
                <h2 className="text-2xl w-full font-bold">ITS FREE</h2>
              )}

              <Button
                isButton={true}
                text="Book Now"
                type="primary"
                width="w-full"
                isButtonDisable={isPaid ? isButtonDisabled : false}
                isLoading={isLoading}
                onClick={handleBooking}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingModal;
