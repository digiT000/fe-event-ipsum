import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Event } from "@/models/createevent";
import Link from "next/link";
import { useAuth } from "@/utils/userContext";
import NavigationBar from "@/components/NavigationBar";
import Header from "@/components/Header";
import Cookies from "js-cookie";
import { UniqueCode } from "@/models/models";

function Listevent() {
  const adminToken = Cookies.get(`access${UniqueCode.ADMIN}_token`);
  const [events, setEvents] = useState([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const isInitialRender = useRef<boolean>(true); // Check if its already be render or not
  const { user, isLogin, isLoading } = useAuth();

  async function eventsearch(search: string) {
    try {
      const response = await axios.get(
        `/api/admin/events-search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      console.log("search", response.data.data);
      return response.data.data;
    } catch (error) {}
  }

  const getAllEvents = async () => {
    try {
      // Tampilkan loading SweetAlert
      Swal.fire({
        title: "Loading...",
        text: "Memuat data event, harap tunggu.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 6000,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.get("/api/admin/events", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }); // Ganti dengan URL API Anda
      // Jika respons berhasil, set data dan tutup SweetAlert
      if (response) {
        setEvents(response.data.data);
      }

      Swal.close(); // Tutup loading setelah data berhasil diambil
      return response.data.data;
    } catch (error) {
      // Tampilkan pesan error jika terjadi kesalahan
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Tidak dapat mengambil data event. Silakan coba lagi.",
      });

      console.error("Error fetching events:", error);
    }
  };

  // Handle Input Search (Debounced)
  function handleInputSearch(newValue: string) {
    setInputSearch(newValue); // Update state first
  }

  // Handler Searching Event
  async function handlerSearchingEvent(inputSearch: string) {
    if (inputSearch === "") {
      const response = await getAllEvents();
      setEvents(response);
    } else {
      try {
        // setIsLoading(true); // set loading to true
        const response = await eventsearch(inputSearch);
        setEvents(response);
      } catch (error: any) {
        // setError(error.message);
      } finally {
        // setIsLoading(false);
      }
    }
  }

  const handleEdit = (eventId: number) => {
    // Menampilkan konfirmasi menggunakan SweetAlert
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan diarahkan ke halaman edit event ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, edit!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengonfirmasi, arahkan ke halaman edit
        window.location.href = `/admin/update-event/${eventId}`;
      } else {
      }
    });
  };

  function handleUnAuthorized() {
    Swal.fire({
      title: "You need to login as admin!",
      icon: "error",
      confirmButtonText: "Back to login",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/admin/auth";
      }
    });
  }

  function handleDelete(event_id: number) {
    Swal.fire({
      title: "Are you sure want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/admin/events/${event_id}`, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          })
          .then(() => {
            Swal.fire("Event berhasil dihapus!", "", "success");
            getAllEvents(); // Refresh daftar event setelah penghapusan
          })
          .catch((error) => {
            console.error("Gagal menghapus event:", error);
            Swal.fire("Terjadi kesalahan saat menghapus event", "", "error");
          });
      }
    });
  }

  useEffect(() => {
    if (isInitialRender.current) {
      if (!isLoading) {
        if (user?.user_role === "admin") {
          getAllEvents();
          isInitialRender.current = false;
        } else {
          console.log("execute if user are not admin");
          handleUnAuthorized();
        }
      }
    } else {
      const timeoutId = setTimeout(() => {
        handlerSearchingEvent(inputSearch);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, inputSearch]);

  return (
    <>
      <Header>
        <title>List Events | Admin</title>
      </Header>
      <NavigationBar userRole="admin" isLogin={isLogin} />
      {user?.user_role === "admin" ? (
        <div className="container mx-auto mt-10">
          <h1 className="text-2xl font-bold text-gray-800">LIST EVENT</h1>
          <div className="flex justify-between mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={inputSearch}
                onChange={(e) => handleInputSearch(e.target.value)}
                className="w-64 pl-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div>
              <select className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Status</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
            </div>
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              href="/admin/create-events"
            >
              CREATE EVENTS
            </Link>
          </div>

          <table className="min-w-full bg-white border border-gray-300 mt-10">
            <thead>
              <tr>
                <th className="border px-4 py-2">Title</th>

                <th className="border px-4 py-2">Category</th>

                <th className="border px-4 py-2">Quota</th>

                <th className="border px-4 py-2">Status</th>

                <th className="border px-4 py-2">End Date</th>

                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.length > 0 ? (
                events.map((event: Event, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{event.event_name}</td>
                    <td className="border px-4 py-2">{event.category_name}</td>
                    <td className="border px-4 py-2">{event.event_capacity}</td>
                    <td className="border px-4 py-2">{event.event_status}</td>
                    <td className="border px-4 py-2">
                      {event.event_end_date as string}
                    </td>
                    <td className="border px-4 py-2">
                      <Link
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Mencegah navigasi default
                          handleEdit(event.event_id); // Memanggil fungsi handleEdit
                        }}
                      >
                        Edit
                      </Link>

                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(event.event_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center">
                    No events available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Listevent;
