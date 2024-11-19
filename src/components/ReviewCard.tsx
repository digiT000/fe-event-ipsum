interface ReviewCardProps {
  name: string;
  reviewText: string;
}

function ReviewCard({ name, reviewText }: ReviewCardProps) {
  return (
    <div className="p-5 border border-zinc-200 rounded-md bg-white">
      <h3 className="font-bold mb-2 text-gray-900">{name}</h3>
      <p className="text-gray-600 break-all leading-[150%]">{reviewText}</p>
    </div>
  );
}

export default ReviewCard;
