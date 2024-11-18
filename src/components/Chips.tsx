import { BookingStatus } from "@/models/models";

interface ChipsProps {
  type: "CATEGORY" | "WAITING FOR PAYMENT" | "PAID" | "FAILED" | "COMPLETED";
  text: string;
}

function Chips({ type, text }: ChipsProps) {
  switch (type) {
    case "CATEGORY":
      return (
        <div className="h-fit text-white text-xs py-1 px-2 bg-indigo-950 w-fit rounded-sm font-medium mb-2">
          {text}
        </div>
      );
    case "COMPLETED":
      return (
        <div className="h-fit text-green-900 text-xs py-1 px-2 bg-green-200 w-fit rounded-sm font-medium ">
          {BookingStatus.Completed}
        </div>
      );

    case "FAILED":
      return (
        <div className="h-fit text-gray-700 text-xs py-1 px-2 bg-gray-200 w-fit rounded-sm font-medium ">
          {BookingStatus.Canceled}
        </div>
      );

    case "WAITING FOR PAYMENT":
      return (
        <div className="h-fit text-yellow-900 text-xs py-1 px-2 bg-yellow-200 w-fit rounded-sm font-medium ">
          {BookingStatus.WaitingForPayment}
        </div>
      );
    case "PAID":
      return (
        <div className="h-fit text-green-900 text-xs py-1 px-2 bg-green-200 w-fit rounded-sm font-medium ">
          {BookingStatus.Paid}
        </div>
      );
    default:
      break;
  }
}

export default Chips;
