import { LoginAuth } from "@/models/models";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthHandler } from "@/utils/authValidation";
import Button from "@/components/Button";
import Link from "next/link";
import { useAuth } from "@/utils/userContext";
import ToastAlert, { Toast } from "@/components/alert";
import Header from "@/components/Header";

function LoginPage() {
  const authHandler = new AuthHandler();
  // Check if the user already login or not
  authHandler.redirectIfUserLogin();

  const router = useRouter();
  const { userLogin } = useAuth();

  // Disable Button
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false); // Track data loading state
  // Toast State
  const [toast, setToast] = useState<Toast>({
    highlightText: "",
    text: "",
    type: "FAILED",
    showToast: false,
  });

  // LOGIN STATE
  const [formData, setFormData] = useState<LoginAuth>({
    email: "",
    password: "",
  });

  //   Handle change email
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      email: e.target.value,
      password: formData.password,
    });
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      email: formData.email,
      password: e.target.value,
    });
  };

  //   Handle Submit Button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setIsButtonDisabled(true);
      const response = await authHandler.handleSubmitData(formData, "user");
      console.log("Respone Handle Submit : ", response);
      if (response?.status === 200) {
        console.log("status === 200");
        userLogin(response.data.user);
        router.push("/");
      } else {
        console.log("error : ", response);
        setToast({
          highlightText: "Login Failed",
          text: "Invalid Email or Password",
          type: "FAILED",
          showToast: true,
        });
        setIsLoading(false);
        setIsButtonDisabled(false);
        setTimeout(() => {
          setToast({ ...toast, showToast: false });
        }, 1500);
      }
    } catch (error) {
      console.log("Something went wrong :", error);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(authHandler.handleLoginValidation(formData));
  }, [formData.email, formData.password]);

  return (
    <>
      <Header>
        <title>Login Page</title>
      </Header>
      <ToastAlert
        type={toast.type}
        highlightText={toast.highlightText}
        text={toast.text}
        showToast={toast.showToast}
      />
      <div className="p-4 md:flex md:h-screen md:justify-center md:items-center ">
        <div className="max-w-screen-sm mx-auto  p-5 border border-zinc-200 rounded bg-white md:p-10 ">
          <h1 className="font-bold text-2xl mb-9 md:text-3xl">
            LOGIN TO YOUR ACCOUNT
          </h1>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-6">
              <label className="block mb-2  font-medium text-gray-900 ">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="bg-zinc-100 hover:bg-zinc-200 transition-all	 text-gray-900 text-sm rounded-sm  block w-full p-3 "
                placeholder="Ex : youremail@example.com"
                value={formData.email}
                onChange={handleChangeEmail}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-900 ">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-zinc-100 hover:bg-zinc-200 transition-all	 text-gray-900 text-sm rounded-sm  block w-full p-3 "
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChangePassword}
                required
              />
            </div>
            <Button
              isLoading={isLoading}
              isButton={true}
              width="w-fit"
              type="primary"
              text="Login"
              isButtonDisable={isButtonDisabled}
            />
          </form>

          <p className="text-gray-900">
            Don’t have an account?{" "}
            <Link
              className="underline text-indigo-600 font-bold hover:text-indigo-800"
              href={"/auth/register"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
