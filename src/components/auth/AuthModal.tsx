"use client";

import type { AuthMode } from "./AuthModalProvider";
import LoginForm from "./LoginForm";
import SignUpFlow from "./SignUpFlow";
import Modal from "../ui/modals/Modal";

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
      className="h-125 max-w-110 overflow-y-auto sm:h-150"
    >
      {mode === "login" ? (
        <LoginForm onClose={onClose} onSwitch={onSwitch} />
      ) : (
        <SignUpFlow onClose={onClose} onSwitch={onSwitch} />
      )}
    </Modal>
  );
}