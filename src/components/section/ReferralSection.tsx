import { useState } from "react";
import Button from "../Button";
import Image from "next/image";
import { ReferralHandler } from "@/utils/referralHandler";
import Cookies from "js-cookie";
import Toast from "../alert";
import { useAuth } from "@/utils/userContext";
import { UniqueCode } from "@/models/models";

function ReferralSection() {
  const { updateUserPoint } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const referralHandler = new ReferralHandler();
  const [inputReferral, setInputReferral] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<"SUCCESS" | "FAILED">("SUCCESS");
  const [showToast, setShowToast] = useState<boolean>(false);

  function handleInputReferralChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputReferral(e.target.value);
    setInputError(false);
  }

  async function handleSubmitReferral(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const accessToken = Cookies.get(`access${UniqueCode.USER}_token`);
    if (inputReferral === "") {
      setInputError(true);
    } else {
      setIsLoading(true);
      const response = await referralHandler.useReferralCode(
        inputReferral,
        accessToken as string
      );
      if (response === 200) {
        setErrorToast("SUCCESS");
        setShowToast(true);
        setTimeout(() => {
          // Hide toast after showing information
          setShowToast(false);
        }, 1200);
        setTimeout(() => {
          setInputReferral("");
          updateUserPoint(inputReferral);
        }, 1500);

        // Hide toast
      } else {
        setErrorToast("FAILED");
        setShowToast(true);
        setTimeout(() => {
          // Hide toast after showing information
          setShowToast(false);
        }, 1200);
      }
      setIsLoading(false);
    }
  }
  console.log(inputReferral);

  return (
    <>
      <Toast
        type={errorToast}
        showToast={showToast}
        highlightText={
          errorToast === "SUCCESS"
            ? `Success using referral code ${inputReferral}, `
            : `Invalid token ${inputReferral}`
        }
        text={
          errorToast === "SUCCESS"
            ? "We add 20.000 point to your account"
            : "Please check your referral code"
        }
      />

      <section className="px-4 py-6 bg-indigo-950">
        <div className="max-w-screen-lg mx-auto flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
          <div className="flex gap-4 items-center">
            <Image
              src="/icon/coin.svg"
              width={64}
              height={64}
              alt="coin"
              className="mb-6 md:mb-0"
            />
            <div>
              <h3 className="text-lg font-bold text-white">
                Have a referral code?
              </h3>
              <p className="text-white mb-6 md:mb-0">
                Get{" "}
                <span className="font-bold text-yellow-500">
                  20.0000 points
                </span>{" "}
                and use it for your next order
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmitReferral}>
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                id="referral"
                className="h-12 bg-zinc-100 hover:bg-zinc-200 transition-all text-gray-900 text-sm rounded-sm  block w-full p-3 "
                placeholder="Ex : JOHN131"
                value={inputReferral}
                onChange={handleInputReferralChange}
              />
              <Button
                isButton={true}
                text="Get Points"
                type="secondary"
                width="w-fit"
                isLoading={isLoading}
              />
            </div>
            {inputError ? (
              <p className="text-white">Please input referral code</p>
            ) : (
              ""
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default ReferralSection;
