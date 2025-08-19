import ReviewForm from "@/app/components/forms/review-form";

export default function ReviewRoute() {
  return <ReviewForm productID="123" isOpen={true} onClose={() => {}} />;
}