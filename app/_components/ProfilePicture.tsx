"use client";

import { useState, useEffect } from "react";

const ProfilePicturePlaceholder = ({
  className = "",
  firstName,
  lastName,
}: any) => (
  <div
    className={`aspect-square rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 min-w-0 ${className}`}
  >
    <span className="text-gray-500 text-[length:2cqmin] font-bold">
      {(firstName[0] + lastName[0]).toUpperCase()}
    </span>
  </div>
);

const ProfilePicture = ({
  profilePictureURL,
  className = "",
  firstName = "",
  lastName = "",
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
