// import axios from "axios";

// export const CreateEventAdmin = async (
//   formData: FormData,
//   adminToken: string
// ) => {
//   try {
//     const response = await axios.post("/api/admin/events", formData, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`,
//       },
//     });

//     return response.data; // Mengembalikan data dari response
//   } catch (error) {
//     // Jika Anda menggunakan TypeScript, Anda dapat memeriksa tipe error di sini
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Gagal membuat event");
//     }
//     throw new Error("Gagal membuat event");
//   }
// };
