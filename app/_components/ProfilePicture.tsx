export default function ProfilePicture({ profilePictureURL, className }: any) {
  return profilePictureURL ? (
    <div
      style={{
        backgroundImage: `url(${profilePictureURL})`,
      }}
      className={`aspect-square rounded-full bg-cover bg-center flex-shrink-0 cursor-pointer ${className}`}
    ></div>
  ) : (
    <h1 className="text-primary">Default pfp</h1>
  );
}
