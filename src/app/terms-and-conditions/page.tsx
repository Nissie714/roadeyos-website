import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Terms & Conditions | Road-e-yo's",
  description: "Terms for Road-e-yo's accounts, bookings, memberships and training services.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout eyebrow="Using our services" title="Terms & Conditions" updated="9 November 2026">
      <section>
        <h2>About these terms</h2>
        <p>These terms apply when you use the Road-e-yo&apos;s website, create an account, book a class, purchase a membership or attend a training session. By doing so, you agree to follow these terms.</p>
        <p>Road-e-yo&apos;s Bootcamp &amp; Fitness Centre is based at Unit 3, Sycamore Farm, Old Romney, Kent, TN29 9SY. Contact <a href="mailto:admin@roadeyos.co.uk">admin@roadeyos.co.uk</a> or <a href="tel:+447909444787">07909 444787</a>.</p>
      </section>

      <section>
        <h2>Accounts</h2>
        <ul>
          <li>You must provide accurate details and keep your password private.</li>
          <li>Your account is personal to you and must not be shared.</li>
          <li>Please tell us promptly if you believe your account has been accessed without permission.</li>
          <li>Under-18s must have permission from a parent or legal guardian before creating an account or attending.</li>
        </ul>
      </section>

      <section>
        <h2>Bookings and availability</h2>
        <p>A booking is confirmed when it appears in your Upcoming Bookings. Places are subject to availability and group sessions are normally limited to 25 athletes. Please cancel promptly if you cannot attend so another athlete can use the place.</p>
        <p>We may change an instructor, timetable or location, or cancel a session where reasonably necessary. We will try to give appropriate notice. If we cancel a paid session and cannot offer a suitable alternative, any applicable credit or refund will be arranged.</p>
      </section>

      <section>
        <h2>Cancellations</h2>
        <ul>
          <li>Group sessions require at least 12 hours&apos; cancellation notice.</li>
          <li>Private 1:1 sessions cancelled within 24 hours are chargeable unless we agree otherwise.</li>
          <li>Late cancellation or non-attendance may result in the session being charged or a class credit being used.</li>
        </ul>
        <p>These rules do not affect any cancellation or refund rights that the law gives you.</p>
      </section>

      <section>
        <h2>Prices and payments</h2>
        <p>Current prices are displayed on the website or confirmed when you purchase. Unless stated otherwise, fees must be paid when due. Membership access may be paused if payment is overdue. Ten-session 1:1 packages expire three months after purchase unless we agree an extension.</p>
        <p>If you purchase services online, any statutory consumer cancellation rights continue to apply. Where you ask us to begin providing a service during a legal cancellation period, you may have to pay for services already supplied if the law permits.</p>
      </section>

      <section>
        <h2>Health and safety</h2>
        <ul>
          <li>You are responsible for deciding whether you are fit to exercise and for seeking medical advice where needed.</li>
          <li>Tell the instructor before training about relevant injuries, health conditions, pregnancy or changes that could affect safe participation.</li>
          <li>Follow reasonable safety instructions, use equipment properly, wear suitable clothing and clean indoor shoes, and bring water.</li>
          <li>Stop exercising and tell the instructor if you feel unwell, faint, dizzy or experience unusual pain.</li>
        </ul>
      </section>

      <section>
        <h2>Behaviour and facilities</h2>
        <p>Treat staff, other athletes, neighbours, equipment and facilities with respect. Harassment, threatening conduct, deliberate damage or unsafe behaviour is not accepted. We may refuse entry, end a session or suspend an account where reasonably necessary to protect people or the business.</p>
      </section>

      <section>
        <h2>Responsibility</h2>
        <p>Exercise carries inherent risks. We are not responsible for loss caused by your failure to follow instructions, disclose relevant information or take reasonable care. Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot legally be excluded.</p>
        <p>Please look after personal belongings. We are not responsible for loss or damage unless caused by our failure to use reasonable care.</p>
      </section>

      <section>
        <h2>Website use</h2>
        <p>Do not misuse the website, attempt unauthorised access or interfere with its security. We may suspend access for maintenance, security or operational reasons. Website content is provided for general information and is not medical advice.</p>
      </section>

      <section>
        <h2>Changes and governing law</h2>
        <p>We may update these terms when our services, prices or legal responsibilities change. Material changes will apply from the date stated on the updated page and will not remove rights already provided by law.</p>
        <p>These terms are governed by the law of England and Wales. You retain any rights to bring a claim in another UK court where consumer law allows.</p>
      </section>
    </LegalPageLayout>
  );
}
