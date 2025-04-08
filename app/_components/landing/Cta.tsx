"use client";
import { EmailIcon } from "@/app/_assets/presentationIcons";
import { useState } from "react";

export default function Cta() {
  const [isFocused, setIsFocused] = useState<any>(false);
  const [email, setEmail] = useState<any>("");
  const handleSubmitEmail = (e: any) => {
    e.preventDefault();

    console.log(email);
  };

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return (
    <form
      onClick={handleSubmitEmail}
      className={`flex flex-col items-center justify-center mx-auto my-8 w-[450px]`}
    >
      <div
        className={`transition-all duration-300 ease-in-out flex items-center h-[50px] rounded-[14px] bg-background/50 border-[1px] focus-within:border-border border-stroke pr-2 ${
          isFocused || email.length ? "w-full" : "w-[350px]"
        }`}
      >
        <span className="w-[50px] h-full grid place-items-center">
          <EmailIcon className="text-placeholder w-5 translate-x-1" />
        </span>

        <input
          value={email}
          onFocus={onFocus}
          onBlur={onBlur}
          type="text"
          className="grow h-full placeholder:text-placeholder bg-transparent border-none outline-none pr-2 text-primary font-semibold text-[15px]"
          placeholder="Your email"
          onChange={(e: any) => setEmail(e.target.value)}
        />

        <button className="rounded-[10px] bg-brand px-3.5 h-[34px] text-primary font-bold text-[13px] shrink-0">
          Apply
        </button>
      </div>

      <p
        className={`my-4 leading-5 font-medium text-[13px] text-secondary text-center px-2 ${
          isFocused || email.length ? "opacity-100" : "opacity-0"
        }`}
      >
        By applying, you agree to be notified of product launches and updates by
        email, which you can unsubscribe from at any time.
      </p>
    </form>
  );
}
