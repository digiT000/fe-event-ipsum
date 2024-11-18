import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UpdateEventAdmin } from "@/utils/Update-event-admin";
import { UpdateEvent } from "@/models/createevent";
import axios from "axios";
import Swal from "sweetalert2";
import NavigationBar from "@/components/NavigationBar";
import { useAuth } from "@/utils/userContext";
import { EventHandlerApi } from "@/utils/eventHandler";
import Cookies from "js-cookie";
import { UniqueCode } from "@/models/models";
import { Category } from "@/models/categoryList";

function UpdateEvents() {
  const adminToken = Cookies.get(`access${UniqueCode.ADMIN}_token`);
  const eventHandler = new EventHandlerApi();
  const router = useRouter();

  // const { eventId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event_id, setEventId] = useState(0);
  const { user, isLogin, isLoading } = useAuth();
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [formData, setFormData] = useState<UpdateEvent>({
    event_name: "",
    event_image: "",
    event_description: "",
    event_price: 0,
    event_location: "",
    event_capacity: 0,
    categoryId: 0, // Misalkan kita set default ID kategori
    event_start_date: "",
    event_end_date: "",
    is_online: true, // Default ke online
    is_paid: false, // Default ke gratis
    discount_percentage: 0,
    is_active: true, // Default ke active
    discountId: 0,
  });
  console.log(formData);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleFetchCategory() {
    try {
      const response = await eventHandler.getAllCategories();
      setCategoryList(response.data);
    } catch (error) {
      return error;
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("testiiii", formData);
    // Validasi form data
    if (!formData.event_name || formData.event_name.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Nama event wajib di isi !",
      });
      return;
    }

    if (
      !formData.event_capacity ||
      isNaN(formData.event_capacity) ||
      formData.event_capacity <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Kapasitas event harus berupa angka dan lebih besar dari 0.",
      });
      return;
    }

    if (
      !formData.categoryId ||
      isNaN(formData.categoryId) ||
      formData.categoryId <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Category event harus di pilih",
      });
      return;
    }

    if (
      !formData.event_description ||
      formData.event_description.trim() === ""
    ) {
      Swal.fire({
        text: "Deskripsi wajib di isi !",
        icon: "error",
        title: "Oops...",
      });
      return;
    }

    if (formData.is_paid === true) {
      if (formData.event_price === undefined || formData.event_price <= 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Harga event harus berupa angka dan lebih besar dari 0.",
        });
        return;
      }
      if (
        formData.discount_percentage === undefined ||
        formData.discount_percentage <= 0
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Persentase diskon harus antara 0 dan 100.",
        });
        return;
      }
    }

    if (!formData.event_start_date) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tanggal mulai event wajib di isi",
      });
      return;
    }

    if (!formData.event_end_date) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tanggal selesai event wajib di isi",
      });
      return;
    }

    if (
      new Date(formData.event_start_date) > new Date(formData.event_end_date)
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tanggal mulai event harus sebelum tanggal selesai event.",
      });
      return;
    }

    if (formData.is_online === true) {
      if (formData.is_online === undefined) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Status event online harus di pilih",
        });
        return;
      }
    }

    if (formData.is_online === false) {
      if (formData.is_online === undefined) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Status event online harus di pilih",
        });
        return;
      }
      if (formData.event_location.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Lokasi event wajib di isi",
        });
        return;
      }
    }

    const data = new FormData();
    data.append("event_name", formData.event_name);
    data.append("event_description", formData.event_description);
    data.append("event_price", formData.event_price.toString());
    data.append("event_location", formData.event_location);
    data.append("event_capacity", formData.event_capacity.toString());
    data.append("categoryId", formData.categoryId.toString());
    data.append("event_start_date", formData.event_start_date);
    data.append("event_end_date", formData.event_end_date);
    data.append("is_online", formData.is_online.toString());
    data.append("is_paid", formData.is_paid.toString());
    data.append("discount_percentage", formData.discount_percentage.toString());
    data.append("is_active", formData.is_active.toString());
    data.append("event_image", formData.event_image);
    data.append("discountId", formData?.discountId.toString());
    console.log("ini data:", data);

    try {
      await eventHandler
        .updateEvent(data, event_id, adminToken as string)
        .then((response) => {
          if (response) {
            console.log(response);
            alert("Event berhasil update!");
            router.push("/admin/list-events");
          }
        });
    } catch (error) {
      alert("Terjadi kesalahan: ");
    }
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

  useEffect(() => {
    const { eventId } = router.query;
    if (!eventId) return; // Pastikan ID sudah ada sebelum melakukan fetch
    setEventId(Number(eventId));

    if (!isLoading) {
      console.log("execute if user are admin");
      if (user?.user_role === "admin") {
        const fetchEvent = async () => {
          try {
            handleFetchCategory();
            const response = await axios.get(`/api/admin/events/${eventId}`, {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            });
            const data = response.data.data;
            console.log(response);
            setFormData({
              categoryId: data.categoryId,
              event_name: data.event_name,
              discount_percentage: data.Discount.discount_percentage,
              event_capacity: data.event_capacity,
              event_description: data.event_description,
              event_end_date: new Date(data.event_end_date)
                .toISOString()
                .split("T")[0],
              event_image: data.event_image,
              event_location: data.event_location,
              event_price: data.event_price,
              event_start_date: new Date(data.event_start_date)
                .toISOString()
                .split("T")[0],
              is_active: data.Discount.is_active,
              is_online: data.is_online,
              is_paid: data.is_paid,
              discountId: data.discountId,
            });
          } catch (err) {
            setError(null);
          } finally {
            setLoading(false);
          }
        };

        fetchEvent();
      } else {
        console.log("execute if user are not admin");
        handleUnAuthorized();
      }
    }
  }, [isLoading, router.query]);

  // const handleSubmit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`http://localhost:5000/events/}`, formData); // Ganti dengan URL API yang sesuai
  //     router.push("/"); // Redirect ke halaman daftar event setelah berhasil update
  //   } catch (err) {
  //     setError(null);
  //   }
  // };

  return (
    <>
      <NavigationBar userRole="admin" isLogin={isLogin} />

      {user?.user_role === "admin" ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-100">
            <div className="container mx-auto p-6">
              <h1 className="text-3xl font-bold mb-6"> UPDATE EVENT</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Event Name */}
                <div>
                  <label
                    htmlFor="event-title"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="event-title"
                    name="event_name"
                    value={formData.event_name}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "event_name", value: e.target.value },
                      })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Ex: Tech Conference 2024"
                  />
                </div>

                {/* Event Image */}
                <div>
                  <label
                    htmlFor="event-image"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Event Image
                  </label>
                  <input
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleChange({
                          target: {
                            name: "event_image",
                            value: e.target.files[0],
                          },
                        });
                      }
                    }}
                    type="file"
                    id="event-image"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Event Quota */}
                <div>
                  <label
                    htmlFor="quota-event"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Quota Event
                  </label>
                  <input
                    type="number"
                    id="quota-event"
                    name="event_capacity"
                    value={formData.event_capacity}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "event_capacity",
                          value: e.target.value,
                        },
                      })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Ex: 25"
                  />
                </div>

                {/* Event Category */}
                <div>
                  <label
                    htmlFor="event-category"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Event Category
                  </label>
                  <select
                    id="event-category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "categoryId", value: e.target.value },
                      })
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value={0}>Select Category</option>
                    {categoryList.map((category: Category, index: number) => {
                      return (
                        <option key={index} value={category.category_id}>
                          {category.category_name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Event Description */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="event-description"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Event Description
                  </label>
                  <textarea
                    id="event-description"
                    name="event_description"
                    value={formData.event_description}
                    rows={6}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "event_description",
                          value: e.target.value,
                        },
                      })
                    }
                    className="resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Describe the event..."
                  ></textarea>
                </div>

                {/* Paid/Free Event Radio */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="paid-or-free"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Paid Or Free Event
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paidEvent"
                        name="is_paid"
                        checked={formData.is_paid === true}
                        onChange={(e) =>
                          handleChange({
                            target: { name: "is_paid", value: true },
                          })
                        }
                      />
                      <label htmlFor="paidEvent" className="ml-2 font-medium">
                        Paid Event
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="freeEvent"
                        name="is_paid"
                        checked={formData.is_paid === false}
                        onChange={(e) =>
                          handleChange({
                            target: { name: "is_paid", value: false },
                          })
                        }
                      />
                      <label htmlFor="freeEvent" className="ml-2 font-medium">
                        Free Event
                      </label>
                    </div>
                  </div>
                </div>

                {/* Event Price */}
                {formData.is_paid && (
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      htmlFor="eventPrice"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Event Price
                    </label>
                    <input
                      type="number"
                      id="eventPrice"
                      name="event_price"
                      value={formData.event_price}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "event_price",
                            value: e.target.value,
                          },
                        })
                      }
                      placeholder="Ex: 25000"
                      className="border rounded-md px-3 py-2 w-full"
                    />
                  </div>
                )}

                {/* Discount Percentage - Hide if Free Event */}
                {formData.is_paid && (
                  <div className="flex gap-4 col-span-1 sm:col-span-2">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="discountPercentage"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        Set Event Discount
                      </label>
                      <input
                        type="number"
                        id="discountPercentage"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "discount_percentage",
                              value: e.target.value,
                            },
                          })
                        }
                        placeholder="Discount Percentage"
                        className="border rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="Discount_active"
                        name="Discount_active"
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "Discount_active",
                              value: e.target.checked,
                            },
                          })
                        }
                      />
                      <label htmlFor="Discount_active" className="ml-2">
                        Set discount to active
                      </label>
                    </div>
                  </div>
                )}

                {/* Event Start & End Dates */}
                <div className="flex gap-4 col-span-1 sm:col-span-2">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="eventStartDate"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Set start date
                    </label>
                    <input
                      type="date"
                      id="eventStartDate"
                      name="event_start_date"
                      value={formData.event_start_date}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "event_start_date",
                            value: e.target.value,
                          },
                        })
                      }
                      className="border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="eventEndDate"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Set end date
                    </label>
                    <input
                      type="date"
                      id="eventEndDate"
                      name="event_end_date"
                      value={formData.event_end_date}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "event_end_date",
                            value: e.target.value,
                          },
                        })
                      }
                      className="border rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Location Online or Offline */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="is_online"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Location Online or Offline
                  </label>

                  {/* Radio Button for Event Location */}
                  <div className="flex items-center space-x-4 flex-wrap">
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="is_online"
                          name="is_online"
                          checked={formData.is_online === true}
                          onChange={(e) =>
                            handleChange({
                              target: { name: "is_online", value: true },
                            })
                          }
                        />
                        <label htmlFor="is_online" className="ml-2 font-medium">
                          Online
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="is_offline"
                          name="is_online"
                          checked={formData.is_online === false}
                          onChange={(e) =>
                            handleChange({
                              target: { name: "is_online", value: false },
                            })
                          }
                        />
                        <label
                          htmlFor="is_offline"
                          className="ml-2 font-medium"
                        >
                          Offline
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Event Location (Tampil hanya jika Offline) */}
                  {formData.is_online === false && (
                    <div className="col-span-1 sm:col-span-2 mt-5">
                      <label
                        htmlFor="event-location"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        Event Location
                      </label>
                      <textarea
                        id="event-location"
                        name="event_location"
                        value={formData.event_location}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "event_location",
                              value: e.target.value,
                            },
                          })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Event Location"
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-2">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  >
                    Update Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        ""
      )}
    </>
  );
}

export default UpdateEvents;
