import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { user } from "@/models/listUsers"; // Pastikan tipe user sesuai dengan struktur data
import Swal from "sweetalert2";
import NavigationBar from "@/components/NavigationBar";
import { useAuth } from "@/utils/userContext";
import Cookies from "js-cookie";
import { UniqueCode } from "@/models/models";
import Header from "@/components/Header";

const Index = () => {
  const adminToken = Cookies.get(`access${UniqueCode.ADMIN}_token`);
  // Menggunakan nama state yang lebih deskriptif
  const [users, setUsers] = useState<user[]>([]);
  const isInitialRender = useRef<boolean>(true); // Check if its already be render or not

  const { user, isLogin, isLoading } = useAuth();

  // Fungsi untuk mengambil data users
  const getAllUsers = async () => {
    try {
      // Tampilkan loading SweetAlert
      Swal.fire({
        title: "Loading...",
        text: "Memuat data pengguna, harap tunggu.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 6000,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Memanggil API untuk mendapatkan data users
      const response = await axios.get("/api/admin/list-users", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.status === 200 && response.data) {
        // Menyimpan data jika berhasil
        setUsers(response.data);
        Swal.close(); // Menutup SweetAlert setelah data berhasil dimuat
      } else {
        throw new Error("Gagal mendapatkan data");
      }

      return response.data; // Mengembalikan data
    } catch (error) {
      // Menampilkan pesan error jika terjadi kesalahan
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Tidak dapat mengambil data pengguna. Silakan coba lagi.",
      });
      console.error("Error fetching users:", error);
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
    if (isInitialRender.current) {
      if (!isLoading) {
        if (user?.user_role === "admin") {
          getAllUsers();
          isInitialRender.current = false;
        } else {
          console.log("execute if user are not admin");
          handleUnAuthorized();
        }
      }
    }
  }, [isLoading]);

  return (
    <>
      <Header>
        <title>List Users | Admin</title>
      </Header>
      <NavigationBar userRole="admin" isLogin={isLogin} />

      {user?.user_role === "admin" ? (
        <div className="container mx-auto mt-10">
          <h1 className="text-2xl font-bold text-gray-800">LIST USER</h1>

          <table className="min-w-full bg-white border border-gray-300 mt-10">
            <thead>
              <tr>
                <th className="border px-4 py-2 bg-slate-100">Name</th>

                <th className="border px-4 py-2 bg-slate-100">Email</th>

                <th className="border px-4 py-2 bg-slate-100">Points</th>

                <th className="border px-4 py-2 bg-slate-100">Use Referral</th>

                <th className="border px-4 py-2 bg-slate-100">Referral Code</th>

                <th className="border px-4 py-2 bg-slate-100">Register At</th>
              </tr>
            </thead>

            <tbody>
              {users?.length > 0 ? (
                users.map((user: user, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2"> {user.name}</td>
                    <td className="border px-4 py-2"> {user.email}</td>
                    <td className="border px-4 py-2"> {user.points}</td>
                    <td className="border px-4 py-2">
                      {user.user_referral.total_use}
                    </td>
                    <td className="border px-4 py-2">
                      {user.user_referral.referral_code}
                    </td>
                    <td className="border px-4 py-2">
                      {" "}
                      Register At {user.created_at}
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
};

export default Index;
