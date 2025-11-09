import React from "react";

const Video = () => {
  return (
    <div id="demo" className="w-full border-b border-[#252525] py-2 ">
      <div className="w-full border border-dashed border-[#252525] p-8 relative ">
        <div
          style={
            {
              height: "100%",
              "--pattern-fg": "#252525",
              borderRight: "1px dashed #252525",
              backgroundImage:
                "repeating-linear-gradient(315deg, #252525 0, #252525 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px",
              backgroundAttachment: "fixed",
            } as React.CSSProperties
          }
          className="w-[30px] lg:w-[50px] absolute left-0 top-0 hidden lg:block"
        />
        <div
          style={
            {
              height: "100%",
              "--pattern-fg": "#252525",
              borderLeft: "1px dashed #252525",
              backgroundImage:
                "repeating-linear-gradient(315deg, #252525 0, #252525 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px",
              backgroundAttachment: "fixed",
            } as React.CSSProperties
          }
          className="w-[30px] lg:w-[50px] absolute right-0 top-0 hidden lg:block"
        />
        <div className="relative w-full lg:w-[70%] mx-auto overflow-hidden rounded-2xl aspect-video">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/q3I15TCRa88?si=Fg3NxVkUhKrLjvm8"
            title="Opensox Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Video;
