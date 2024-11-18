import { EventCardProps } from "@/models/models";
import axios from "axios";

export class EventHandlerApi {
  async getAllEvent() {
    try {
      const response = await axios.get(`/api/users/events`);
      // const response = await axios.get(
      //   `/api/users/events?${searchString ? `search=${searchString}` : ""}${selectedCategory?''}&category=${selectedCategory}&cursor=${lastCursor}`
      // );
      console.log({ data: response.data.data, cursor: response.data.cursor });
      const data: { data: EventCardProps; cursor: number } = {
        data: response.data.data,
        cursor: response.data.cursor,
      };
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  async getEventByFilter(searchString?: string, selectedCategory?: string) {
    console.log("Front End", searchString, selectedCategory);
    try {
      const response = await axios.get(
        `/api/users/search-events?search=${searchString}&category=${selectedCategory}`
      );
      const data: { data: EventCardProps; cursor: number } = {
        data: response.data.data,
        cursor: response.data.cursor,
      };
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  async geEventById(eventId: number) {
    try {
      const response = await axios.get(`/api/users/events/${eventId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("Error fetch events", error);
      return [];
    }
  }
  async getMoreEvent(
    lastCursor: number,
    searchString?: string,
    selectedCategory?: string
  ) {
    console.log("Search", searchString);
    try {
      const response = await axios.get(
        `/api/users/load-more?search=${searchString}&category=${selectedCategory}&cursor=${lastCursor}`
      );
      const data: { data: EventCardProps; cursor: number } = {
        data: response.data.data,
        cursor: response.data.cursor,
      };
      return data;
    } catch (error) {
      console.log("Error fetch events", error);
      return [];
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
      console.error("Error creating event:", error);
      // Jika Anda menggunakan TypeScript, Anda dapat memeriksa tipe error di sini
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Gagal membuat event");
      }
      throw new Error("Gagal membuat event");
    }
  }

  async updateEvent(formData: FormData, event_id: number, adminToken: string) {
    console.log("inputd data : ", formData);
    console.log(adminToken);
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
