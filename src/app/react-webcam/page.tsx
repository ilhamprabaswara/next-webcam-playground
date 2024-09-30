"use client";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import FlashlightControl from "./_components/flashlight-control";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = (webcamRef.current as Webcam).getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef, setImgSrc]);
  const retake = useCallback(() => {
    setImgSrc(null);
  }, [webcamRef, setImgSrc]);

  const changeFacing = () => {
    setFacingMode((res) => {
      if (res === "environment") {
        return "user";
      } else {
        return "environment";
      }
    });
  };
  return (
    <div className="w-full h-full">
      {imgSrc ? (
        <>
          <img style={{ height: "100dvh", objectFit: "cover" }} src={imgSrc} />
          <button className="absolute bottom-0" onClick={retake}>
            Retake photo
          </button>
        </>
      ) : (
        <>
          {/* <button className="absolute top-0 w-full" onClick={changeFacing}>
            Switch
          </button> */}

          <Webcam
            style={{
              height: "100dvh",
              objectFit: "cover",
              position: "absolute",
            }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            forceScreenshotSourceSize={true}
            videoConstraints={{ facingMode }}
          />
          <div className="absolute top-0">
            <FlashlightControl />
          </div>
          <button className="absolute bottom-52 w-full h-10" onClick={capture}>
            <span className="h-24 w-24 rounded-full bg-white inline-block" />
          </button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
