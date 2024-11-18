// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"; // Mengimpor tipe bawaan Next.js untuk permintaan dan respons API

// Mendefinisikan tipe Data untuk format respons API
type Data = {
  name: string;
};

// Handler utama untuk menangani request yang masuk
export default function handler(
  req: NextApiRequest, // Tipe NextApiRequest digunakan untuk mendefinisikan struktur request
  res: NextApiResponse<Data>, // Tipe NextApiResponse digunakan untuk mendefinisikan struktur response, menggunakan tipe Data
) {
  // Mengirimkan respons status 200 (OK) dengan data JSON yang berisi { name: "John Doe" }
  res.status(200).json({ name: "John Doe" });
}

