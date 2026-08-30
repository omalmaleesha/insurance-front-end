import Providers from "./providers";
import "./globals.css";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token = (await cookies()).get("token");

  // if (!token) {
  //   redirect("/login");
  // }
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}