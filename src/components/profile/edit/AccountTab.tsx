"use client";

import { useState } from "react";
import type { UserMe } from "@/lib/users";
import type { Status } from "../../ui/StatusText";
import { View } from "./account/types";
import AccountOverview from "./account/AccountOverview";
import EmailSection from "./account/EmailSection";
import PasswordSection from "./account/PasswordSection";

type Props = {
  email: string;
  onUpdated: (me: UserMe) => void;
};

export default function AccountTab({ email, onUpdated }: Props) {
  const [view, setView] = useState<View>("overview");
  const [notice, setNotice] = useState<Status>(null);

  function open(next: View) {
    setNotice(null);
    setView(next);
  }

  function handleSaved(text: string) {
    setNotice({ type: "success", text });
    setView("overview");
  }

  // Cancel unmounts the form
  const backToOverview = () => setView("overview");

  switch (view) {
    case "email":
      return (
        <EmailSection
          email={email}
          onUpdated={onUpdated}
          onSaved={handleSaved}
          onCancel={backToOverview}
        />
      );

    case "password":
      return <PasswordSection onSaved={handleSaved} onCancel={backToOverview} />;

    default:
      return (
        <AccountOverview
          email={email}
          notice={notice}
          onEditEmail={() => open("email")}
          onEditPassword={() => open("password")}
        />
      );
  }
}