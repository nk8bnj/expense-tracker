import { MarketingNav } from "@/components/marketing-nav"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </>
  );
}
