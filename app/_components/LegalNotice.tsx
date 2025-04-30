import React from "react";

export default function LegalNotice() {
  return (
    <span className="text-center font-medium text-sm mt-auto">
      <span className="text-primary">
        By creating an account and/or logging in, you agree to ProseBirds{" "}
      </span>
      <a href="#">Terms of Service</a> <span className="text-primary">and</span>{" "}
      <a href="#">Privacy Policy.</a>
    </span>
  );
}
