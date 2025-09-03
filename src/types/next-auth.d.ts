declare module "next-auth" {
  interface Session {
    userId?: string
  }
  
  interface JWT {
    userId?: string
  }
}