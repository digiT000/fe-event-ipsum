import { EventCardProps } from "@/models/models";
import axios from "axios";

export class EventHandlerApi {
  async getAllEvent() {
    try {
      const response = await axios.get(`/api/users/events`);

      const data: EventCardProps[] = response.data.data; // Assuming data is an array
      const cursor = response.data.cursor;

      return { data, cursor };
    } catch (error) {
      return { data: [], cursor: 0 as number }; // Return empty array for error handling
    }
  }

  async getEventByFilter(searchString?: string, selectedCategory?: string) {
    try {
      const response = await axios.get(
        `/api/users/search-events?search=${searchString}&category=${selectedCategory}`
      );
      const data: EventCardProps[] = response.data.data; // Assuming data is an array
      const cursor = response.data.cursor;

      return { data, cursor };
    } catch (error) {
      return { data: [], cursor: 0 as number }; // Return empty array for error handling
    }
  }

  async geEventById(eventId: number) {
    try {
      const response = await axios.get(`/api/users/events/${eventId}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
  async getMoreEvent(
    lastCursor: number,
    searchString?: string,
    selectedCategory?: string
  ) {
    try {
      const response = await axios.get(
        `/api/users/load-more?search=${searchString}&category=${selectedCategory}&cursor=${lastCursor}`
      );
      const data: EventCardProps[] = response.data.data; // Assuming data is an array
      const cursor = response.data.cursor;

      return { data, cursor };
    } catch (error) {
      return { data: [], cursor: 0 as number }; // Return empty array for error handling
    }
  }

  async getAllCategories() {
    try {
      const response = await axios.get("/api/users/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async createEvent(formData: FormData, adminToken: string) {
    try {
      const response = await axios.post("/api/admin/events", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      return response.data; // Mengembalikan data dari response
    } catch (error) {
      // Jika Anda menggunakan TypeScript, Anda dapat memeriksa tipe error di sini
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Gagal membuat event");
      }
      throw new Error("Gagal membuat event");
    }
  }

  async updateEvent(formData: FormData, event_id: number, adminToken: string) {
    try {
      const response = await axios.put(
        `/api/admin/events/${event_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      return response.data; // Mengembalikan data dari response
    } catch (error) {
      console.error("Error creating event:", error);
      // Jika Anda menggunakan TypeScript, Anda dapat memeriksa tipe error di sini
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Gagal membuat event");
      }
      throw new Error("Gagal membuat event");
    }
  }
}
