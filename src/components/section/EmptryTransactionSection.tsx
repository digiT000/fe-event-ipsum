import Image from "next/image";
import React from "react";
import Button from "../Button";

function EmptryTransactionSection() {
  return (
    <div className="max-w-screen-sm mx-auto flex flex-col items-center py-6 justify-center text-center">
      <Image
        width={300}
        height={300}
        src="/No_list_found.webp"
        alt="empty result"
      />
      <h1 className="text-center text-2xl font-medium text-gray-900 mb-4">
        Your Upcoming Adventures Await!
      </h1>
      <p className="mb-10">
        Explore a world of tech events, workshops, and conferences. Learn new
        skills, network with like-minded individuals, and stay ahead of the
        curve.
      </p>
      <Button
        href="/"
        isButton={false}
        text="Explore Event"
        type="primary"
        width="w-fit"
      />
    </div>
  );
}

export default EmptryTransactionSection;
