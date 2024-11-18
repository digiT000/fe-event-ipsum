import React from "react";

function EventListLoadingItem() {
  return (
    <div className="min-h-[300px] w-full flex flex-col gap-4 bg-zinc-100 animate-pulse lg:flex-row lg:gap lg:p-4 lg:min-h-[178px]">
      <div className="h-[150px] w-full bg-zinc-300 animate-pulse lg:w-[160px] lg:h-full"></div>
      <div className="p-4 ">
        <div className="h-[50px] w-full bg-zinc-300 animate-pulse"></div>
        <div className="h-[50px] w-full bg-zinc-300 animate-pulse"></div>
        <div className="h-[50px] w-full bg-zinc-300 animate-pulse"></div>
      </div>
    </div>
  );
}

export default EventListLoadingItem;
