import axios from "axios";

export const UpdateEventAdmin = async (formData: any, event_id: number) => {
  const discountPercentage = formData.discounted_price;
  const is_active = formData.is_active;

  console.log("inputd data : ", formData);
  try {
    const response = await axios.put(`/api/admin/events/${event_id}`, formData);

    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error creating event:", error);
    // Jika Anda menggunakan TypeScript, Anda dapat memeriksa tipe error di sini
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Gagal membuat event");
    }
    throw new Error("Gagal membuat event");
  }
};
