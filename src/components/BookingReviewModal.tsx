import React, { useEffect, useState } from "react";
import Button from "./Button";
import Cookies from "js-cookie";
import { ReviewData } from "@/models/models";
import { BookingHandler } from "@/utils/bookingHandler";
import Toast from "./alert";
import { AuthHandler } from "@/utils/authValidation";
import { UniqueCode } from "@/models/models";

interface BookingReviewModal {
  transactionId: number;
  eventId: number;
  isShow: boolean;
  closeModal: () => void;
}

function BookingReviewModal({
  transactionId,
  eventId,
  closeModal,
  isShow,
}: BookingReviewModal) {
  const bookingHandler = new BookingHandler();
  const authHandler = new AuthHandler();
  const userToken = Cookies.get(`access${UniqueCode.USER}_token`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [reviewData, setReviewData] = useState<ReviewData>({
    eventId: eventId,
    isAttend: true,
    review_content: "",
    review_rating: 0,
    transaction_id: transactionId,
  });

  //   Handle isAttend
  function handleIsAttend(e: React.ChangeEvent<HTMLInputElement>) {
    setReviewData({
      ...reviewData,
      isAttend: e.target.checked,
    });
  }
  //   handle review_content
  function handleReviewContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setReviewData({
      ...reviewData,
      review_content: e.target.value,
    });
  }
  //   handle review_rating
  function handleReviewRating(e: React.ChangeEvent<HTMLSelectElement>) {
    setReviewData({
      ...reviewData,
      review_rating: parseInt(e.target.value),
    });
  }

  async function handleSubmitReview() {
    const body: ReviewData = {
      eventId: reviewData.eventId,
      isAttend: reviewData.isAttend,
      review_content: reviewData.isAttend ? reviewData.review_content : "",
      review_rating: reviewData.isAttend ? reviewData.review_rating : 0,
      transaction_id: reviewData.transaction_id,
    };
    try {
      console.log("click");
      setIsLoading(true);
      const response = await bookingHandler.reviewBookings(
        userToken as string,
        body
      );
      console.log(response.data);
      setIsLoading(false);
      setShowToast(true);
      window.location.href = "/user/transaction-history";
    } catch (error) {
      console.log(error);
    }
  }
  console.log(reviewData);

  useEffect(() => {
    setIsButtonDisabled(authHandler.handleReviewValidation(reviewData));
  }, [
    reviewData.review_content,
    reviewData.review_rating,
    reviewData.isAttend,
    reviewData.isAttend,
  ]);

  return (
    <>
      <Toast
        type="SUCCESS"
        highlightText="Review Successfully Submit"
        text="please wait page will be reload"
        showToast={showToast}
      />

      <div
        className={`${isShow ? " z-[100] translate-y-0" : " opacity-0 translate-y-5 -z-50"} fixed top-0 right-0 left-0 w-full md:max-w-xl md:flex md:items-center md:justify-center h-full transition-all duration-250 ease-in-out md:p-4 md:mx-auto `}
      >
        {/* <!-- Modal content --> */}
        <div className="absolute w-full h-fit bg-white rounded-tl-md rounded-tr-md shadow bottom-0 md:relative md:rounded-md ">
          {/* <!-- Modal body --> */}
          <div className="pt-8 pb-10 px-4  ">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-950 uppercase mb-4 lg:text-3xl">
                What do you think about the event?
              </h2>
              <p className="text-gray-700 mb-6">
                Please leave a review to help others understand your experience.
              </p>
              <div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold" htmlFor="">
                    Do you attend to the event?
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      className="w-4 h-4 text-indigo-600 bg-zinc-100 border-zinc-300 rounded focus:ring-indigo-600 focus:ring-2 "
                      type="checkbox"
                      id="isAttend"
                      name="isAttend"
                      checked={reviewData.isAttend}
                      onChange={handleIsAttend}
                    />
                    <label htmlFor="isAttend">Yes, I attended</label>
                  </div>
                </div>
                {reviewData.isAttend ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="block mb-2 font-semibold" htmlFor="">
                        Tell us about the event
                      </label>
                      <textarea
                        id="review_content"
                        name="review_content"
                        className="border border-zinc-200 rounded-md p-4 resize-none"
                        value={reviewData.review_content}
                        onChange={handleReviewContent}
                        rows={5}
                        placeholder="Write your review here..."
                      ></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="">Tesll</label>
                      <select
                        onChange={handleReviewRating}
                        className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 "
                        name="rating"
                        id="rating"
                      >
                        <option value="0">Choose a rating</option>
                        <option value="1">1 (Poor)</option>
                        <option value="2">2 (Fair)</option>
                        <option value="3">3 (Good)</option>
                        <option value="4">4 (Very Good)</option>
                        <option value="5">5 (Excellent)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-100 rounded-md">
                    <p className=" text-gray-600 md:max-w-[400px]">
                      We're sorry you couldn't make it. You missed a great
                      event! Keep an eye out for our next one.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-8 justify-center">
              <Button
                isButton={true}
                text="Close"
                type="secondary"
                width="w-full"
                onClick={closeModal}
              />
              <Button
                isButton={true}
                onClick={handleSubmitReview}
                text="Submit My Review"
                type="primary"
                width="w-full"
                isLoading={isLoading}
                isButtonDisable={isButtonDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingReviewModal;
