import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  month: number; // Ubah menjadi number, karena biasanya bulan diterima dalam format angka
  count: number;
}

interface chartComponentProps {
  adminToken: string; // Token admin yang digunakan untuk mengakses API
}

const MyBarChartTransaction = ({ adminToken }: chartComponentProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Fungsi untuk mengonversi angka bulan ke nama bulan
  const getMonthName = (monthNumber: number): string => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[monthNumber - 1]; // bulan dimulai dari 1, jadi kita sesuaikan dengan index array
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "/api/admin/dashboard/total-montly-transaction",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        // Konversi angka bulan menjadi nama bulan
        const transformedData = response.data.map((item: ChartData) => ({
          ...item,
          month: getMonthName(item.month), // Mengubah angka bulan menjadi nama bulan
        }));
        setChartData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const canvas = chartRef.current as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (ctx) {
        // Create a new chart instance and store it in the ref
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartData.map((item) => item.month), // Menggunakan nama bulan
            datasets: [
              {
                label: "Total Transactions",
                data: chartData.map((item) => item.count),
                backgroundColor: "#059669",
                borderWidth: 1,
                borderColor: "#dedede",
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: "category",
                ticks: {
                  color: "#3d3d3d", // Mengganti warna font sumbu X menjadi putih
                  font: {
                    family: "sans-serif",
                    size: 13, // Ukuran font pada sumbu X
                    weight: "bold",
                  },
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  color: "#3d3d3d", // Mengganti warna font sumbu Y menjadi putih
                  font: {
                    family: "sans-serif",
                    size: 13, // Ukuran font pada sumbu Y
                    weight: "bold",
                  },
                },
              },
            },
            plugins: {
              title: {
                display: true,
                color: "white", // Mengganti warna font title menjadi putih
                font: {
                  size: 16, // Ukuran font title
                },
              },
              tooltip: {
                titleColor: "white", // Mengganti warna font title tooltip menjadi putih
                bodyColor: "white", // Mengganti warna font body tooltip menjadi putih
                backgroundColor: "black", // Warna latar belakang tooltip
              },
              legend: {
                labels: {
                  color: "#3d3d3d", // Mengganti warna font legend menjadi putih
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return <canvas ref={chartRef} />;
};

export default MyBarChartTransaction;
