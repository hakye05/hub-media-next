"use client";

import type { AuthMode } from "./AuthProvider";
import LoginForm from "./LoginForm";
import SignUpFlow from "./SignUpFlow";
import Modal from "../ui/Modal";

type Props = {
  mode: AuthMode;
  onClose: () => void;
  onSwitch: () => void;
};

export default function AuthModal({ mode, onClose, onSwitch }: Props) {
  return (
    <Modal
      label={mode === "login" ? "Log in" : "Sign up"}
      onClose={onClose}
      className="h-150 max-w-110 overflow-y-auto"
    >
      {mode === "login" ? (
        <LoginForm onClose={onClose} onSwitch={onSwitch} />
      ) : (
        <SignUpFlow onClose={onClose} onSwitch={onSwitch} />
      )}
    </Modal>
  );
}