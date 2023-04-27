import { currentUser } from "@clerk/nextjs/app-beta"

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new Response('Hello, world!')
  }

  return new Response(`Hello, ${user.firstName}!`)
}