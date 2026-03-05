import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  companies,
  questions,
  getQuestionsForCompany,
  shuffleArray,
} from "@/data/questions";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  RotateCcw,
  Download,
} from "lucide-react";

const TIME_OPTIONS = [
  { label: "1 Minute", value: 60 },
  { label: "2 Minutes", value: 120 },
  { label: "3 Minutes", value: 180 },
  { label: "5 Minutes", value: 300 },
];

const LS_SESSION_COMPANY_KEY = "cbc_session_company_id";
const LS_SESSION_QUESTIONS_KEY = "cbc_session_questions";

function pickMimeType() {
  const types = ["video/webm;codecs=vp8,opus", "video/webm"];
  for (const t of types) {
    // @ts-ignore
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

const Interview = () => {
  const { user } = useAuth();

  const [selectedCompanyId, setSelectedCompanyId] = useState(
    companies[8]?.id || "9"
  );
  const [timeLimit, setTimeLimit] = useState(180);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [retries, setRetries] = useState(0);

  const [status, setStatus] = useState("");

  // recording preview
  const [webmUrl, setWebmUrl] = useState<string | null>(null);
  const [webmBlob, setWebmBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeType = useMemo(() => pickMimeType(), []);

  // Force re-shuffle when selecting a company
  const [shuffleKey, setShuffleKey] = useState(0);
  const handleCompanyChange = (newId: string) => {
    setSelectedCompanyId(newId);
    setShuffleKey((k) => k + 1);
  };

  const shuffledQuestions = useMemo(() => {
    const all = shuffleArray(getQuestionsForCompany(selectedCompanyId, questions));
    const min = 3;
    const max = 6;
    const count = Math.min(
      all.length,
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    const picked = all.slice(0, count);

    localStorage.setItem(LS_SESSION_COMPANY_KEY, selectedCompanyId);
    localStorage.setItem(LS_SESSION_QUESTIONS_KEY, JSON.stringify(picked));

    return picked;
  }, [selectedCompanyId, shuffleKey]);

  const activeQuestion = shuffledQuestions[currentQuestionIndex];

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setRetries(0);
    setIsRecording(false);
    setTimeRemaining(timeLimit);
    clearTimer();
  }, [selectedCompanyId, timeLimit]);

  const enableCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        setCameraEnabled(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 854, height: 480, frameRate: 24 },
        audio: true,
      });

      streamRef.current = stream;
      setCameraEnabled(true);
      setStatus("Camera ready");
    } catch (err) {
      console.error(err);
      setStatus("Camera access denied");
    }
  }, []);

  useEffect(() => {
    if (!cameraEnabled) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(() => {});
  }, [cameraEnabled]);

  const startRecording = async () => {
    setStatus("");

    if (!cameraEnabled || !streamRef.current) {
      await enableCamera();
      if (!streamRef.current) return;
    }

    if (!window.MediaRecorder) {
      setStatus("MediaRecorder not supported (use Chrome/Edge).");
      return;
    }

    // Clear old recording preview when you start a new attempt
    if (webmUrl) URL.revokeObjectURL(webmUrl);
    setWebmUrl(null);
    setWebmBlob(null);

    chunksRef.current = [];

    try {
      const options: MediaRecorderOptions = {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: 900_000,
        audioBitsPerSecond: 96_000,
      };

      const rec = new MediaRecorder(streamRef.current!, options);
      recorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "video/webm" });

        if (blob.size < 2000) {
          setStatus("Recording was empty. Make sure mic+camera allowed.");
          return;
        }

        const url = URL.createObjectURL(blob);
        setWebmBlob(blob);
        setWebmUrl(url);
        setStatus(`Saved recording (${Math.round(blob.size / 1024)} KB)`);
      };

      rec.start(250);
      setIsRecording(true);
      setTimeRemaining(timeLimit);
      setStatus("Recording…");

      clearTimer();
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
      setStatus("Failed to start recording.");
    }
  };

  const stopRecording = () => {
    clearTimer();
    setIsRecording(false);

    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {}
    }
  };

  const recordAgain = () => {
    // clears preview and resets time so you're ready to go
    if (webmUrl) URL.revokeObjectURL(webmUrl);
    setWebmUrl(null);
    setWebmBlob(null);
    setTimeRemaining(timeLimit);
    setStatus("");
  };

  const handleRetry = () => {
    if (activeQuestion && retries < activeQuestion.max_retries) {
      setRetries((r) => r + 1);
      stopRecording();
      setTimeRemaining(timeLimit);
      recordAgain();
    }
  };

  const goNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setRetries(0);
      stopRecording();
      setTimeRemaining(timeLimit);
      recordAgain();
    }
  };

  const goPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
      setRetries(0);
      stopRecording();
      setTimeRemaining(timeLimit);
      recordAgain();
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      if (webmUrl) URL.revokeObjectURL(webmUrl);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      clearTimer();
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        try {
          rec.stop();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

return (
  <div className="min-h-screen bg-background">
    <Navbar />

    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hirevue Practice</h1>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Built by </span>
          <span className="opacity-60">•</span>
          <a
            href="https://www.linkedin.com/in/abdulsemed-abdulsemed-098a4a265"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Abdul
          </a>
          <span> Inspired by • </span>
          <a
            href="https://www.linkedin.com/in/paul-lazarte/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Paul
          </a>
        </div>

        {status ? (
          <div className="mt-2 text-xs text-muted-foreground">{status}</div>
        ) : null}
      </div>

      {/* Toolbar */}
      <div className="rounded-xl border border-border/60 bg-card/60 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-2 gap-6 items-end">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Company
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full h-11 rounded-lg border border-border/60 bg-secondary/60 text-foreground px-3 text-sm"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Time Limit
            </label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full h-11 rounded-lg border border-border/60 bg-secondary/60 text-foreground px-3 text-sm"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Question panel */}
        <div className="rounded-xl border border-border/60 bg-card p-6 min-h-[360px] flex flex-col">
          {shuffledQuestions.length > 0 && activeQuestion ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <p className="text-muted-foreground text-sm">
                  Question{" "}
                  <span className="text-foreground font-semibold">
                    {currentQuestionIndex + 1}
                  </span>{" "}
                  of{" "}
                  <span className="text-foreground font-semibold">
                    {shuffledQuestions.length}
                  </span>
                </p>
              </div>

              <div className="pt-5 flex-1">
                <p className="text-foreground text-xl leading-relaxed">
                  {activeQuestion.question_text}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/60">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goPrev}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goNext}
                    disabled={currentQuestionIndex === shuffledQuestions.length - 1}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRetry}
                  disabled={
                    !activeQuestion || retries >= (activeQuestion?.max_retries ?? 3)
                  }
                >
                  Retry ({retries}/{activeQuestion?.max_retries ?? 3})
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center my-auto">
              No questions available.
            </p>
          )}
        </div>

        {/* Right column: Camera + Preview below it */}
        <div className="flex flex-col gap-6">
          {/* Camera card */}
          <div className="rounded-xl border border-border/60 bg-card shadow-sm min-h-[360px] relative overflow-hidden">
            <div className="absolute inset-3 rounded-xl border border-border/40 bg-black/30" />

            {cameraEnabled ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] rounded-xl object-cover"
                />

                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <div className="rounded-xl border border-border/50 bg-background/55 backdrop-blur px-4 py-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-mono text-foreground">
                      {formatTime(timeRemaining)}
                    </div>

                    {isRecording ? (
                      <Button size="sm" variant="destructive" onClick={stopRecording}>
                        <Square className="h-4 w-4" /> Stop
                      </Button>
                    ) : (
                      <Button size="sm" onClick={startRecording}>
                        <Play className="h-4 w-4" /> Start
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-10">
                <div className="h-14 w-14 rounded-2xl border border-border/60 bg-secondary/60 flex items-center justify-center">
                  <Camera className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-semibold">Camera preview</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable your camera to practice like a real HireVue.
                  </p>
                </div>
                <Button onClick={enableCamera}>Allow Camera Access</Button>
              </div>
            )}
          </div>

          {/* Preview card (separate) */}
          <div className="rounded-xl border border-border/60 bg-card shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-semibold">Last Recording</p>
                <p className="text-xs text-muted-foreground">
                  Watch it here, download it, or record again.
                </p>
              </div>

              <Button variant="secondary" size="sm" onClick={recordAgain} disabled={!webmUrl}>
                <RotateCcw className="h-4 w-4" /> Record again
              </Button>
            </div>

            {!webmUrl ? (
              <div className="mt-4 text-sm text-muted-foreground">
                No recording yet. Hit{" "}
                <span className="text-foreground font-semibold">Start</span> to begin.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <video src={webmUrl} controls playsInline className="w-full rounded-lg bg-black" />

                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    {webmBlob ? `${Math.round(webmBlob.size / 1024)} KB` : ""}
                  </div>

                  <a
                    href={webmUrl}
                    download="cbc-hirevue-recording.webm"
                    className="inline-flex items-center gap-2 text-sm text-primary underline"
                  >
                    <Download className="h-4 w-4" />
                    Download WebM
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* ✅ ADDED: LinkedIn floating button (correct place) */}
    <a
      href="https://www.linkedin.com/in/abdulsemed-abdulsemed-098a4a265"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 z-50 rounded-full border border-border bg-card/90 p-2 shadow-lg hover:bg-muted transition"
    >
      <img
        src="/linkedin.png"
        alt="LinkedIn"
        width={40}
        height={40}
        className="rounded-full"
      />
    </a>
  </div>
);
};

export default Interview;