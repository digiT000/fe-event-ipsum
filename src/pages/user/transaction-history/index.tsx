import { useAuth } from "@/utils/userContext";
import NavigationBar from "@/components/NavigationBar";
import TransactionCard from "@/components/TransactionCard";
import { BookingHandler } from "@/utils/bookingHandler";
import BookingCancelModal from "@/components/BookingCancelModal";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import Overlay from "@/components/Overlay";
import { AuthHandler } from "@/utils/authValidation";
import Toast from "@/components/alert";
import EmptryTransactionSection from "@/components/section/EmptryTransactionSection";
import BookingReviewModal from "@/components/BookingReviewModal";
import { UniqueCode } from "@/models/models";
import Header from "@/components/Header";

function TransactionHistory() {
  const authHandler = new AuthHandler();
  // Check if the user already login or not
  authHandler.redirectIfUserNotLogin();
  const isInitialRender = useRef<boolean>(true); // Check if its already be render or not
  const userToken = Cookies.get(`access${UniqueCode.USER}_token`);
  const bookingHandler = new BookingHandler();
  const { isLogin, user } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDelayedModal, setShowDelayedModal] = useState<boolean>(false);
  const [transactionActive, setTransactionActive] = useState<number>(0);
  const [eventActive, setEventActive] = useState<number>(0);
  const [listTransaction, setListTransaction] = useState<[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  async function handleCancleTransaction(
    transactionId: number,
    userToken: string
  ) {
    try {
      setIsLoading(true);
      const response = await bookingHandler.cancelBooking(
        transactionId,
        userToken
      );
      console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        setShowToast(true);
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetUserTransaction() {
    try {
      const response = await bookingHandler.getUserBooking(userToken as string);
      if (response.status === 200) {
        setListTransaction(response.data);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
    }
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

  // InitialRender
  useEffect(() => {
    // Check the status of render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      handleGetUserTransaction();
    }
  }, []);
  console.log("List Transaction :", listTransaction);
  console.log("Transaction Active:", transactionActive);
  console.log("Event Active:", eventActive);

  return (
    <>
      <Header>
        <title>Transaction History</title>
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
          <BookingCancelModal
            isLoading={isLoading}
            cancelBooking={() =>
              handleCancleTransaction(transactionActive, userToken as string)
            }
            closeModal={() => {
              setTransactionActive(0);
              setShowModal(false);
            }}
            isShow={showDelayedModal}
          />
        </>
      ) : (
        ""
      )}
      {showToast && (
        <Toast
          highlightText="Success"
          text="Booking cancelled successfully."
          type="SUCCESS"
          showToast={showToast}
        />
      )}
      {showReviewModal ? (
        <>
          <Overlay />
          <BookingReviewModal
            closeModal={() => {
              setEventActive(0);
              setTransactionActive(0);
              setShowReviewModal(false);
            }}
            isShow={showReviewModal}
            eventId={eventActive}
            transactionId={transactionActive}
          />
        </>
      ) : (
        ""
      )}
      {isLogin ? (
        <section className="px-4 py-16">
          <div className="max-w-screen-lg mx-auto">
            {/* Your transaction history goes here */}

            {/* Card Transaction */}
            {listTransaction?.length === 0 ? (
              <EmptryTransactionSection />
            ) : null}
            <div>
              {listTransaction?.length !== 0 ? (
                <h1 className="text-3xl font-bold mb-10">MY BOOKINGS</h1>
              ) : (
                ""
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {listTransaction?.map((transaction: any, i: number) => {
                  return (
                    <TransactionCard
                      key={i}
                      eventTitle={transaction.Event.event_name}
                      eventStartDate={transaction.Event.event_start_date}
                      orderDate={transaction.order_date}
                      totalAmount={transaction.payment_ammount}
                      transactionStatus={transaction.status_order}
                      transactionId={transaction.transaction_id}
                      paymentMethod={transaction.payment_method}
                      showCancelModal={() => {
                        setTransactionActive(transaction.transaction_id);
                        setShowModal(true);
                      }}
                      showReviewModal={() => {
                        setTransactionActive(transaction.transaction_id);
                        setEventActive(transaction.Event.event_id);
                        setShowReviewModal(true);
                      }}
                    />
                  );
                })}
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

export default TransactionHistory;
