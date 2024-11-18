import NavigationBar from "@/components/NavigationBar";
import { useAuth } from "@/utils/userContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BookingHandler } from "@/utils/bookingHandler";
import Cookies from "js-cookie";
import { TransactionPageProps } from "@/models/models";
import Image from "next/image";
import { formatNumber } from "@/utils/formatter/formatNumber";
import { formatDate } from "@/utils/formatter/formatDate";
import Chips from "@/components/Chips";
import Button from "@/components/Button";
import MultiPurposeModal, { ModalProps } from "@/components/MultiPurposeModal";
import Overlay from "@/components/Overlay";
import { UniqueCode } from "@/models/models";
import Header from "@/components/Header";

function WaitingPaymentPage() {
  const userToken = Cookies.get(`access${UniqueCode.USER}_token`);
  const bookingHandler = new BookingHandler();
  const router = useRouter();
  const { isLogin, user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisable, setIsButtonDisable] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDelayedModal, setShowDelayedModal] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<TransactionPageProps | null>(
    null
  );

  const paymentSuccessModalProps: ModalProps = {
    type: "PAYMENT SUCCESS",
    isShow: showDelayedModal,
    title: "Payment Successful",
    subTitle: "Your payment has been processed successfully.",
    primaryButton: {
      text: "View My Booking",
      href: "/user/transaction-history",
    },
    secondaryButton: {
      text: "Explore More Event",
      href: "/",
    },
  };

  let formattedNumber: string = "0";
  if (transaction?.payment_ammount) {
    formattedNumber = formatNumber(transaction.payment_ammount);
  }

  const formattedStartDate = formatDate(
    transaction?.event_start_date as string
  );
  const formattedEndDate = formatDate(transaction?.event_start_date as string);

  const eventDate =
    formattedStartDate === formattedEndDate ? (
      <p className=" text-sm text-gray-900 ">{formattedStartDate}</p>
    ) : (
      <p className="text-smtext-gray-900 ">
        {formattedStartDate} - {formattedEndDate}
      </p>
    );

  async function handleGetDetailBookings(
    transaction_id: number,
    token: string
  ): Promise<void> {
    try {
      const response = await bookingHandler.getDetailBookings(
        transaction_id,
        token
      );
      const data = response.transaction;
      setTransaction({
        category_name: data.Event.Category.category_name,
        event_description: data.Event.event_description,
        event_end_date: data.Event.event_end_date,
        event_image: data.Event.event_image,
        event_name: data.Event.event_name,
        event_start_date: data.Event.event_start_date,
        is_online: data.Event.is_online,
        order_date: data.order_date,
        payment_ammount: data.payment_ammount,
        status_order: data.status_order,
        transaction_id: data.transaction_id,
        event_location: data.Event.event_location,
        payment_method: data.payment_method,
      });
      console.log(response);
    } catch (error: any) {
      console.log(error.response);
    }
  }

  async function handleConfirmPayment(): Promise<void> {
    try {
      setIsButtonDisable(true); // Disable the button when the payment is processing
      setIsLoading(true);
      const response = await bookingHandler.updateStatusToPaid(
        Number(transaction?.transaction_id),
        userToken as string
      );

      if (response.status === 200) {
        // Redirect to transaction history after successfull payment
        // 1. Show success modal when the payment its success
        // 2. User able to go to transaction page or explore other event
        setIsLoading(false);
        setShowModal(!showModal);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const { transactionId } = router.query;

    if (transactionId && userToken) {
      // Fetch event data when component mounts or when eventId changes in the URL query
      handleGetDetailBookings(Number(transactionId), userToken as string);
    }
  }, [router.query]); // Specify router.query as a dependency

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
      <Header>
        <title>Waiting Payment</title>
      </Header>
      <NavigationBar
        isLogin={isLogin}
        userRole="user"
        name={user?.name}
        point={user?.points}
      />
      {showModal ? (
        <>
          <Overlay />
          <MultiPurposeModal {...paymentSuccessModalProps} />
        </>
      ) : (
        ""
      )}
      {transaction ? (
        <section className="p-4">
          <div className="mt-10 max-w-2xl h-full p-5 md:mx-auto bg-white border border-zinc-200 rounded-md">
            {/* <!-- Modal content --> */}
            {/* <!-- Modal header --> */}
            <div className=" border-b border-b-gray-300 py-5 ">
              <h3 className="text-3xl font-bold text-gray-900 mb-10">
                Please Complete your payment
              </h3>

              <div className="flex justify-between items-center">
                <p className="text-gray-700 text-sm">
                  Order Date : <span>{formatDate(transaction.order_date)}</span>
                </p>
                <div className="text-sm bg-yellow-100 rounded-md p-2 font-semibold">
                  {transaction.status_order}
                </div>
              </div>
            </div>
            {/* <!-- Modal body --> */}
            <div className="py-7 ">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Your Booking Detail
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-3">Event Name</p>
                  <h2 className="break-all font-bold text-gray-950 uppercase lg:text-2xl">
                    {transaction.event_name}
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-3">Event Category</p>
                  <Chips type="CATEGORY" text={transaction.category_name} />
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-3">Event Schedule</p>
                  <div className="flex gap-2 items-center w-fit">
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
                <div className="">
                  <p className="text-sm text-gray-500 mb-3">Event Location</p>
                  <div className="flex gap-2 w-fit items-center">
                    <Image
                      width={100}
                      height={100}
                      className="w-5"
                      src="/icon/location.svg"
                      alt="Calendar Icon"
                    />
                    {transaction.event_location}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-3">Payment Method</p>
                  <h2 className="font-bold text-gray-950 uppercase  lg:text-xl">
                    {transaction.payment_method}
                  </h2>
                </div>
              </div>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="sm:flex sm:items-center sm:justify-between sm:gap-5 bg-indigo-50 p-5 rounded-md">
              <div className="flex justify-between items-center mb-5 sm:flex-col sm:mb-0 ">
                <p className="text-sm text-gray-700 mb-1 font-semibold">
                  Payment Ammount
                </p>
                <h2 className="text-2xl font-bold">Rp {formattedNumber}</h2>
              </div>
              <div className="flex gap-4 items-center justify-between">
                <p className="text-sm text-gray-700 font-semibold">
                  Already Paid?
                </p>
                <Button
                  isButton={true}
                  text="Confirm Payment"
                  type="primary"
                  width="w-fit"
                  isLoading={isLoading}
                  isButtonDisable={isButtonDisable}
                  onClick={handleConfirmPayment}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
}

export default WaitingPaymentPage;
