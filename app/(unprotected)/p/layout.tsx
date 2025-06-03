import { OpenAIRealtimeContextProvider } from "@/app/_contexts/OpenAIRealtimeContext";
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
        <OpenAIRealtimeContextProvider>
          {children}
        </OpenAIRealtimeContextProvider>
      </ScrollProvider>
    </PresentationProvider>
  );
}
