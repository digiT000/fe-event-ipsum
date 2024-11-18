import Image from "next/image";
import Button from "../Button";
interface EmptyResult {
  oncClick: () => void;
}

function EmptyResultSection({ oncClick }: EmptyResult) {
  return (
    <div className="w-full flex flex-col items-center py-6">
      <Image
        width={300}
        height={300}
        src="/No_list_found.webp"
        alt="empty result"
      />
      <p className="text-center text-lg font-medium text-gray-900 mb-10">
        No results found. Please try a different search keyword or filter
      </p>
      <Button
        onClick={oncClick}
        isButton={true}
        text="Reset Keyword"
        type="primary"
        width="w-fit"
      />
    </div>
  );
}

export default EmptyResultSection;
