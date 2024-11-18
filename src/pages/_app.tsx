import "@/styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { AuthProvider } from "@/utils/userContext";

// axios.defaults.baseURL = 'https://api.example.com'; // Replace with your API endpoint URL
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
