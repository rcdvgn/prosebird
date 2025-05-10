"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import SplitView from "@/app/_components/SplitView";

import Origin from "@/app/_components/onboarding/Origin";
import Team from "@/app/_components/onboarding/Team";
import OnboardingContainer from "@/app/_components/containers/OnboardingContainer";
import UserType from "../onboarding/UserType";
import IntendedUse from "@/app/_components/onboarding/IntendedUse";
import DisplayName from "../onboarding/DisplayName";
import { fetchUser, updateUserOnboardingData } from "@/app/_services/client";

export default function Onboarding() {
  const { user, setUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  // Centralized state
  const [formData, setFormData] = useState({
    displayName: "",
    userType: null,
    intendedUse: [] as string[],
    team: null,
    contacts: ["", "", ""],
    origin: null,
    otherOrigin: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const steps = [
    {
      component: DisplayName,
      title: "It’s great to have you here!",
      description: "Help us get to know you by starting with your name.",
      validate: () => {
        const isValid =
          formData.displayName.length >= 2 && formData.displayName.length <= 30;
        setErrors((e) => ({
          ...e,
          displayName: isValid
            ? ""
            : "Name must be between 2 and 30 characters.",
        }));
        return isValid;
      },
      skippable: false,
    },
    {
      component: Origin,
      title: "How did you hear about us?",
      description:
        "We’d love to know where you found us (this step is optional).",
      validate: () => true, // skippable
      skippable: true,
    },
    {
      component: UserType,
      title: "What kind of user do you consider yourself to be?",
      description: "Choose how you'll mostly use ProseBird.",
      validate: () => {
        const isValid = formData.userType !== null;
        setErrors((e) => ({
          ...e,
          userType: isValid ? "" : "Please choose one option.",
        }));
        return isValid;
      },
      skippable: false,
    },
    {
      component: IntendedUse,
      title: "How do you plan to use ProseBird?",
      description:
        "Letting us know how you’ll use ProseBird helps us shape a better experience for you.",
      validate: () => {
        const isValid = formData.intendedUse.length > 0;
        setErrors((e) => ({
          ...e,
          intendedUse: isValid ? "" : "Please select at least one activity.",
        }));
        return isValid;
      },
      skippable: false,
    },

    {
      component: Team,
      title: "Who will you be working with?",
      description:
        "Tell us if you’ll be flying solo or collaborating with others.",
      validate: () => {
        const isValid = formData.team !== null;
        setErrors((e) => ({
          ...e,
          team: isValid ? "" : "Please choose one option.",
        }));
        return isValid;
      },
      skippable: false,
    },
  ];

  const StepComponent = steps[currentStep].component;
  const isFinal = currentStep === steps.length - 1;

  const handleContinue = async () => {
    const isValid = steps[currentStep].validate();
    if (isValid) {
      if (isFinal) {
        const cleaned = {
          ...formData,
          contacts:
            formData.team === true
              ? formData.contacts.filter((email) => email.trim() !== "")
              : undefined,
          otherOrigin:
            formData.origin === "Other"
              ? formData.otherOrigin.trim()
              : undefined,
        };

        await updateUserOnboardingData(user.id, cleaned);

        const userData = await fetchUser(user.id);
        setUser(userData);
      } else {
        setCurrentStep((curr) => curr + 1);
      }
    }
  };

  return user && !user.displayName ? (
    <SplitView
      options={{
        side: "left",
        contentWidth: "fit",
        containerStyling:
          "h-[90vh] max-h-[700px] rounded-xl ring-1 ring-stroke",
      }}
    >
      <OnboardingContainer
        title={steps[currentStep].title}
        description={steps[currentStep].description}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleContinue={handleContinue}
        isFinal={isFinal}
        skippable={steps[currentStep]?.skippable}
      >
        <StepComponent
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          formData={formData}
          setFormData={setFormData}
          error={errors}
        />
      </OnboardingContainer>
    </SplitView>
  ) : null;
}
