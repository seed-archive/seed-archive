import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/Legal";
import { alternates, type LangProps, pageLang } from "@/lib/locales";

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return {
    title: "Privacy policy — Seed Archive",
    alternates: alternates(await pageLang(props), "/privacy"),
    description:
      "What Seed Archive keeps if you sign in with Google, like a record, or send a bug report.",
  };
}

export default async function PrivacyPage(props: LangProps) {
  const lang = await pageLang(props);
  return (
    <LegalDocument
      lang={lang}
      title="Privacy policy"
      updated="15 November 2026"
    >
      <p>
        Seed Archive and every game&apos;s section of it can be read without an
        account. This policy describes the information the site handles and
        why.
      </p>

      <LegalSection title="Signing in">
        <p>
          Signing in with Google is optional, and one account serves the whole
          site. Google gives the site your name, email address, and profile
          picture, which are used only to run your account. They are used in
          line with the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements, and are never sold or used
          for advertising. A cookie keeps you signed in. Likes you mark are
          stored with your account.
        </p>
      </LegalSection>

      <LegalSection title="Visits and errors">
        <p>
          The site counts page visits without cookies and without identifying
          you. When a page fails, a technical error report is sent so the fault
          can be fixed; it can include the page address, browser details, and
          how the page was used. A bug report you send is attached to it.
        </p>
      </LegalSection>

      <LegalSection title="Who handles it">
        <p>
          The services that host the site, store accounts, provide sign-in, and
          receive error reports handle this information only to run the site.
          Nothing is shared with anyone else.
        </p>
      </LegalSection>

      <LegalSection title="How long it is kept">
        <p>
          Account details and likes are kept while the account exists. Error
          reports are kept while they help fix faults.
        </p>
      </LegalSection>

      <LegalSection title="Your account">
        <p>
          You can ask to see or delete your account and everything kept with
          it. Write through the Report a Bug button at the bottom of a
          game&apos;s pages and sign in first, so the request can be matched to
          your account.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The site is not directed at children and does not knowingly collect
          their information.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          This policy may change; the date above is the date of this version.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
