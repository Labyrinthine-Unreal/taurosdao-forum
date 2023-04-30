import { ClerkProvider } from "@clerk/nextjs/app-beta";
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>TaurosDAO Forums Login</title>
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
