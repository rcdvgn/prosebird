import { AutoscrollProvider } from "@/app/_contexts/AutoScrollContext";

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AutoscrollProvider>{children}</AutoscrollProvider>;
}
