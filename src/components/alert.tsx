export interface Toast {
  type: "SUCCESS" | "FAILED";
  showToast: boolean;
  highlightText: string;
  text: string;
}

function Toast({ type, showToast, highlightText, text }: Toast) {
  switch (type) {
    case "SUCCESS":
      return (
        <div className="px-4 fixed top-10 z-[150] md:left-1/2 md:transform md:-translate-x-1/2">
          <div
            className={`w-full p-4  rounded-lg bg-green-50 ${
              showToast
                ? "opacity-100 translate-y-0 shadow-md"
                : "opacity-0 -translate-y-5"
            } transition-all duration-250 ease-in-out`}
            role="alert"
          >
            <p className="text-green-800">
              <span className="font-medium">{highlightText}</span> {text}
            </p>
          </div>
        </div>
      );

    case "FAILED":
      return (
        <div className="px-4 fixed top-10 z-[150] md:left-1/2 md:transform md:-translate-x-1/2">
          <div
            className={`w-full p-4 rounded-lg bg-red-50 md:w-fit ${
              showToast
                ? "opacity-100 translate-y-0 shadow-md"
                : "opacity-0 -translate-y-5"
            } transition-all duration-250 ease-in-out`}
            role="alert"
          >
            <p className="text-red-800">
              <span className="font-medium">{highlightText}</span> {text}
            </p>
          </div>
        </div>
      );
  }
}

export default Toast; // Mengekspor komponen Toast sebagai default
