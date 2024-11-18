import Image from "next/image";
import Button from "./Button";
export interface ModalProps {
  type: "PAYMENT SUCCESS" | "BOOKING SUCCESS";
  isShow: boolean;
  title: string;
  subTitle: string;
  primaryButton: {
    text: string;
    isLoading?: boolean;
    isButtonDisable?: boolean;
    href: string;
  };

  secondaryButton: {
    text: string;
    isLoading?: boolean;
    isButtonDisable?: boolean;
    href: string;
  };
}

function MultiPurposeModal({
  isShow,
  subTitle,
  title,
  type,
  primaryButton,
  secondaryButton,
}: ModalProps) {
  return (
    <>
      <div
        className={`${isShow ? " z-[100] translate-y-0" : " opacity-0 translate-y-5 -z-50"} fixed top-0 right-0 left-0 w-full md:max-w-xl md:flex md:items-center md:justify-center h-full transition-all duration-250 ease-in-out md:p-4 md:mx-auto `}
      >
        {/* <!-- Modal content --> */}
        <div className="absolute w-full h-fit bg-white rounded-tl-md rounded-tr-md shadow bottom-0 md:relative md:rounded-md ">
          {/* <!-- Modal body --> */}
          <div className="pt-8 pb-10 px-4 text-center ">
            <Image
              src={
                type === "PAYMENT SUCCESS"
                  ? "/Success.webp"
                  : "/Congratulations.webp"
              }
              alt={title}
              width={720}
              height={720}
              className="w-[300px] h-[300px] object-cover object-center mx-auto -mt-12 -mb-5 lg:max-w-40 rounded-md lg:rounded"
            />
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-950 uppercase mb-4 lg:text-3xl">
                {title}
              </h2>
              <p className="text-gray-600">{subTitle}</p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:gap-8 justify-center">
              <Button
                isButton={false}
                text={secondaryButton.text}
                type="primary-border"
                width="w-full"
                href={secondaryButton.href}
              />
              <Button
                isButton={false}
                text={primaryButton.text}
                type="primary"
                width="w-full"
                href={primaryButton.href}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MultiPurposeModal;
