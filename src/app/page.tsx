const classes = [
  {
    name: "HYROX Training",
    description: "Race-ready strength, endurance and functional fitness.",
    tag: "Performance",
  },
  {
    name: "Bootcamp",
    description: "High-energy sessions that welcome every fitness level.",
    tag: "Community",
  },
  {
    name: "Strength & Conditioning",
    description: "Build power, confidence and a stronger foundation.",
    tag: "Strength",
  },
];

const benefits = [
  "Expert coaching",
  "All abilities welcome",
  "A community that backs you",
  "Training with real purpose",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <section className="relative isolate min-h-[760px] border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_30%,rgba(255,46,136,0.22),transparent_32%),linear-gradient(135deg,#080808_20%,#151015_100%)]" />
        <div className="absolute right-[-10rem] top-24 -z-10 h-[30rem] w-[30rem] rounded-full border-[70px] border-[#ff2e88]/10 blur-sm" />
        <div className="absolute bottom-12 left-[-8rem] -z-10 h-52 w-52 rotate-12 bg-[#ff2e88]/10 blur-3xl" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <a
            href="#top"
            className="text-xl font-black uppercase tracking-[-0.04em]"
            aria-label="Road-e-yos home"
          >
            Road-e-yos<span className="text-[#ff2e88]">.</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex">
            <a className="transition hover:text-white" href="#classes">Classes</a>
            <a className="transition hover:text-white" href="#why-us">Why us</a>
            <a className="transition hover:text-white" href="#contact">Contact</a>
          </div>
          <a
            href="#book"
            className="rounded-full bg-[#ff2e88] px-5 py-3 text-sm font-extrabold text-white shadow-[0_0_30px_rgba(255,46,136,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ff4c9a]"
          >
            Book a class
          </a>
        </nav>

        <div id="top" className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-32">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-[#ff70ad]">
              Bootcamp &amp; Fitness Centre
            </p>
            <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
              Stronger
              <br />
              starts <span className="text-[#ff2e88]">here.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">
              HYROX-inspired training and energetic bootcamps in a community
              built to help you push further.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#book"
                className="rounded-full bg-[#ff2e88] px-7 py-4 text-center font-extrabold transition hover:bg-[#ff4c9a]"
              >
                Start your training
              </a>
              <a
                href="#classes"
                className="rounded-full border border-white/20 px-7 py-4 text-center font-extrabold transition hover:border-white/50 hover:bg-white/5"
              >
                Explore classes
              </a>
            </div>
          </div>

          <div className="self-end rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ff70ad]">
              Your next move
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight">
              Train with purpose.
              <br />
              Leave stronger.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-black/40 p-4">
                <span className="block text-2xl font-black text-[#ff2e88]">01</span>
                Friendly community
              </div>
              <div className="rounded-2xl bg-black/40 p-4">
                <span className="block text-2xl font-black text-[#ff2e88]">02</span>
                Expert guidance
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="classes" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#ff2e88]">Find your session</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">Classes that move you</h2>
          </div>
          <p className="max-w-md text-white/55">Challenge yourself at your level, with coaches and members beside you.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {classes.map((item, index) => (
            <article
              key={item.name}
              className="group rounded-[1.75rem] border border-white/10 bg-[#111] p-7 transition hover:-translate-y-1 hover:border-[#ff2e88]/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ff70ad]">{item.tag}</span>
                <span className="text-sm text-white/30">0{index + 1}</span>
              </div>
              <h3 className="mt-16 text-2xl font-black uppercase tracking-tight">{item.name}</h3>
              <p className="mt-3 leading-7 text-white/55">{item.description}</p>
              <a href="#book" className="mt-8 inline-block font-bold text-[#ff70ad]">View class →</a>
            </article>
          ))}
        </div>
      </section>

      <section id="why-us" className="border-y border-white/10 bg-[#ff2e88] text-black">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10">
          <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-6xl">
            More than
            <br />
            a workout.
          </h2>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-black/20 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={benefit} className="bg-[#ff2e88] p-5 font-extrabold">
                <span className="mr-3 text-black/40">0{index + 1}</span>{benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="mx-auto max-w-5xl px-6 py-28 text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#ff2e88]">Ready when you are</p>
        <h2 className="mt-4 text-5xl font-black uppercase tracking-[-0.055em] sm:text-7xl">Your first step starts now.</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/55">
          Class booking will connect here. For now, this is the foundation of
          your new Road-e-yos experience.
        </p>
        <a href="mailto:hello@roadeyos.co.uk" className="mt-9 inline-block rounded-full bg-[#ff2e88] px-8 py-4 font-extrabold transition hover:bg-[#ff4c9a]">
          Contact Road-e-yos
        </a>
      </section>

      <footer id="contact" className="border-t border-white/10 px-6 py-8 text-sm text-white/45">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row lg:px-4">
          <p>© {new Date().getFullYear()} Road-e-yos Bootcamp &amp; Fitness Centre</p>
          <p>Built strong. Built together.</p>
        </div>
      </footer>
    </main>
  );
}
