import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  maxSeconds?: number; // optional timer
  onRecorded?: (blob: Blob) => void; // called when user stops
};

function pickMimeType() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const t of candidates) {
    // @ts-ignore
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

export default function VideoRecorder({ maxSeconds = 180, onRecorded }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string>("");

  const mimeType = useMemo(() => pickMimeType(), []);

  // 1) Pre-warm permissions + stream so Start is instant
  const prepareCamera = async () => {
    setError("");
    try {
      if (streamRef.current) {
        setReady(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // avoid echo
        await videoRef.current.play();
      }

      setReady(true);
    } catch (e: any) {
      setError(e?.message || "Could not access camera/microphone.");
    }
  };

  // 2) Start recording with minimal lag
  const start = async () => {
    setError("");
    if (!streamRef.current) {
      await prepareCamera();
      if (!streamRef.current) return;
    }

    try {
      chunksRef.current = [];
      setSeconds(0);

      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const rec = new MediaRecorder(streamRef.current!, options);

      recorderRef.current = rec;

      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      rec.onstop = () => {
        const type = mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        onRecorded?.(blob);
      };

      // timeslice makes it emit chunks regularly (more stable, less memory spikes)
      rec.start(1000);

      setRecording(true);

      // timer
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= maxSeconds) {
            stop();
          }
          return next;
        });
      }, 1000);
    } catch (e: any) {
      setError(e?.message || "Could not start recording.");
    }
  };

  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);

    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
  };

  // cleanup
  useEffect(() => {
    prepareCamera(); // preload on mount for “no lag”
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-3">
        <video
          ref={videoRef}
          playsInline
          className="w-full rounded-lg bg-black"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {recording ? (
            <span className="text-red-400">● Recording</span>
          ) : ready ? (
            <span className="text-emerald-400">● Ready</span>
          ) : (
            <span>Loading camera…</span>
          )}{" "}
          <span className="ml-2">
            {seconds}s / {maxSeconds}s
          </span>
        </div>

        <div className="flex gap-2">
          {!recording ? (
            <button
              className="h-10 rounded-xl bg-primary px-4 text-primary-foreground disabled:opacity-60"
              onClick={start}
              disabled={!ready}
            >
              Start
            </button>
          ) : (
            <button
              className="h-10 rounded-xl bg-white/10 px-4 text-white hover:bg-white/15"
              onClick={stop}
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}