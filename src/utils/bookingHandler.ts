import axios from "axios";
import { BookingData, ReviewData } from "@/models/models";

export class BookingHandler {
  async bookingEvent(bookingData: BookingData, token: string) {
    try {
      const response = await axios.post(
        "/api/bookings/book-events",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response);
      return error.response.data;
    }
  }
  async getUserBooking(token: string) {
    try {
      const response = await axios.get("/api/bookings/get-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async cancelBooking(transactionId: number, token: string) {
    try {
      const response = await axios.put(
        `/api/bookings//update-status/cancel/${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStatusToPaid(transactionId: number, token: string) {
    try {
      const response = await axios.put(
        `/api/bookings/update-status/paid/${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getDetailBookings(transaction_id: number, token: string) {
    try {
      const response = await axios.get(
        `/api/bookings/get-bookings/${transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async reviewBookings(token: string, reviewData: ReviewData) {
    try {
      const response = await axios.post(
        "/api/bookings/booking-review",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
