import Image from "next/image";

const bookingUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSevtkmy_lq159MZNlf4sExyWz67E6YSaAsmrpE1sq4ik34QIw/viewform";
const bookingsUrl = "https://roadeyos.co.uk/m/bookings";
const customerLoginUrl = "/customer-login";
const instructorLoginUrl = "/instructor-login";
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Unit+3%2C+Sycamore+Farm%2C+Old+Romney%2C+Kent%2C+TN29+9SY";

const timetable = [
  { day: "Monday", sessions: [{ time: "6:00 pm", type: "Bootcamp" }] },
  {
    day: "Tuesday",
    sessions: [
      { time: "9:30 am", type: "Bootcamp" },
      { time: "7:15 pm", type: "HYROX" },
    ],
  },
  { day: "Wednesday", sessions: [{ time: "6:00 pm", type: "Bootcamp" }] },
  { day: "Thursday", sessions: [{ time: "9:30 am", type: "Bootcamp" }] },
  {
    day: "Friday",
    sessions: [
      { time: "9:30 am", type: "HYROX" },
      { time: "6:00 pm", type: "HYROX" },
    ],
  },
  { day: "Saturday", sessions: [{ time: "9:00 am", type: "Bootcamp" }] },
];

const reviews = [
  {
    name: "Guylaine Bouriaud",
    title: "A fantastic experience",
    quote:
      "The atmosphere is incredibly friendly, making it easy for anyone, no matter their fitness level.",
    image: "/images/member-guylaine.webp",
  },
  {
    name: "Maria Paulina Leverett",
    title: "Looking for a family?",
    quote:
      "The moment you step through the doors, you’re welcomed into a community that pushes and supports.",
    image: "/images/member-maria.webp",
  },
  {
    name: "Kerri Arter",
    title: "Everyone is so friendly",
    quote:
      "The workouts are great and there is always such a wide variety of exercises.",
    image: "/images/member-kerri.jpg",
  },
];

export default function Home() {
  return (
    <main id="top" className="overflow-hidden bg-[#070707] text-white">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
          aria-label="Main navigation"
        >
          <a href="#top" className="flex items-center gap-3" aria-label="Road-e-yo's home">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white">
              <Image
                src="/images/roadeyos-logo.jpg"
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-contain object-center"
              />
            </span>
            <span className="text-lg font-black tracking-tight">
              Road-e-yo&apos;s<span className="text-pink">.</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold text-white/70 lg:flex">
            <a className="nav-link" href="#classes">Classes</a>
            <a className="nav-link" href="#timetable">Timetable</a>
            <a className="nav-link" href="#prices">Prices</a>
            <a className="nav-link" href="#coach">Coach</a>
            <a className="nav-link" href="#contact">Find us</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              className="rounded-full border border-white/25 px-4 py-3 text-xs font-black transition hover:border-pink hover:text-pink sm:px-5 sm:text-sm"
              href={customerLoginUrl}
            >
              Athlete login
            </a>
            <a
              className="rounded-full border border-white/25 px-4 py-3 text-xs font-black transition hover:border-pink hover:text-pink sm:px-5 sm:text-sm"
              href={instructorLoginUrl}
            >
              Instructor login
            </a>
          </div>
        </nav>
      </header>

      <section className="relative isolate min-h-[760px] border-b border-white/10">
        <Image
          src="/images/hero-training.jpeg"
          alt="Road-e-yo's athlete training with battle ropes"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,.97)_0%,rgba(5,5,5,.82)_42%,rgba(5,5,5,.25)_100%),linear-gradient(0deg,#070707_0%,transparent_35%)]" />
        <div className="absolute inset-0 -z-10 opacity-30 texture-grid" />

        <div className="mx-auto flex min-h-[760px] max-w-7xl items-end px-5 pb-20 pt-36 lg:items-center lg:px-8 lg:pb-0">
          <div className="max-w-3xl">
            <p className="eyebrow">Bootcamp &amp; Fitness Centre</p>
            <h1 className="mt-6 text-6xl font-black uppercase leading-[0.86] tracking-[-0.065em] sm:text-7xl lg:text-[6.8rem]">
              Push your
              <br />
              <span className="text-pink">limits.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
              Achieve your goals and get in the best shape of your life with
              functional fitness classes, expert coaching and a community that
              backs you.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="button-primary" href={bookingUrl}>Book your session</a>
              <a className="button-secondary" href="#timetable">View timetable</a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-white/65">
              <span><b className="text-white">All abilities</b> welcome</span>
              <span><b className="text-white">8 sessions</b> each week</span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-pink"
                aria-label="Open Road-e-yo's address in Google Maps"
              >
                <b className="text-white">Unit 3, Sycamore Farm</b> Old Romney,
                Kent, TN29 9SY
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="classes" className="section-shell py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow">Train your way</p>
          <h2 className="section-title">Classes with purpose.</h2>
          <p className="section-copy">
            High-energy group training that helps you become stronger, fitter
            and more confident—without losing the fun.
          </p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="class-card pink-card">
            <span className="card-number">01</span>
            <p className="eyebrow text-white/80">Community fitness</p>
            <h3>Bootcamp</h3>
            <p>
              Varied functional workouts in a friendly, motivating group.
              Every session is designed to challenge you at your own level.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="pill">All abilities</span>
              <span className="pill">Group training</span>
              <span className="pill">£8 PAYG</span>
            </div>
          </article>
          <article className="class-card dark-card">
            <span className="card-number text-pink">02</span>
            <p className="eyebrow">Performance training</p>
            <h3>HYROX</h3>
            <p>
              Race-focused strength and endurance training designed to get you
              comfortable working hard on tired legs—and proud of what you achieve.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="pill">60 minutes</span>
              <span className="pill">Clean indoor shoes</span>
              <span className="pill">Bring water</span>
            </div>
          </article>
        </div>
      </section>

      <section id="timetable" className="border-y border-white/10 bg-[#101010] py-16 sm:py-20">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">Weekly timetable</p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl">
                Find your session.
              </h2>
            </div>
            <a className="button-secondary" href={bookingUrl}>Check availability</a>
          </div>
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
            {timetable.map((item) => (
              <div
                key={item.day}
                className="grid gap-3 border-b border-white/10 px-5 py-4 last:border-0 sm:grid-cols-[8rem_1fr] sm:items-center lg:px-7"
              >
                <h3 className="text-sm font-black uppercase tracking-wide">{item.day}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.sessions.map((session) => (
                    <div
                      key={`${item.day}-${session.time}`}
                      className="flex min-w-[190px] flex-1 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3"
                    >
                      <span className="text-sm font-black text-pink">{session.time}</span>
                      <span className="text-xs font-bold text-white/70">{session.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/45">
            Maximum 25 people per class. Timetable may change on bank holidays.
            Please check availability before travelling.
          </p>
        </div>
      </section>

      <section id="prices" className="section-shell py-16 sm:py-20">
        <div className="text-center">
          <p className="eyebrow">Simple pricing</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl">
            Choose what works for you.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="price-card">
            <p className="price-label">Pay as you go</p>
            <p className="price">£8</p>
            <p className="price-note">Any group session</p>
          </article>
          <article className="price-card featured-price">
            <p className="price-label">Unlimited</p>
            <p className="price">£60</p>
            <p className="price-note">Per month · group sessions and gym use</p>
          </article>
          <article className="price-card">
            <p className="price-label">Private 1:1</p>
            <p className="price">£35</p>
            <p className="price-note">One hour · pay as you go</p>
          </article>
          <article className="price-card">
            <p className="price-label">Ten 1:1 sessions</p>
            <p className="price">£250</p>
            <p className="price-note">Three-month expiry</p>
          </article>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-white/45">
          Private-session cancellations made within 24 hours are chargeable.
          Group sessions must be cancelled at least 12 hours in advance.
        </p>
      </section>

      <section id="coach" className="border-y border-white/10 bg-pink text-white">
        <div className="section-shell grid min-h-[680px] items-stretch px-0 lg:grid-cols-2 lg:px-8">
          <div className="relative min-h-[520px]">
            <Image
              src="/images/yolanda-cloke.webp"
              alt="Yolanda Cloke, fitness training instructor at Road-e-yo's"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="flex items-center px-6 py-20 sm:px-12 lg:px-16">
            <div>
              <p className="eyebrow text-white/75">Meet your coach</p>
              <h2 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.05em] sm:text-6xl">
                Yolanda Cloke
              </h2>
              <p className="mt-3 text-lg font-black uppercase tracking-wide">Fitness Training Instructor</p>
              <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">
                A physical training instructor for over a decade, Yolanda
                brings military and boxing experience, hard work and genuine
                dedication to every session.
              </p>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
                Whether your goal is to lose weight, build muscle or improve
                cardiovascular fitness, she will help you move towards it.
              </p>
              <a className="mt-9 inline-flex rounded-full bg-black px-7 py-4 font-black transition hover:-translate-y-0.5" href={bookingUrl}>
                Train with Yolanda
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Welcome to Unit 3</p>
            <h2 className="section-title">More room to grow.</h2>
            <p className="section-copy">
              Our current home at Sycamore Farm gives the Road-e-yo&apos;s
              community more space, more equipment and even more ways to train.
            </p>
            <div className="mt-8 rounded-2xl border border-pink/30 bg-pink/10 p-5 text-sm leading-6 text-white/70">
              <b className="text-white">Parking:</b> Please use the parking area
              on the right immediately after entering the site gates. Spaces
              outside the unit are reserved for staff and private sessions.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 h-72 overflow-hidden rounded-[2rem]">
              <Image src="/images/unit-3-equipment.jpeg" alt="Colourful training equipment at Unit 3" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="relative h-52 overflow-hidden rounded-[2rem]">
              <Image src="/images/unit-3-kettlebells.jpg" alt="Road-e-yo's kettlebells at Unit 3" fill sizes="30vw" className="object-cover" />
            </div>
            <div className="relative h-52 overflow-hidden rounded-[2rem]">
              <Image src="/images/unit-3-kit.jpg" alt="Training kit at Road-e-yo's Unit 3 gym" fill sizes="30vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010] py-24 sm:py-32">
        <div className="section-shell">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-80 overflow-hidden rounded-[2rem]">
                <Image src="/images/unit-11-training.png" alt="Members training at the former Unit 11 gym" fill sizes="30vw" className="object-cover" />
              </div>
              <div className="relative mt-10 h-80 overflow-hidden rounded-[2rem]">
                <Image src="/images/unit-11-community.jpg" alt="Road-e-yo's community at the former Unit 11 gym" fill sizes="30vw" className="object-cover" />
              </div>
            </div>
            <div>
              <p className="eyebrow">Our journey · Former Unit 11 gym</p>
              <h2 className="section-title">Built by the community.</h2>
              <p className="section-copy">
                Unit 11 is where an incredible chapter of our story was written.
                The hard work, friendships and community created there helped us
                grow into our bigger and better home at Unit 3.
              </p>
              <p className="section-copy">
                Our time at Unit 11 came to an unexpected end following a
                terrible fire in the neighbouring unit. The building was
                condemned, which meant we had to move—but the strength of our
                community helped us begin a new chapter at Unit 3.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-16 sm:py-20">
        <div className="text-center">
          <p className="eyebrow">Member stories</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-none tracking-[-0.05em] sm:text-5xl">
            More than just a gym.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="review-card">
              <div className="flex items-center gap-4">
                <Image src={review.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="text-pink" aria-label="Five out of five stars">★★★★★</p>
                  <figcaption className="font-black">{review.name}</figcaption>
                </div>
              </div>
              <h3 className="mt-6 text-lg font-black uppercase">{review.title}</h3>
              <blockquote className="mt-3 text-sm leading-6 text-white/60">“{review.quote}”</blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section id="book" className="section-shell pb-24 sm:pb-32">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-pink px-7 py-16 text-center sm:px-12 sm:py-20">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[55px] border-white/10" />
          <p className="eyebrow text-white/75">Ready when you are</p>
          <h2 className="relative mx-auto mt-5 max-w-3xl text-5xl font-black uppercase leading-none tracking-[-0.055em] sm:text-7xl">
            Your next session starts here.
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-lg text-white/85">
            Sign in to book a class or manage the sessions you already have booked.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a className="rounded-full bg-black px-8 py-4 font-black" href={bookingUrl}>Book a class</a>
            <a className="rounded-full border border-white/40 px-8 py-4 font-black hover:bg-white/10" href={bookingsUrl}>My bookings</a>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-white/10 bg-black py-16">
        <div className="section-shell grid gap-12 lg:grid-cols-[1.1fr_.9fr_.9fr]">
          <div>
            <p className="text-2xl font-black">Road-e-yo&apos;s<span className="text-pink">.</span></p>
            <p className="mt-4 max-w-sm leading-7 text-white/55">
              Bootcamp, HYROX training and personal coaching in a community built to help you succeed.
            </p>
          </div>
          <div>
            <h2 className="footer-heading">Find us</h2>
            <address className="mt-4 not-italic leading-7 text-white/60">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-pink"
                aria-label="Open Road-e-yo's address in Google Maps"
              >
                Unit 3, Sycamore Farm<br />
                Old Romney, Kent<br />
                TN29 9SY
              </a>
            </address>
          </div>
          <div>
            <h2 className="footer-heading">Contact</h2>
            <div className="mt-4 space-y-2 text-white/60">
              <p><a className="hover:text-pink" href="tel:+447909444787">07909 444787</a></p>
              <p><a className="hover:text-pink" href="mailto:admin@roadeyos.co.uk">admin@roadeyos.co.uk</a></p>
              <p>Mon–Fri 7:30 am–7:30 pm</p>
              <p>Saturday 9:00–10:00 am</p>
            </div>
          </div>
        </div>
        <div className="section-shell mt-14 border-t border-white/10 pt-7 text-sm text-white/35">
          © {new Date().getFullYear()} Road-e-yo&apos;s Bootcamp &amp; Fitness Centre.
        </div>
      </footer>
    </main>
  );
}
