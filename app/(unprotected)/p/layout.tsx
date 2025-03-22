import { DeepgramContextProvider } from "@/app/_contexts/DeepgramContextProvider";
import { MicrophoneContextProvider } from "@/app/_contexts/MicrophoneContext";
import { PresentationProvider } from "@/app/_contexts/PresentationContext";
import { ScrollProvider } from "@/app/_contexts/ScrollNavigationContext";

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PresentationProvider>
      <ScrollProvider>
        <MicrophoneContextProvider>
          <DeepgramContextProvider>{children}</DeepgramContextProvider>
        </MicrophoneContextProvider>
      </ScrollProvider>
    </PresentationProvider>
  );
}
