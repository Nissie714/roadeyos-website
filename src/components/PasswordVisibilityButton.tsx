type PasswordVisibilityButtonProps = {
  visible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityButton({ visible, onToggle }: PasswordVisibilityButtonProps) {
  const label = visible ? "Hide password" : "Show password";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white/35 bg-pink text-white shadow-[0_0_0_3px_rgba(255,46,136,0.16)] transition hover:scale-105 hover:bg-[#ff4d9a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {visible ? (
        <span aria-hidden="true" className="translate-y-0.5 text-lg font-black tracking-[-0.08em]">***</span>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12c0-2.8 3.5-8 9-8s9 5.2 9 8-3.5 8-9 8-9-5.2-9-8Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}
