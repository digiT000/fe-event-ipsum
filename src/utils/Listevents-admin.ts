import axios from "axios";
import Swal from "sweetalert2";

export const getAllEvents = async () => {
  try {
    // Mengambil data dari endpoint
    const response = await axios.get("/api/admin/events"); // Ganti dengan URL API Anda

    // Menampilkan notifikasi berhasil
    Swal.fire({
      icon: "success",
      title: "Sukses!",
      text: "Data event berhasil diambil.",
    });

    return response.data;
  } catch (error) {
    // Menampilkan notifikasi gagal
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Tidak dapat mengambil data event. Silakan coba lagi.",
    });

    console.error("Error fetching events:", error);
  }
};

//   // Contoh fungsi untuk membuat event baru
//   const createEvent = async (formData: any) => {
//     try {
//       const response = await axios.post('http://url-to-your-database-api/events', {
//         data: formData,
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error('Gagal membuat event');
//     }
//   };

//   // Contoh fungsi untuk mengambil data event berdasarkan ID
//   const getEventById = async (eventId: number) => {
//     try {
//       const response = await axios.get(`http://url-to-your-database-api/events/${eventId}`);
//       return response.data;
//     } catch (error) {
//       throw new Error('Gagal mengambil event');
//     }
//   };

// Contoh fungsi untuk mengupdate data event berdasarkan ID
