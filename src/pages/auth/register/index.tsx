import { RegisterForm } from "@/models/models";
import React, { useState, useEffect, useRef } from "react";
import { AuthHandler } from "@/utils/authValidation";
import ToastAlert, { Toast } from "@/components/alert";

import Button from "@/components/Button";
import Link from "next/link";
import Header from "@/components/Header";
// Import useRouter from next/router

function RegisterPage() {
  const authHandler = new AuthHandler();
  // Check if the user already login or not
  authHandler.redirectIfUserLogin();

  // Disable Button
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast>({
    highlightText: "",
    text: "",
    type: "FAILED",
    showToast: false,
  });

  // LOGIN STATE
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      name: e.target.value,
      email: formData.email,
      password: formData.password,
    });
  }

  //   Handle change email
  function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      name: formData.name,
      email: e.target.value,
      password: formData.password,
    });
  }

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      name: formData.name,
      email: formData.email,
      password: e.target.value,
    });
  }

  //   Handle Submit Button
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setIsButtonDisabled(true);
    await authHandler
      .handleRegistrationUser(formData)
      .then((response) => {
        if (response.status === 201) {
          setToast({
            highlightText: "redirect you to login page",
            text: "User registered successfully",
            type: "SUCCESS",
            showToast: true,
          });
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1200);
        } else if (response.data.code === "AU") {
          console.log(response.data.code);
          // EMAIL ALREADY IN USED
          setToast({
            highlightText: "Email already in use",
            text: "You can try login or use another email",
            type: "FAILED",
            showToast: true,
          });
          setTimeout(() => {
            setToast({
              ...toast,
              showToast: false,
            });
          }, 1800);
          setIsLoading(false);
          setIsButtonDisabled(false);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "REQ") {
          console.log(error.data.code);
          // ALL FIELDS ARE REQUIRED
          setToast({
            highlightText: "All field are required",
            text: "Please input all the fields to register",
            type: "FAILED",
            showToast: true,
          });
          setTimeout(() => {
            setToast({
              ...toast,
              showToast: false,
            });
          }, 1800);
        }
        setIsLoading(false);
        setIsButtonDisabled(false);
      });
  }

  useEffect(() => {
    setIsButtonDisabled(authHandler.handleRegistrationValidation(formData));
  }, [formData.email, formData.password, formData.name]);

  return (
    <>
      <Header>
        <title>Register Page</title>
      </Header>
      <ToastAlert
        type={toast.type}
        highlightText={
          toast.type === "SUCCESS" ? toast.highlightText : toast.text
        }
        text={toast.type === "SUCCESS" ? toast.highlightText : toast.text}
        showToast={toast.showToast}
      />

      <div className="p-4 md:flex md:h-screen md:justify-center md:items-center ">
        <div className="max-w-screen-sm mx-auto  p-5 border border-zinc-200 rounded bg-white md:p-10 ">
          <h1 className="font-bold text-2xl mb-9 md:text-3xl">
            CREATE NEW ACCOUNT
          </h1>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-6">
              <label className="block mb-2  font-medium text-gray-900 ">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="email"
                className="bg-zinc-100 hover:bg-zinc-200 transition-all	 text-gray-900 text-sm rounded-sm  block w-full p-3 "
                placeholder="Ex : Jhondoe"
                value={formData.name}
                onChange={handleChangeName}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2  font-medium text-gray-900 ">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="bg-zinc-100 hover:bg-zinc-200 transition-all	focus:border-red-500 text-gray-900 text-sm rounded-sm  block w-full p-3 "
                placeholder="Ex : youremail@example.com"
                value={formData.email}
                onChange={handleChangeEmail}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-900 ">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                className="bg-zinc-100 hover:bg-zinc-200 transition-all	 text-gray-900 text-sm rounded-sm  block w-full p-3 mb-1"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChangePassword}
                required
              />
              <p className="text-sm text-gray-500">
                Password minimal 6 characters
              </p>
            </div>
            <Button
              isButton={true}
              width="w-fit"
              type="primary"
              text="Register"
              isButtonDisable={isButtonDisabled}
              isLoading={isLoading}
            />
          </form>

          <p className="text-gray-900">
            Already have an account?{" "}
            <Link
              className="underline text-indigo-600 font-bold hover:text-indigo-800"
              href={"/auth/login"}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
