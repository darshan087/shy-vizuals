import dynamic from "next/dynamic";

const PaymentClient = dynamic(() => import("./PaymentClient"), {
  ssr: false,
});

export default function PaymentPage() {
  return <PaymentClient />;
}