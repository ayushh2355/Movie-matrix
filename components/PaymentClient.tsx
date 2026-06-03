"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PaymentTabs, { Tab } from "./PaymentTabs";
import OrderSummary from "./OrderSummary";

const CONVENIENCE_FEE = 30;

type Props = {
  showtimeId: string;
  movieTitle: string;
  posterUrl: string;
  showTime: string;
  seats: string[];
  baseAmount: number;
};

export default function PaymentClient({
  showtimeId,
  movieTitle,
  posterUrl,
  showTime,
  seats,
  baseAmount,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("UPI");
  const [methodReady, setMethodReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = baseAmount + CONVENIENCE_FEE;

  const handlePay = async () => {
    if (!methodReady) {
      const messages: Record<Tab, string> = {
        UPI: "Pick a UPI app or enter your UPI ID",
        CARD: "Please fill in your card details",
        NET_BANKING: "Please select your bank to continue",
      };
      toast.error(messages[activeTab]);
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatIds: seats, showtimeId, totalPrice: totalAmount }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Payment successful!");
        router.push(`/success?bookingId=${data.booking.id}`);
      } else {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
      <PaymentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMethodReady={setMethodReady}
      />
      <OrderSummary
        movieTitle={movieTitle}
        posterUrl={posterUrl}
        showTime={showTime}
        seats={seats}
        baseAmount={baseAmount}
        isProcessing={isProcessing}
        onPay={handlePay}
      />
    </div>
  );
}
