"use client";

import { b64toBlob } from "@/utils";
import React, { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";

const App = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const camera = useRef<CameraType>(null);

  const captureMenu = [
    {
      action: () => {
        if (camera.current) {
          camera.current.switchCamera();
        }
      },
      label: "Switch",
    },
    {
      action: () => {
        if (camera.current) {
          camera.current.toggleTorch();
        }
      },
      label: "Torch",
    },
  ];

  if (image) {
    return (
      <>
        <div className="absolute top-10 w-full flex justify-between">
          <button
            className="w-16 h-16 bg-white rounded-full"
            onClick={() => setImage(null)}
          />
        </div>
        <img style={{ objectFit: "cover", width: "100%" }} src={image} />
        <div className="absolute bottom-10">
          <button>Simpan</button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="absolute top-10 left-5 z-10">
          {captureMenu.map((res) => (
            <button
              key={res.label}
              className="w-16 h-16 bg-white rounded-full basis-1/3"
              disabled={res.label === "Switch" && numberOfCameras <= 1}
              onClick={res.action}
            >
              {res.label}
            </button>
          ))}
        </div>
        <Camera
          ref={camera}
          aspectRatio="cover"
          facingMode="environment"
          numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          videoReadyCallback={() => {
            console.log("Video feed ready.");
          }}
        />
        <div className="absolute bottom-10 flex w-full justify-center">
          <button
            className="w-16 h-16 bg-white rounded-full"
            onClick={() => {
              if (camera.current) {
                const photo = camera.current.takePhoto();
                console.log(b64toBlob(photo as string));
                setImage(photo as string);
              }
            }}
          />
        </div>
      </>
    );
  }
};

export default App;
