// pages/500.js
import Button from "@/components/Button";
import React from "react";

const Custom500 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-16 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 text-9xl font-extrabold text-gray-800 dark:text-gray-400">
            <span className="sr-only">Error</span>500
          </h2>
          <p className="text-2xl font-semibold md:text-3xl text-gray-800 dark:text-gray-300">
            Oooops! Internal Server Error. That is, something went terribly
            wrong.
          </p>

          <p className="mt-4 mb-8 text-gray-600 dark:text-gray-400">
            Don't worry, we've been reported about that. In the meantime, you
            can help us
            <span className="underlined">catch some nasty bugs</span>. We got
            you the deadliest of all weapons!
          </p>

          <Button
            isButton={false}
            text="Back to homepage"
            type="primary"
            width="w-fit"
            href="/"
          />
        </div>
      </div>
    </div>
  );
};

export default Custom500;
