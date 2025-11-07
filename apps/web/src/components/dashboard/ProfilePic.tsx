"use client";

import Image from "next/image";
import imgUrl from "../../assets/images/user_dp.webp";

export const ProfilePic = () => {
  return (
    <div className="rounded-full overflow-hidden inline-block h-8 w-8 border">
      <Image
        alt="User Profile"
        src={imgUrl}
        className="w-full h-full object-cover"
        width={10}
        height={10}
      ></Image>
    </div>
  );
};
