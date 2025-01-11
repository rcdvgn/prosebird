import { DeepgramContextProvider } from "@/app/_contexts/DeepgramContextProvider";
import { MicrophoneContextProvider } from "@/app/_contexts/MicrophoneContext";
import { PresentationProvider } from "@/app/_contexts/PresentationContext";

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MicrophoneContextProvider>
      <DeepgramContextProvider>
        <PresentationProvider>{children}</PresentationProvider>
      </DeepgramContextProvider>
    </MicrophoneContextProvider>
  );
}
