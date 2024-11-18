import Link from "next/link";
import Loader from "./Loader";

interface ButtonProps {
  isButton: boolean;
  type: "primary" | "white" | "secondary" | "primary-border";
  text: string;
  isButtonDisable?: boolean;
  width: "w-fit" | "w-full";
  onClick?: () => void;
  href?: string;
  isLoading?: boolean;
}

function Button({
  isButton,
  type,
  text,
  isButtonDisable = false,
  width,
  onClick,
  href,
  isLoading,
}: ButtonProps) {
  switch (isButton) {
    case true:
      switch (type) {
        case "primary":
          return (
            <button
              type="submit"
              onClick={onClick}
              disabled={isButtonDisable}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} flex items-center justify-center font-bold py-3 px-4 bg-indigo-600 rounded-sm text-white transition-all	 hover:bg-indigo-800 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-600" : ""}`}
            >
              {isLoading ? <Loader /> : text}
            </button>
          );

        case "primary-border":
          return (
            <button
              onClick={onClick}
              disabled={isButtonDisable}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} flex items-center justify-center font-bold py-3 px-4 bg-indigo-100  rounded-sm text-indigo-800 transition-all	 hover:bg-indigo-200 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-600" : ""}`}
            >
              {isLoading ? <Loader /> : text}
            </button>
          );

        case "secondary":
          return (
            <button
              onClick={onClick}
              disabled={isButtonDisable}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} flex items-center justify-center font-bold py-3 px-4 bg-white rounded-sm text-indigo-600 transition-all	 hover:bg-indigo-100 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-100" : ""}`}
            >
              {isLoading ? <Loader /> : text}
            </button>
          );

        case "white":
          return (
            <button
              disabled={isButtonDisable}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} flex items-center justify-center font-bold py-3 px-4 bg-white bg-opacity-25 rounded-sm text-white transition-all	 hover:bg-indigo-800 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-600" : ""}`}
            >
              {isLoading ? <Loader /> : text}
            </button>
          );
      }
    case false:
      switch (type) {
        case "primary":
          return (
            <Link
              href={href as string}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} inline-block font-bold py-3 px-4 bg-indigo-600 rounded-sm text-white transition-all	 hover:bg-indigo-800 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-600" : ""}`}
            >
              {text}
            </Link>
          );

        case "primary-border":
          return (
            <Link
              href={href as string}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} inline-block font-bold py-3 px-4 bg-indigo-100  rounded-sm text-indigo-800 transition-all	 hover:bg-indigo-200 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-600" : ""}`}
            >
              {text}
            </Link>
          );

        case "secondary":
          return (
            <Link
              href={href as string}
              className={`${width} ${width === "w-fit" ? "shrink-0" : "shrink"} inline-block font-bold py-3 px-4 bg-white rounded-sm text-indigo-600 transition-all	 hover:bg-indigo-100 h-fit text-center ${isButtonDisable ? "opacity-40 hover:bg-indigo-100" : ""}`}
            >
              {text}
            </Link>
          );

        default:
          break;
      }
  }
}

export default Button; // Mengekspor komponen Button sebagai default
