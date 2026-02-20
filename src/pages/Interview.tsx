import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  companies,
  questions,
  genericQuestions,
  getQuestionsForCompany,
  shuffleArray,
} from "@/data/questions";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, ChevronRight, Play, Square } from "lucide-react";

const TIME_OPTIONS = [
  { label: "1 Minute", value: 60 },
  { label: "2 Minutes", value: 120 },
  { label: "3 Minutes", value: 180 },
  { label: "5 Minutes", value: 300 },
];

const LS_SESSION_COMPANY_KEY = "cbc_session_company_id";
const LS_SESSION_QUESTIONS_KEY = "cbc_session_questions";

const Interview = () => {
  const { user } = useAuth();

  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[8]?.id || "9");
  const [timeLimit, setTimeLimit] = useState(180);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [retries, setRetries] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  // Force re-shuffle when selecting a company (even same one)
  const [shuffleKey, setShuffleKey] = useState(0);
  const handleCompanyChange = (newId: string) => {
    setSelectedCompanyId(newId);
    setShuffleKey((k) => k + 1);
  };

  // Get randomized questions (3 to 6)
  const shuffledQuestions = useMemo(() => {
    const all = shuffleArray(getQuestionsForCompany(selectedCompanyId, questions));

    const min = 3;
    const max = 6;
    const count = Math.min(all.length, Math.floor(Math.random() * (max - min + 1)) + min);

    const picked = all.slice(0, count);

    localStorage.setItem(LS_SESSION_COMPANY_KEY, selectedCompanyId);
    localStorage.setItem(LS_SESSION_QUESTIONS_KEY, JSON.stringify(picked));

    return picked;

  }, [selectedCompanyId, shuffleKey]);

  const activeQuestion = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setRetries(0);
    setIsRecording(false);
    setTimeRemaining(timeLimit);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [selectedCompanyId, timeLimit]);

  const enableCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setCameraEnabled(true);
    } catch (err) {
      console.error("Camera access denied", err);
    }
  }, []);

  // ✅ Attach stream AFTER video mounts
  useEffect(() => {
    if (!cameraEnabled) return;

    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;
    video.play().catch(() => {});
  }, [cameraEnabled]);

  const startRecording = () => {
    setIsRecording(true);
    setTimeRemaining(timeLimit);

    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const handleRetry = () => {
    if (activeQuestion && retries < activeQuestion.max_retries) {
      setRetries((r) => r + 1);
      stopRecording();
      setTimeRemaining(timeLimit);
    }
  };

  const goNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setRetries(0);
      stopRecording();
      setTimeRemaining(timeLimit);
    }
  };

  const goPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
      setRetries(0);
      stopRecording();
      setTimeRemaining(timeLimit);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Hirevue Practice{" "}
            <span className="text-muted-foreground font-semibold">by</span>{" "}
            <span className="text-primary">
              {user?.username === "admin" ? "CBC" : user?.username || "User"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Answer {shuffledQuestions.length || 0} questions •{" "}
            {TIME_OPTIONS.find((t) => t.value === timeLimit)?.label || "3 Minutes"} each •{" "}
            Retries up to {activeQuestion?.max_retries ?? 3}
          </p>
        </div>

        {/* Toolbar */}
        <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-2 gap-6 items-end">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full h-11 rounded-lg border border-border/60 bg-secondary/60 text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Time Limit</label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full h-11 rounded-lg border border-border/60 bg-secondary/60 text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
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
          <div className="rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow p-6 min-h-[360px] flex flex-col">
            {shuffledQuestions.length > 0 && activeQuestion ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <p className="text-muted-foreground text-sm">
                    Question{" "}
                    <span className="text-foreground font-semibold">{currentQuestionIndex + 1}</span>{" "}
                    of <span className="text-foreground font-semibold">{shuffledQuestions.length}</span>
                  </p>

                  <div className="text-xs text-muted-foreground">Practice Mode</div>
                </div>

                <div className="pt-5 flex-1">
                  <p className="text-foreground text-xl leading-relaxed">{activeQuestion.question_text}</p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/60">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goPrev}
                      disabled={currentQuestionIndex === 0}
                      className="rounded-lg transition-all active:scale-[0.98]"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goNext}
                      disabled={currentQuestionIndex === shuffledQuestions.length - 1}
                      className="rounded-lg transition-all active:scale-[0.98]"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center my-auto">No questions available.</p>
            )}
          </div>

          {/* Camera panel */}
          <div className="rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow min-h-[360px] relative overflow-hidden">
            {/* Frame */}
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

                {/* Top badges */}
                <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
                  <span className="text-xs px-3 py-1 rounded-full bg-background/60 backdrop-blur border border-border/50 text-foreground">
                    LIVE
                  </span>

                  {isRecording ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-destructive/20 border border-destructive/40 text-destructive flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                      REC
                    </span>
                  ) : null}
                </div>

                {/* Bottom controls */}
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <div className="rounded-xl border border-border/50 bg-background/55 backdrop-blur px-4 py-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-mono text-foreground">{formatTime(timeRemaining)}</div>

                    <div className="flex items-center gap-2">
                      {isRecording ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={stopRecording}
                          className="rounded-lg transition-all active:scale-[0.98]"
                        >
                          <Square className="h-4 w-4" /> Stop
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={startRecording}
                          className="rounded-lg transition-all active:scale-[0.98]"
                        >
                          <Play className="h-4 w-4" /> Start
                        </Button>
                      )}
                    </div>
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
                <Button onClick={enableCamera} className="rounded-lg transition-all active:scale-[0.98]">
                  Allow Camera Access
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LinkedIn button */}
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
