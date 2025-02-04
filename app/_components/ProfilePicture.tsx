export default function ProfilePicture({ profilePictureURL, size }: any) {
  return profilePictureURL ? (
    <div
      style={{
        backgroundImage: `url(${profilePictureURL})`,
      }}
      className="h-9 aspect-square rounded-full bg-cover bg-center flex-shrink-0 cursor-pointer"
    ></div>
  ) : (
    <h1 className="text-primary">Default pfp</h1>
  );
}
