"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import SplitView from "@/app/_components/SplitView";
import {
  AcademicIcon,
  CircledCheckIcon,
  PersonalIcon,
  ProfessionalIcon,
} from "@/app/_assets/icons";

const OcuppationPicker = ({
  title,
  subtitle,
  icon,
  occupation,
  setOccupation,

  targetOccupation,
}: any) => {
  const isSelected = occupation === targetOccupation;

  return (
    <div
      onClick={() => {
        isSelected ? setOccupation("") : setOccupation(targetOccupation);
      }}
      className={`group w-full rounded-xl border-border border-[1px] px-3.5 py-3 flex gap-6 items-center justify-start cursor-pointer hover:border-brand ${
        isSelected ? "border-brand" : ""
      }`}
    >
      <div
        className={`rounded-[10px] border-border border-[1px] grid place-items-center h-[50px] aspect-square group-hover:border-transparent group-hover:bg-brand ${
          isSelected ? "border-transparent bg-brand" : ""
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-2 grow">
        <div className="flex items-center justify-between">
          <span className="block text-primary text-sm font-bold">{title}</span>
          {isSelected && <CircledCheckIcon className="text-primary" />}
        </div>
        <span className="block text-secondary text-[13px] font-semibold">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

const BasicInfo = ({
  firstName,
  lastName,
  setFirstName,
  setLastName,
  occupation,
  setOccupation,
}: any) => {
  return (
    <>
      <div className="flex flex-col gap-12 w-[500px]">
        <div className="flex gap-3.5">
          <div className="flex flex-col gap-4 grow">
            <label className="text-primary text-sm font-semibold">
              First name*
            </label>
            <input
              type="text"
              value={firstName}
              placeholder="E.g. Gabriella"
              className="input-default w-full"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-4 grow">
            <label className="text-primary text-sm font-semibold">
              Last name*
            </label>
            <input
              type="text"
              value={lastName}
              placeholder="E.g. Molina"
              className="input-default w-full"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 grow">
          <label className="text-primary text-sm font-semibold">
            How are you going to use Cyrus?
          </label>

          <div className="flex flex-col gap-5">
            <OcuppationPicker
              title="I’m a student"
              subtitle="Use Cyrus for school activities, group projects, or presentations"
              icon={<AcademicIcon className="text-primary h-4" />}
              occupation={occupation}
              setOccupation={setOccupation}
              targetOccupation="student"
            />

            <OcuppationPicker
              title="I’m a professional"
              subtitle="For work meetings, webinars, and professional events"
              icon={<ProfessionalIcon className="text-primary h-4" />}
              occupation={occupation}
              setOccupation={setOccupation}
              targetOccupation="professional"
            />

            <OcuppationPicker
              title="I’ll use it personally"
              subtitle="Perfect for personal projects and creative pursuits"
              icon={<PersonalIcon className="text-primary h-4" />}
              occupation={occupation}
              setOccupation={setOccupation}
              targetOccupation="personal"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default function Onboarding() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState<any>("");
  const [lastName, setLastName] = useState<any>("");
  const [occupation, setOccupation] = useState<any>("");

  const [progress, setProgress] = useState<any>(0);

  const handleForward = () => {
    if (progress < Object.keys(screens).length - 1) {
      setProgress((currProgress: any) => currProgress + 1);
    }
  };

  const handlePrevious = () => {
    if (progress > 0) {
      setProgress((currProgress: any) => currProgress - 1);
    }
  };

  const handleSubmit = () => {
    console.log({
      firstName,
      lastName,
    });
  };

  const screens: { [key: number]: JSX.Element } = {
    0: (
      <BasicInfo
        setFirstName={setFirstName}
        setLastName={setLastName}
        firstName={firstName}
        lastName={lastName}
        occupation={occupation}
        setOccupation={setOccupation}
      />
    ),
  };

  useEffect(() => {
    if (user) {
      if (user.firstName) {
        router.push("/files");
      }
    } else {
      router.push("/");
    }
  }, [user]);

  // useEffect(() => {
  //   return () => {
  //     logout();
  //   };
  // }, []);

  return user && !user.firstName ? (
    <SplitView options={{ side: "left", containerWidth: "fit" }}>
      <div className="w-[700px] h-full flex flex-col justify-between items-center p-4">
        {screens[progress]}

        <div className="flex justify-between items-center mt-auto w-full">
          <button onClick={handlePrevious} className="button-default w-fit">
            Go back
          </button>

          <button className="button-default w-fit" type="submit">
            Continue
          </button>
        </div>
      </div>
    </SplitView>
  ) : null;
}
