import { LoginAuth, RegisterForm, ReviewData } from "@/models/models";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UniqueCode } from "@/models/models";

export class AuthHandler {
  // Fungsi untuk validasi form login
  handleLoginValidation(formData: LoginAuth) {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // Pola regex untuk validasi email
    const checkEmail = emailPattern.test(formData.email); // Mengecek apakah email sesuai dengan pola

    // Mengembalikan true jika email atau password kosong atau email tidak valid
    if (formData.email === "" || formData.password === "" || !checkEmail) {
      return true;
    } else {
      return false; // Mengembalikan false jika semua validasi terpenuhi
    }
  }

  handleRegistrationValidation(formData: RegisterForm) {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // Pola regex untuk validasi email
    const checkEmail = emailPattern.test(formData.email); // Mengecek apakah email sesuai dengan pola

    // Mengembalikan true jika salah satu kondisi tidak terpenuhi (email atau password kosong, password kurang dari 6 karakter, nama kosong, atau email tidak valid)
    if (
      formData.email === "" ||
      formData.password === "" ||
      formData.password.length < 6 ||
      formData.name === "" ||
      !checkEmail
    ) {
      return true;
    } else {
      return false; // Mengembalikan false jika semua validasi terpenuhi
    }
  }

  handleReviewValidation(reviewData: ReviewData) {
    // Validasi reviewData disini

    if (reviewData.isAttend) {
      // Validasi review_content dan review_rating disini
      if (reviewData.review_content === "" || reviewData.review_rating === 0) {
        return true;
      } else {
        return false;
      }
    } else if (!reviewData.isAttend) {
      return false;
    } else {
      return true;
    }
  }

  // Fungsi untuk mengirim data login ke server
  async handleSubmitData(formData: LoginAuth, scope: "user" | "admin") {
    try {
      const response = await axios.post(
        scope == "user" ? "/api/auth/login-user" : "/api/auth-admin/login",
        {
          email: formData.email, // Mengirim email dari form
          password: formData.password, // Mengirim password dari form
        }
      );
      const data = response.data; // Menyimpan respons data

      // Jika respons status adalah 200, set cookies untuk access_token dan refresh_token
      if (response.status === 200) {
        const in60Minutes = 60 / (24 * 60); // Mengatur masa kedaluwarsa access_token (60 menit)
        const uniqueCode =
          scope === "user" ? UniqueCode.USER : UniqueCode.ADMIN;

        Cookies.set(`access${uniqueCode}_token`, data.data.access_token, {
          expires: in60Minutes, // Cookie access_token kedaluwarsa dalam 1 jam
        });
        Cookies.set(
          `refresh${uniqueCode}_token`,
          data.data.user.refresh_token,
          {
            expires: 7,
          }
        );
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.log(error); // Menampilkan error jika terjadi kesalahan
      return error;
    }
  }

  async handleUserLogout(token: string) {
    try {
      const response = await axios.put(
        "/api/auth/logout-user",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {}
  }
  // Fungsi untuk mengirim data registrasi ke server
  async handleRegistrationUser(formData: RegisterForm) {
    try {
      const response = await axios.post("/api/auth/register-user", {
        name: formData.name, // Mengirim nama dari form
        email: formData.email, // Mengirim email dari form
        password: formData.password, // Mengirim password dari form
        role: "user", // Mengatur role user sebagai "user"
      });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  }

  async validateUserToken(token: string) {
    try {
      const response = await axios.get("/api/auth/validate-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Set the data from the response to userState
      if (response) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      return error;
    }
  }

  async refreshUserAcessToken(refreshToken: string) {
    try {
      // Get new access token
      const response = await axios.get("/api/auth/update-token", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.data.data.code === "GUT") {
        // Get New Access Token
        const newAccessToken = response.data.data.accessToken;
        const in60Minutes = 60 / (24 * 60);

        const uniqueCode =
          response.data.data.user_role === "user"
            ? UniqueCode.USER
            : UniqueCode.ADMIN;

        // Check if return access token
        if (!newAccessToken) {
          return undefined;
        }

        // Update access token in cookies
        Cookies.set(`access${uniqueCode}_token`, newAccessToken, {
          expires: in60Minutes,
        });

        // Validate access token after refreshing it
        try {
          const validateResponse = await this.validateUserToken(newAccessToken);
          if (validateResponse) {
            return validateResponse;
          } else {
            return null;
          }
        } catch (error) {
          console.log("Error validating token after refresh", error);
        }
      }
    } catch (error) {
      Cookies.remove(`access${UniqueCode.USER}_token`);
      Cookies.remove(`refresh${UniqueCode.USER}_token`);
      Cookies.remove(`access${UniqueCode.ADMIN}_token`);
      Cookies.remove(`refresh${UniqueCode.ADMIN}_token`);
    }
  }

  redirectIfUserLogin() {
    const router = useRouter();
    useEffect(() => {
      // Check if user is already logged in
      const accessToken = Cookies.get(`access${UniqueCode.USER}_token`);
      const refreshToken = Cookies.get(`refresh${UniqueCode.USER}_token`);
      if (accessToken || refreshToken) {
        router.push("/"); // Redirect to home page if already logged in
      }
    }, []);
    return null;
  }

  redirectIfUserNotLogin() {
    const router = useRouter();
    useEffect(() => {
      // Check if user is already logged in
      const accessToken = Cookies.get(`access${UniqueCode.USER}_token`);
      const refreshToken = Cookies.get(`refresh${UniqueCode.USER}_token`);
      if (!accessToken || !refreshToken) {
        router.push("/"); // Redirect to home page if already logged in
      }
    }, []);
    return null;
  }
}
