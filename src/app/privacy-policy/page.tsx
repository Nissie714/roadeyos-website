import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy | Road-e-yo's",
  description: "How Road-e-yo's collects, uses and protects personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout eyebrow="Your information" title="Privacy Policy" updated="12 November 2026">
      <section>
        <h2>Who we are</h2>
        <p>Road-e-yo&apos;s Bootcamp &amp; Fitness Centre is responsible for the personal information described in this notice.</p>
        <p>Contact us at <a href="mailto:admin@roadeyos.co.uk">admin@roadeyos.co.uk</a>, call <a href="tel:+447909444787">07909 444787</a>, or write to Unit 3, Sycamore Farm, Old Romney, Kent, TN29 9SY.</p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>Account details, including your first name, surname, email address and securely managed login credentials.</li>
          <li>Class bookings, cancellations, attendance and related account activity.</li>
          <li>Membership, payment and 1:1-session records where these services are used.</li>
          <li>Information you choose to enter, such as emergency contacts, progress measurements and personal bests.</li>
          <li>Your optional choice about whether other athletes booked into the same class may see your first name and surname initial.</li>
          <li>Technical and security information generated when the website is used, such as authentication and service logs.</li>
        </ul>
      </section>

      <section>
        <h2>Why we use it</h2>
        <p>We use personal information to create and secure accounts, manage bookings and memberships, deliver training services, communicate about sessions, keep appropriate business records, protect the website and respond to enquiries.</p>
        <p>We generally rely on performing our agreement with you, our legitimate interests in running and protecting the gym, compliance with legal obligations and, where relevant, your consent. Name sharing with other booked athletes is based on consent and remains off unless you choose to enable it.</p>
      </section>

      <section>
        <h2>Name sharing</h2>
        <p>If you opt in, only your first name and surname initial may be shown to other signed-in athletes who are booked into the same session. Your email address is not shown. You can withdraw permission at any time by unticking the option in Your Details.</p>
      </section>

      <section>
        <h2>Emergency contacts</h2>
        <p>Emergency-contact details are stored securely with your athlete account. They are available only to authorised Road-e-yo&apos;s instructors and will be used when reasonably necessary to protect your health or safety in an emergency.</p>
      </section>

      <section>
        <h2>Who processes information for us</h2>
        <p>We use service providers to operate the website, including Supabase for authentication and database services, Netlify for website hosting and deployment, OneSignal for optional phone push notifications, and email or payment providers when those facilities are used. They process information for us under their own security and data-processing arrangements and may operate internationally using appropriate safeguards.</p>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>We keep account and booking information while your account is active and afterwards only for as long as reasonably required for administration, safety, legal claims, tax or accounting obligations. Financial records may normally be retained for up to six years. Optional name-sharing permission lasts until you withdraw it. Information that is no longer required will be deleted or anonymised where appropriate.</p>
      </section>

      <section>
        <h2>Security</h2>
        <p>We use access controls and reputable service providers to help protect personal information. Passwords are handled by Supabase and are not visible to Road-e-yo&apos;s staff. No online service can guarantee absolute security, so please use a strong, unique password and keep it private.</p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>Depending on the circumstances, you may ask for access to your information, correction, deletion, restriction, portability or object to its use. You may withdraw consent at any time where we rely on consent. Contact us using the details above to make a request.</p>
        <p>If you have concerns, please contact us first so we can try to resolve them. You also have the right to complain to the <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">Information Commissioner&apos;s Office</a>.</p>
      </section>

      <section>
        <h2>Changes to this notice</h2>
        <p>We may update this notice when our services or legal responsibilities change. The latest version and its update date will be available on this page.</p>
      </section>
    </LegalPageLayout>
  );
}
