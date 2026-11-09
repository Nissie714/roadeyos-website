import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Reset Password | Road-e-yo's",
  description: "Choose a new password for your Road-e-yo's account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-5 py-12 text-white sm:py-20">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-[#101010] p-6 shadow-2xl sm:p-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Road-e-yo's home">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white">
            <Image src="/images/roadeyos-logo.jpg" alt="" width={80} height={80} className="h-full w-full object-contain object-center" />
          </span>
          <span className="text-xl font-black">Road-e-yo&apos;s<span className="text-pink">.</span></span>
        </Link>
        <p className="mt-9 text-xs font-black uppercase tracking-widest text-pink">Secure account recovery</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">Choose a new password</h1>
        <p className="mt-4 text-sm leading-6 text-white/55">Enter a new password containing at least eight characters.</p>
        <div className="mt-7"><ResetPasswordForm /></div>
      </div>
    </main>
  );
}
