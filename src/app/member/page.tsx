import Image from "next/image";
import Link from "next/link";
import AttendanceStreakTracker from "./AttendanceStreakTracker";
import ClassBookingManager from "./ClassBookingManager";
import EmergencyContactForm from "./EmergencyContactForm";
import MembershipStatusCard from "./MembershipStatusCard";
import OneToOneBalance from "./OneToOneBalance";
import OnlinePayments from "./OnlinePayments";
import PaymentHistory from "./PaymentHistory";
import PerformanceTracker from "./PerformanceTracker";
import WeightProgressTracker from "./WeightProgressTracker";

export const metadata = {
  title: "Member Area Preview | Road-e-yo's",
  description: "Preview the new Road-e-yo's booking calendar and member dashboard.",
};

export default function MemberPreviewPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Road-e-yo's home">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white">
              <Image src="/images/roadeyos-logo.jpg" alt="" width={80} height={80} className="h-full w-full object-contain object-center" />
            </span>
            <span className="text-lg font-black">Road-e-yo&apos;s<span className="text-pink">.</span></span>
          </Link>
          <Link className="rounded-full border border-white/20 px-4 py-2 text-sm font-black" href="/customer-login">
            Exit preview
          </Link>
        </div>
      </header>

      <div className="border-b border-pink/20 bg-pink/10 px-5 py-3 text-center text-sm font-bold text-pink">
        Member-area preview — buttons do not create or cancel real bookings.
      </div>

      <div className="section-shell py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Customer dashboard</p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-.05em] sm:text-6xl">
              Hello, member.
            </h1>
            <p className="mt-4 text-white/55">Here is your Road-e-yo&apos;s training week.</p>
          </div>
          <div className="flex gap-3">
            <button disabled className="rounded-full bg-pink px-6 py-3 font-black">Book a class</button>
            <button disabled className="rounded-full border border-white/20 px-6 py-3 font-black">My account</button>
          </div>
        </div>

        <ClassBookingManager />
        <AttendanceStreakTracker />
        <OneToOneBalance />
        <WeightProgressTracker />
        <PerformanceTracker />
        <OnlinePayments />
        <PaymentHistory />

        <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <MembershipStatusCard />
            <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-pink">Cancellation policy</p>
              <p className="mt-4 text-sm leading-6 text-white/55">
                Group bookings require 12 hours&apos; notice. Private sessions require 24 hours&apos; notice.
              </p>
            </section>
            <EmergencyContactForm />
        </section>
      </div>
    </main>
  );
}
