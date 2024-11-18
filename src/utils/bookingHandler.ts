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
      return response.data;
    } catch (error: any) {
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
      return response.data;
    } catch (error) {
      return error;
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
      return response.data;
    } catch (error) {
      return error;
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
      return response.data;
    } catch (error) {
      return error;
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

      return response.data.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
      return error;
    }
  }
}
