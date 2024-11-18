import React from "react";

function LoadingEventDetail() {
  return (
    <section className="px-4 py-8">
      <div className="max-w-screen-lg mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-5 md:h-fit md:sticky md:top-20">
            <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg"></div>
          </div>
          <div className="h-fit flex flex-col gap-2 p-4 bg-gray-100 rounded-md">
            <div className="max-w-12 h-6 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="w-wull h-10 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="max-w-60 h-12 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="max-w-60 h-12 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="w-full h-48 bg-gray-300 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoadingEventDetail;
