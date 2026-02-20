import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  companies as defaultCompanies,
  questions as defaultQuestions,
  type Company,
  type Question,
} from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";

const LS_SESSION_COMPANY_KEY = "cbc_session_company_id";
const LS_SESSION_QUESTIONS_KEY = "cbc_session_questions";

const Admin = () => {
  const [localCompanies, setLocalCompanies] = useState<Company[]>(defaultCompanies);
  const [localQuestions, setLocalQuestions] = useState<Question[]>(defaultQuestions);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");

  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const coreCompanyIds = new Set(defaultCompanies.map((c) => c.id));

  // Safe localStorage state
  const [sessionCompanyId, setSessionCompanyId] = useState<string | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const companyId = localStorage.getItem(LS_SESSION_COMPANY_KEY);
    const raw = localStorage.getItem(LS_SESSION_QUESTIONS_KEY);

    setSessionCompanyId(companyId);
    setSessionQuestions(raw ? (JSON.parse(raw) as Question[]) : []);
  }, []);

  const getQuestionsForCompany = (companyId: string) => {
    if (sessionCompanyId === companyId) return sessionQuestions;
    return localQuestions.filter((q) => q.company_id === companyId);
  };

  const addCompanyWithQuestions = () => {
    if (!newCompanyName.trim()) return;

    const id = String(Math.max(...localCompanies.map((c) => Number(c.id)), 0) + 1);
    setLocalCompanies([...localCompanies, { id, name: newCompanyName.trim() }]);

    if (newQuestionText.trim()) {
      const texts = newQuestionText
        .split(/[,\n]/)
        .map((t) => t.trim())
        .filter(Boolean);

      const maxId = Math.max(...localQuestions.map((q) => Number(q.id) || 0), 0);

      const newQs: Question[] = texts.map((text, i) => ({
        id: String(maxId + i + 1),
        company_id: id,
        question_text: text,
        time_limit: 180,
        max_retries: 3,
      }));

      setLocalQuestions([...localQuestions, ...newQs]);
    }

    setNewCompanyName("");
    setNewQuestionText("");
  };

  const startEdit = (q: Question) => {
    setEditingQuestion(q.id);
    setEditText(q.question_text);
  };

  const saveEdit = (questionId: string) => {
    const isSession = sessionCompanyId === expandedCompany;

    if (isSession) {
      const next = sessionQuestions.map((q) =>
        q.id === questionId ? { ...q, question_text: editText } : q
      );
      setSessionQuestions(next);
      localStorage.setItem(LS_SESSION_QUESTIONS_KEY, JSON.stringify(next));
    } else {
      setLocalQuestions(
        localQuestions.map((q) =>
          q.id === questionId ? { ...q, question_text: editText } : q
        )
      );
    }

    setEditingQuestion(null);
    setEditText("");
  };

  const deleteQuestion = (questionId: string) => {
    const isSession = sessionCompanyId === expandedCompany;

    if (isSession) {
      const next = sessionQuestions.filter((q) => q.id !== questionId);
      setSessionQuestions(next);
      localStorage.setItem(LS_SESSION_QUESTIONS_KEY, JSON.stringify(next));
      return;
    }

    const q = localQuestions.find((x) => x.id === questionId);
    if (!q) return;

    const companyId = q.company_id;
    const nextQuestions = localQuestions.filter((x) => x.id !== questionId);
    setLocalQuestions(nextQuestions);

    const stillHasQuestions = nextQuestions.some((x) => x.company_id === companyId);

    if (!coreCompanyIds.has(companyId) && !stillHasQuestions) {
      setLocalCompanies((prev) => prev.filter((c) => c.id !== companyId));
      setExpandedCompany((prev) => (prev === companyId ? null : prev));
    }
  };

  const toggleCompany = (id: string) => {
    setExpandedCompany(expandedCompany === id ? null : id);

    const currentSessionCompanyId = localStorage.getItem(LS_SESSION_COMPANY_KEY);
    const raw = localStorage.getItem(LS_SESSION_QUESTIONS_KEY);

    setSessionCompanyId(currentSessionCompanyId);
    setSessionQuestions(raw ? (JSON.parse(raw) as Question[]) : []);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">Question Management</h1>

        <div className="flex gap-3 mb-8 items-stretch">
          <Input
            placeholder="Company name"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className="bg-secondary border-border max-w-[240px]"
          />
          <Textarea
            placeholder="Enter questions (separate by commas or new lines)"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            className="bg-secondary border-border min-h-[40px] h-10 flex-1"
          />
          <Button
            onClick={addCompanyWithQuestions}
            className="bg-primary text-primary-foreground whitespace-nowrap px-6"
          >
            Add Questions
          </Button>
        </div>

        <div className="space-y-3">
          {localCompanies.map((company) => {
            const companyQuestions = getQuestionsForCompany(company.id);
            const isExpanded = expandedCompany === company.id;

            return (
              <div key={company.id} className="rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleCompany(company.id)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-foreground font-semibold text-base">
                    {company.name}
                    {sessionCompanyId === company.id ? (
                      <span className="ml-2 text-xs text-primary">(Active)</span>
                    ) : null}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      {companyQuestions.length} questions
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {companyQuestions.length === 0 ? (
                      <div className="px-5 py-6 text-sm text-muted-foreground">
                        No questions for this company yet.
                      </div>
                    ) : (
                      companyQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="px-5 py-3 border-b border-border last:border-b-0 flex items-start gap-3 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex gap-1 pt-0.5 shrink-0">
                            {editingQuestion === q.id ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => saveEdit(q.id)}
                              >
                                <span className="text-xs text-primary">✓</span>
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => startEdit(q)}
                              >
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteQuestion(q.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>

                          {editingQuestion === q.id ? (
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="bg-secondary border-border text-sm flex-1"
                              onKeyDown={(e) => e.key === "Enter" && saveEdit(q.id)}
                              autoFocus
                            />
                          ) : (
                            <p className="text-foreground text-sm leading-relaxed flex-1">
                              {q.question_text}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Admin;