import Chips from "./Chips";
import Button from "./Button";
import { formatDate } from "@/utils/formatter/formatDate";
import { BookingStatus } from "@/models/models";
import Link from "next/link";
import { formatNumber } from "@/utils/formatter/formatNumber";

export interface TransactionCardProps {
  transactionId: number;
  eventTitle: string;
  orderDate: Date;
  paymentMethod: string;
  totalAmount: number;
  transactionStatus: BookingStatus;
  eventStartDate: Date;
  showCancelModal: () => void;
  showReviewModal: () => void;
}

function TransactionCard({
  eventTitle,
  orderDate,
  paymentMethod,
  transactionStatus,
  totalAmount,
  transactionId,
  eventStartDate,
  showCancelModal,
  showReviewModal,
}: TransactionCardProps) {
  const currentDate = new Date();
  const formattedDate = formatDate(orderDate.toLocaleString());
  const formattedEventStartDate = formatDate(eventStartDate.toLocaleString());
  const formettedNumber = formatNumber(totalAmount);
  const statusPayment = () => {
    if (transactionStatus === BookingStatus.WaitingForPayment) {
      return <Chips type="WAITING FOR PAYMENT" text="" />;
    } else if (transactionStatus === BookingStatus.Canceled) {
      return <Chips type="FAILED" text="" />;
    } else if (transactionStatus === BookingStatus.Completed) {
      return <Chips type="COMPLETED" text="" />;
    } else if (transactionStatus === BookingStatus.Paid) {
      return <Chips type="PAID" text="" />;
    }
  };

  const buttonShown = () => {
    if (transactionStatus === BookingStatus.WaitingForPayment) {
      return (
        <div className="flex items-center gap-3 pt-6 border-t border-t-zinc-300">
          <Button
            isButton={true}
            text="Cancel Booking"
            type="secondary"
            width="w-full"
            onClick={showCancelModal}
          />
          <Button
            isButton={false}
            text="Go to detail payment"
            type="primary"
            width="w-full"
            href={`/event/waiting-payment/${transactionId}`}
          />
        </div>
      );
    } else if (transactionStatus === BookingStatus.Paid) {
      if (new Date(eventStartDate) < currentDate) {
        console.log(new Date(eventStartDate));
        return (
          <div className="flex flex-col items-center gap-4 pt-6 border-t border-t-zinc-300 md:flex-row">
            <p className="font-semibold text-gray-900 text-sm w-full">
              How was the event?
            </p>
            <Button
              isButton={true}
              text="Share Your Experience"
              type="primary"
              width="w-full"
              onClick={showReviewModal}
            />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center gap-2   p-4 bg-zinc-100 rounded-md">
            <p className="font-bold text-gray-900 text-sm w-full">
              Get ready for your upcoming event!
            </p>
            <p className=" text-gray-900 text-sm w-full">
              Your event will start on{" "}
              <span className="font-semibold text-indigo-600">
                {formattedEventStartDate}
              </span>
            </p>
          </div>
        );
      }
    } else if (transactionStatus === BookingStatus.Canceled) {
      return (
        <div className="flex items-center gap-3 pt-6 border-t border-t-zinc-300">
          <p className=" text-gray-600 md:max-w-[400px]">
            You already cancelled this booking, You can always{" "}
            <span>
              <Link href={"/"} className="underline ">
                explore other event
              </Link>
            </span>
          </p>
        </div>
      );
    } else if (transactionStatus === BookingStatus.Completed) {
      return (
        <div className="flex items-center gap-3 pt-6 border-t border-t-zinc-300">
          <p className=" text-gray-600 md:max-w-[400px]">
            Thanks for attending! Stay tuned for our next event.
          </p>
        </div>
      ); // No buttons shown for canceled or completed transactions.  Replace with your custom logic here.  For example, you could show a "Cancelled" or "Completed" message.  Remember to handle the logic for each status appropriately.  For example, you might want to disable the cancel and pay buttons for completed transactions, or display a different message for canceled transactions.  Don't forget to handle the case where the transaction status is not recognized.  You can use a switch statement or a conditional statement to handle this.  This example assumes that you have a `BookingStatus` enum that represents the different booking statuses.  If you have a different status system, you'll need to adjust the logic accordingly.  Also, you may want to add more specific error handling for different types of errors.  For example, you could display an error message if the transaction status is not recognized.  This example assumes that you have a `BookingStatus` enum that
    }
  };

  return (
    <div
      id={`${transactionId}`}
      className="w-full border border-zinc-200 p-5 rounded-md bg-white"
    >
      <div className="flex justify-between items-center mb-4 md:mb-8">
        {statusPayment()}
        <div>
          <p className="text-gray-900 text-sm font-semibold">{formattedDate}</p>
        </div>
      </div>
      <h2 className="break-all text-2xl font-bold text-gray-900 mb-3 md:mb-6">
        {eventTitle}
      </h2>

      <div className="mb-6 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-900 mb-1 md:text-xl md:mb-0">
          Rp {formettedNumber}
        </h3>
        <p className="text-sm font-semibold text-gray-500">
          Paid with {paymentMethod}
        </p>
      </div>
      {buttonShown()}
    </div>
  );
}

export default TransactionCard;
