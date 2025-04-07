"use client";
import { EmailIcon } from "@/app/_assets/presentationIcons";
import { useState } from "react";

export default function Hero() {
  const [isFocused, setIsFocused] = useState<any>(false);
  const [email, setEmail] = useState<any>("");
  const handleSubmitEmail = (e: any) => {
    e.preventDefault();

    console.log(email);
  };

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return (
    <div className="flex justify-between items-center">
      <div className="w-[540px] py-12">
        <div className="font-extrabold text-7xl leading-[74px] my-6">
          <span className="block text-primary">Worry less</span>
          <span className="block text-brand">say much more</span>
        </div>

        <div className="my-2">
          <span className="font-semibold text-base leading-6 text-secondary">
            ProseBird is your all-in-one teleprompter for flawless virtual
            presentations. Collaborate in real time, control progress with your
            voice, and deliver confidently every time you step on the virtual
            stage.
          </span>
        </div>

        <form onClick={handleSubmitEmail} className="my-12">
          <div className="flex items-center h-[54px] rounded-[14px] bg-background border-[1px] focus-within:border-border border-stroke w-full pr-2.5">
            <span className="w-[50px] h-full grid place-items-center">
              <EmailIcon className="text-placeholder w-5 translate-x-1" />
            </span>

            <input
              value={email}
              onFocus={onFocus}
              onBlur={onBlur}
              type="text"
              className="grow h-full placeholder:text-placeholder bg-transparent border-none outline-none pr-2 text-primary font-semibold text-sm"
              placeholder="Your email"
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <button className="rounded-[10px] bg-brand px-3.5 h-[34px] text-primary font-bold text-[13px] shrink-0">
              Apply
            </button>
          </div>

          {isFocused && (
            <p className="my-4 leading-5 font-medium text-[13px] text-secondary text-center">
              By applying, you agree to be notified of product launches and
              updates, which you can unsubscribe from at any time.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
