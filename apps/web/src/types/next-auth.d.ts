import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwtToken?: string;
  }
} 
declare module "react-player/lazy" {
  import ReactPlayer from "react-player";

  export default ReactPlayer;
}