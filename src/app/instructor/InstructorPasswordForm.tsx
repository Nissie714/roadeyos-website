"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PasswordVisibilityButton from "@/components/PasswordVisibilityButton";

export default function InstructorPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("The new passwords do not match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setIsError(true);
      setMessage("Your signed-in account could not be confirmed. Please sign in again.");
      setBusy(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) {
      setIsError(true);
      setMessage("Your current password was not recognised.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setIsError(true);
      setMessage("We could not update your password. Please try again.");
    } else {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
      setMessage("Your password has been updated securely.");
    }
    setBusy(false);
  }

  return (
    <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#101010] p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-widest text-pink">Account security</p>
      <h2 className="mt-2 text-xl font-black uppercase">Change password</h2>
      <p className="mt-2 text-sm leading-6 text-white/55">For security, your saved password cannot be displayed. Use the pink eye buttons to check the passwords you enter below.</p>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        {[
          { label: "Current password", value: currentPassword, setValue: setCurrentPassword, autoComplete: "current-password" },
          { label: "New password", value: newPassword, setValue: setNewPassword, autoComplete: "new-password" },
          { label: "Confirm new password", value: confirmPassword, setValue: setConfirmPassword, autoComplete: "new-password" },
        ].map((field) => (
          <label key={field.label} className="block">
            <span className="mb-2 block text-sm font-bold text-white/60">{field.label}</span>
            <div className="relative">
              <input required minLength={8} type={showPasswords ? "text" : "password"} autoComplete={field.autoComplete} value={field.value} onChange={(event) => field.setValue(event.target.value)} className="progress-input pr-16" />
              <PasswordVisibilityButton visible={showPasswords} onToggle={() => setShowPasswords((current) => !current)} />
            </div>
          </label>
        ))}
        <button disabled={busy} className="mt-1 w-fit rounded-full bg-pink px-6 py-3 font-black disabled:opacity-50">{busy ? "Updating…" : "Update password"}</button>
      </form>
      {message && <p role="status" className={`mt-4 text-sm font-bold ${isError ? "text-red-300" : "text-pink"}`}>{message}</p>}
    </section>
  );
}
