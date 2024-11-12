import { AutoscrollProvider } from "@/app/_contexts/AutoScrollContext";
import { ObserverProvider } from "@/app/_contexts/ObserverContext";

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ObserverProvider>
      <AutoscrollProvider>{children}</AutoscrollProvider>
    </ObserverProvider>
  );
}
