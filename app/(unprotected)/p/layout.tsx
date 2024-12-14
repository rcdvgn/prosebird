// import { AutoscrollProvider } from "@/app/_contexts/AutoScrollContext";
import { PresentationProvider } from "@/app/_contexts/PresentationContext";

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PresentationProvider>
      {/* <AutoscrollProvider></AutoscrollProvider> */}
      {children}
    </PresentationProvider>
  );
}
