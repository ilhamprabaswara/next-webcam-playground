import { useEffect, useState } from "react";

class FlashlightHandler {
  static track: MediaStreamTrack | null = null; // The video track which is used to turn on/off the flashlight

  static async accessFlashlight(): Promise<void> {
    // Check browser support for mediaDevices and enumerateDevices
    if (
      !("mediaDevices" in navigator) ||
      typeof navigator.mediaDevices.enumerateDevices !== "function"
    ) {
      alert(
        "Media Devices not available or enumerateDevices not supported. Use HTTPS and a modern browser!"
      );
      return;
    }

    try {
      // Get the environment camera (usually the second one)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");

      if (cameras.length === 0) {
        alert(
          "No camera found. If your device has a camera available, check permissions."
        );
        return;
      }

      const camera = cameras[cameras.length - 1];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: camera.deviceId },
      });

      this.track = stream.getVideoTracks()[0];

      if (!this.track.getCapabilities().torch) {
        alert("No torch available.");
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("An error occurred while accessing the camera.");
    }
  }

  static async setFlashlightStatus(status: boolean): Promise<void> {
    if (this.track) {
      await this.track.applyConstraints({
        advanced: [{ torch: status }],
      });
    }
  }
}

const FlashlightControl: React.FC = () => {
  const [flashlightStatus, setFlashlightStatus] = useState<boolean | null>(
    null
  );

  const handleAccessFlashlight = async () => {
    await FlashlightHandler.accessFlashlight();
    setFlashlightStatus(false);
  };

  const handleToggleFlashlight = async () => {
    if (flashlightStatus === null) return;

    const newStatus = !flashlightStatus;
    await FlashlightHandler.setFlashlightStatus(newStatus);
    setFlashlightStatus(newStatus);
  };

  useEffect(() => {
    const getCamera = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");

      if (cameras.length === 0) {
        alert(
          "No camera found. If your device has a camera available, check permissions."
        );
        return;
      }

      const camera = cameras[cameras.length - 1];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: camera.deviceId },
      });
      console.log({ stream: stream.getVideoTracks() });
      if (stream.getVideoTracks().length > 0) {
        await FlashlightHandler.accessFlashlight();
        setFlashlightStatus(false);
      }
    };
    getCamera();
  }, [navigator]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Flashlight Control</h1>
      <button
        onClick={handleAccessFlashlight}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Access Flashlight
      </button>
      <button
        onClick={handleToggleFlashlight}
        disabled={flashlightStatus === null}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        {flashlightStatus === null
          ? "Turn Flashlight On"
          : flashlightStatus
          ? "Turn Flashlight Off"
          : "Turn Flashlight On"}
      </button>
    </div>
  );
};

export default FlashlightControl;
