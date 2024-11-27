import React from "react";
import SoundOrb from "./SoundOrb";
import AudioVisualizer from "./AudioVisualizer";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center py-20 px-2 sm:px-0">
      <div className="w-full max-w-md flex flex-col items-start gap-12">
        {/* Header Section */}
        <header className="w-full flex flex-col items-start gap-2">
          <p className="text-black text-3xl font-normal leading-9 font-sans">
            Crafting a more playful internet from New York City — designer, prototyper, and{" "}
            <em>
              <a
                href="https://suno.ai"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Suno
              </a>
            </em>{" "}
            rapper.
          </p>
        </header>

        {/* Orb Section */}
        <div className="w-full flex flex-col gap-8 items-center">
          {/* SoundOrb */}
          <div
            className="w-full relative"
            style={{
              paddingTop: "100%", // 1:1 aspect ratio
              borderRadius: "24px",
              backgroundColor: "#f3f3f3",
              overflow: "hidden",
            }}
          >
            <div
              className="absolute inset-0 flex justify-center items-center"
              style={{
                borderRadius: "inherit",
              }}
            >
              <SoundOrb />
            </div>
          </div>

          {/* AudioVisualizer */}
          <div
            className="w-full relative"
            style={{
              paddingTop: "100%", // 1:1 aspect ratio
              borderRadius: "24px",
              backgroundColor: "#f3f3f3",
              overflow: "hidden",
            }}
          >
            <div
              className="absolute inset-0 flex justify-center items-center"
              style={{
                borderRadius: "inherit",
              }}
            >
              <AudioVisualizer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
