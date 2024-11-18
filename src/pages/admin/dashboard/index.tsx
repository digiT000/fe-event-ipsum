import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/utils/userContext";
import axios from "axios";
import MyBarChart from "@/components/analytics/analytics.monthly.registration";
import MyBarChartTransaction from "@/components/analytics/analyics.monthly.transaction";
import NavigationBar from "@/components/NavigationBar";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { UniqueCode } from "@/models/models";
import Header from "@/components/Header";

// Definisikan interface untuk struktur data dashboard
interface DashboardData {
  totalUsers: number;
  totalEvents: number;
  totalPaids: number;
  totalPaidValues: number;
  // totalRegistration: number;
  // totalTransaction: number;
}

function AdminDashboard() {
  const adminToken = Cookies.get(`access${UniqueCode.ADMIN}_token`);
  const { isLogin, isLoading, user } = useAuth();
  // State untuk menyimpan data dashboard
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalUsers: 0,
    totalEvents: 0,
    totalPaids: 0,
    totalPaidValues: 0,
    // totalRegistration: 0,
    // totalTransaction: 0,
  });

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

  async function handleFethindData() {
    try {
      // Menggunakan Promise.all untuk fetch data dari 4 endpoint secara paralel
      await Promise.all([
        axios.get("/api/admin/dashboard/total-users", {
          headers: {
            Authorization: `Bearer ${adminToken as string}`,
          },
        }),
        axios.get("/api/admin/dashboard/total-listevents", {
          headers: {
            Authorization: `Bearer ${adminToken as string}`,
          },
        }),
        axios.get("/api/admin/dashboard/total-transaction", {
          headers: {
            Authorization: `Bearer ${adminToken as string}`,
          },
        }),
        axios.get("/api/admin/dashboard/total-transaction-value", {
          headers: {
            Authorization: `Bearer ${adminToken as string}`,
          },
        }),
        // axios.get("/api/admin/dashboard/total-registration"),
        // axios.get("/api/admin/dashboard/total-transaction"),
      ]).then((responses) => {
        // Pastikan setiap response berisi data yang sesuai
        const totalUsers = responses[0]?.data?.userCount || 0;
        const totalEvents = responses[1]?.data?.totalEvents || 0;
        const totalPaids = responses[2]?.data?.data || 0;
        const totalPaidValues = responses[3]?.data?._sum.payment_ammount || 0;
        // const totalRegistration = responses[4]?.data?.totalRegistration || 0;
        // const totalTransaction = responses[5]?.data?.totalTransaction || 0;

        // Mengupdate state dengan data yang diperoleh
        setDashboard({
          totalUsers,
          totalEvents,
          totalPaids,
          totalPaidValues,
          // totalRegistration,
          // totalTransaction,
        });
      });
    } catch (error) {
      // Menambahkan log lebih rinci untuk debugging
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    // Fungsi untuk mengambil data dari setiap endpoint

    if (!isLoading) {
      if (user?.user_role === "admin") {
        handleFethindData();
      } else {
        handleUnAuthorized();
      }
    }

    // Memanggil fungsi fetchData saat komponen pertama kali di-render
  }, [isLoading]); // Empty array berarti efek hanya dijalankan sekali saat mount

  return (
    <>
      <Header>
        <title>Dashboard | Admin</title>
      </Header>
      <NavigationBar userRole="admin" isLogin={isLogin} />
      {user?.user_role === "admin" ? (
        <>
          <section className="max-w-screen-xl mx-auto py-10 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col items-center gap-3 justify-center w-full p-4  bg-zinc-50 rounded-md border border-zinc-200">
                <Image
                  alt="user registration"
                  src={"/icon/group-2-line.svg"}
                  width={64}
                  height={64}
                  className="w-6 h-6"
                />
                <div className="text-sm text-center text-gray-600">
                  Total User Registration
                </div>
                <div className="text-xl font-bold">{dashboard.totalUsers}</div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center gap-3 justify-center w-full p-4  bg-zinc-50 rounded-md border border-zinc-200">
                <Image
                  alt="Event create"
                  src={"/icon/briefcase-2-line.svg"}
                  width={64}
                  height={64}
                  className="w-6 h-6"
                />
                <div className="text-sm text-center text-gray-600">
                  Total Event Create
                </div>
                <div className="text-xl font-bold">{dashboard.totalEvents}</div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col items-center gap-3 justify-center w-full p-4  bg-zinc-50 rounded-md border border-zinc-200">
                <Image
                  alt="Total Transaction"
                  src={"/icon/file-check-line.svg"}
                  width={64}
                  height={64}
                  className="w-6 h-6"
                />
                <div className="text-sm text-center text-gray-600">
                  Total Transaction (Paid)
                </div>
                <div className="text-xl font-bold">{dashboard.totalPaids}</div>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col items-center gap-3 justify-center w-full p-4  bg-zinc-50 rounded-md border border-zinc-200">
                <Image
                  alt="user registration"
                  src={"/icon/coins-line.svg"}
                  width={64}
                  height={64}
                  className="w-6 h-6"
                />
                <div className="text-sm text-center text-gray-600">
                  Total Transaction Value (Paid)
                </div>
                <div className="text-xl font-bold">
                  {dashboard.totalPaidValues}
                </div>
              </div>
            </div>
          </section>
          <section className="max-w-screen-xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
              <div className=" flex flex-col  py-10 px-10 bg-zinc-50 border border-zinc-200 rounded-lg w-full ">
                <h3 className="text-lg text-gray-900 font-bold">
                  Total Registration for the last 6 month
                </h3>
                <MyBarChart adminToken={adminToken as string} />
              </div>
              <div className="flex flex-col  py-10 px-10 bg-zinc-50 border border-zinc-200 rounded-lg w-full ">
                <h3 className="text-lg text-gray-900 font-bold">
                  Total Transaction for the last 6 month
                </h3>
                <MyBarChartTransaction adminToken={adminToken as string} />
              </div>
            </div>
          </section>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default AdminDashboard;
