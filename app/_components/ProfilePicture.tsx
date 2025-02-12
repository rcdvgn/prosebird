"use client";

import stc from "string-to-color";
// @ts-ignore
import { ResponsiveFontSize } from "@allwqre/react-responsive-font-size";
// @ts-ignore
import hexToHsl from "hex-to-hsl";
import { useState, useEffect } from "react";
import { AnonymousIcon } from "../_assets/icons";

const ProfilePicturePlaceholder = ({ className, firstName, lastName }: any) => {
  const isAnonymous = !firstName || !lastName;

  if (isAnonymous)
    return (
      <div
        className={`aspect-square rounded-full flex items-center justify-center flex-shrink-0 min-w-0 ${className} bg-gray-200`}
      >
        <AnonymousIcon className="text-placeholder h-3/5" />
      </div>
    );

  const fullName = (firstName[0] + lastName[0]).toUpperCase();
  const nameColorHex = stc(fullName);
  const nameColorHue = hexToHsl(nameColorHex)[0];

  return (
    <div
      className={`aspect-square rounded-full flex items-center justify-center flex-shrink-0 min-w-0 text-primary font-semibold [&>div]:grid [&>div]:place-items-center ${className}`}
      style={{ backgroundColor: `hsl(${nameColorHue}, 78%, 37%)` }}
    >
      <ResponsiveFontSize
        ratio={0.4}
        optionsObject={{
          setFontSize: true,
        }}
      >
        {fullName}
      </ResponsiveFontSize>
    </div>
  );
};

const ProfilePicture = ({
  profilePictureURL,
  className = "",
  firstName,
  lastName,
}: any) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profilePictureURL) return;

    setIsLoading(true);
    setImageError(false);

    const img = new Image();
    img.src = profilePictureURL;

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setImageError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [profilePictureURL]);

  if (!profilePictureURL || imageError || isLoading) {
    return (
      <ProfilePicturePlaceholder
        className={className}
        firstName={firstName}
        lastName={lastName}
      />
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${profilePictureURL})`,
      }}
      className={`aspect-square rounded-full bg-cover bg-center flex-shrink-0 ${className}`}
    />
  );
};

export default ProfilePicture;
