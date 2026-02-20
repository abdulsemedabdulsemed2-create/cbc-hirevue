export interface Company {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  company_id: string;
  question_text: string;
  time_limit: number;
  max_retries: number;
}

// Generic question pool - used as fallback for companies without specific questions
export const genericQuestions: string[] = [
  "Tell me about yourself and why you're interested in this role.",
  "What motivates you to work in finance?",
  "Describe a time you worked under pressure and delivered results.",
  "How do you stay current with industry trends?",
  "Tell me about a leadership experience you've had.",
  "What's a recent market event that caught your attention?",
  "How do you handle disagreements with colleagues?",
  "Describe a time you had to learn something quickly.",
  "What differentiates you from other candidates?",
  "Where do you see yourself in five years?",
  "Tell me about a time you failed and what you learned.",
  "How would you explain a complex financial concept to a non-expert?",
  "Describe your approach to risk management.",
  "What's a deal or transaction you've followed recently?",
  "How do you prioritize competing deadlines?",
  "Tell me about a time you went above and beyond.",
  "What's your understanding of our firm's culture?",
  "Describe a time you had to make a quick decision with limited data.",
  "How do you build relationships with clients or stakeholders?",
  "What book or article has recently influenced your thinking?",
];

export const companies: Company[] = [
  { id: "1", name: "Market-based Questions" },
  { id: "2", name: "Team-related Questions" },
  { id: "3", name: "News/Market-related Questions" },
  { id: "4", name: "Why Firm-related Questions" },
  { id: "5", name: "Integrity-related Questions" },
  { id: "6", name: "Adversity-related Questions" },
  { id: "7", name: "Decision-related Questions" },
  { id: "8", name: "ETC" },
  { id: "9", name: "J.P. Morgan" },
  { id: "10", name: "UBS" },
  { id: "11", name: "Prudential" },
  { id: "12", name: "Morgan Stanley" },
  { id: "13", name: "SMBC" },
  { id: "14", name: "Blackrock" },
  { id: "15", name: "Goldman Sachs" },
  { id: "16", name: "Blackstone" },
  { id: "17", name: "Citizens" },
  { id: "18", name: "Bank of America" },
  { id: "19", name: "Evercore" },
  { id: "20", name: "Wells Fargo" },
  { id: "21", name: "Citi" },
  { id: "22", name: "Columbia Threadneedle Investments" },
  { id: "23", name: "Parametric" },
  { id: "24", name: "Barclays" },
  { id: "25", name: "Principal" },
  { id: "26", name: "Cantor Fitzgerald" },
  { id: "27", name: "Hamilton Lane" },
  { id: "28", name: "Madison Energy Infrastructure" },
  { id: "29", name: "PNC" },
  { id: "30", name: "TP ICAP" },
  { id: "31", name: "Ardian" },
  { id: "32", name: "General Atlantic" },
  { id: "33", name: "Apollo" },
  { id: "34", name: "Bain" },
  { id: "35", name: "Carlyle" },
  { id: "36", name: "Silver Lake" },
  { id: "37", name: "KKR" },
  { id: "38", name: "TPG" },
  { id: "39", name: "Warburg Pincus" },
  { id: "40", name: "Nomura" },
  { id: "41", name: "Deutsche Bank" },
  { id: "42", name: "Bernstein" },
  { id: "43", name: "DLP Capital" },
  { id: "44", name: "U.S. Bank" },
  { id: "45", name: "Shell" },
  { id: "46", name: "Raymond James" },
];

export const questions: Question[] = [
  // J.P. Morgan
  { id: "1", company_id: "9", question_text: "Tell us about a time when you had to simplify and communicate large amounts of information to a few key points.", time_limit: 180, max_retries: 3 },
  { id: "2", company_id: "9", question_text: "Please discuss an important written document you were required to complete.", time_limit: 180, max_retries: 3 },
  { id: "3", company_id: "9", question_text: "What is one company you would lend to and why?", time_limit: 180, max_retries: 3 },
  { id: "4", company_id: "9", question_text: "Give me an example of a time when you motivated others.", time_limit: 180, max_retries: 3 },
  { id: "5", company_id: "9", question_text: "Describe a situation in which you were able to use persuasion to successfully convince someone to see things your way.", time_limit: 180, max_retries: 3 },
  { id: "6", company_id: "9", question_text: "Give me an example of a time when something you tried to accomplish and failed.", time_limit: 180, max_retries: 3 },
  { id: "7", company_id: "9", question_text: "Tell me about a time when you delegated a project effectively.", time_limit: 180, max_retries: 3 },
  // Market-based
  { id: "100", company_id: "1", question_text: "What are the current trends in the financial markets that you find most interesting?", time_limit: 180, max_retries: 3 },
  { id: "101", company_id: "1", question_text: "How would you analyze a company's stock performance over the past year?", time_limit: 180, max_retries: 3 },
  { id: "102", company_id: "1", question_text: "What factors would you consider when evaluating an investment opportunity?", time_limit: 180, max_retries: 3 },
  { id: "103", company_id: "1", question_text: "Explore the origin and meaning of the term 'credit crunch' in financial contexts.", time_limit: 180, max_retries: 3 },
  { id: "104", company_id: "1", question_text: "Define deflation, discuss some of its causes, and explain its impacts.", time_limit: 180, max_retries: 3 },
  { id: "105", company_id: "1", question_text: "How would you assess the current state of the IPO market and what do you anticipate for its future trajectory?", time_limit: 180, max_retries: 3 },
  { id: "106", company_id: "1", question_text: "What are your predictions for the direction of the commodities, rates, and equities markets? What factors influence your outlook?", time_limit: 180, max_retries: 3 },
  // Team-related
  { id: "200", company_id: "2", question_text: "Tell me about a time you worked effectively in a team to achieve a goal.", time_limit: 180, max_retries: 3 },
  { id: "201", company_id: "2", question_text: "How do you handle conflicts within a team?", time_limit: 180, max_retries: 3 },
  { id: "202", company_id: "2", question_text: "Describe a situation where you had to lead a team through a challenging project.", time_limit: 180, max_retries: 3 },
  // News/Market
  { id: "300", company_id: "3", question_text: "What recent news event do you think will have the biggest impact on the financial markets?", time_limit: 180, max_retries: 3 },
  { id: "301", company_id: "3", question_text: "How do geopolitical events affect investment strategies?", time_limit: 180, max_retries: 3 },
  { id: "302", company_id: "3", question_text: "Is the current economic situation a global issue? Which economies have been most significantly affected?", time_limit: 180, max_retries: 3 },
  { id: "303", company_id: "3", question_text: "What measures are the governments of the US, EUR, and UK implementing to address the current market crisis?", time_limit: 180, max_retries: 3 },
  // Why Firm
  { id: "400", company_id: "4", question_text: "Why do you want to work at this firm specifically?", time_limit: 180, max_retries: 3 },
  { id: "401", company_id: "4", question_text: "What differentiates this firm from its competitors in your view?", time_limit: 180, max_retries: 3 },
  { id: "402", company_id: "4", question_text: "What aspects of this firm's culture resonate with you the most?", time_limit: 180, max_retries: 3 },
  // Integrity
  { id: "500", company_id: "5", question_text: "Describe a time when you had to make an ethical decision in a professional setting.", time_limit: 180, max_retries: 3 },
  { id: "501", company_id: "5", question_text: "How do you handle situations where you disagree with your manager's decision?", time_limit: 180, max_retries: 3 },
  { id: "502", company_id: "5", question_text: "Tell me about a time you witnessed something unethical. What did you do?", time_limit: 180, max_retries: 3 },
  // Adversity
  { id: "600", company_id: "6", question_text: "Tell me about the biggest challenge you've faced and how you overcame it.", time_limit: 180, max_retries: 3 },
  { id: "601", company_id: "6", question_text: "Describe a time when you had to adapt to a significant change.", time_limit: 180, max_retries: 3 },
  { id: "602", company_id: "6", question_text: "Tell me about a setback that taught you an important lesson.", time_limit: 180, max_retries: 3 },
  // Decision
  { id: "700", company_id: "7", question_text: "Tell me about a difficult decision you had to make with limited information.", time_limit: 180, max_retries: 3 },
  { id: "701", company_id: "7", question_text: "How do you prioritize when you have multiple urgent tasks?", time_limit: 180, max_retries: 3 },
  { id: "702", company_id: "7", question_text: "Describe a decision you made that was unpopular but turned out to be correct.", time_limit: 180, max_retries: 3 },
  // ETC
  { id: "800", company_id: "8", question_text: "Where do you see yourself in 5 years?", time_limit: 180, max_retries: 3 },
  { id: "801", company_id: "8", question_text: "What is your greatest strength and how does it apply to this role?", time_limit: 180, max_retries: 3 },
  { id: "802", company_id: "8", question_text: "What motivates you to succeed in this industry?", time_limit: 180, max_retries: 3 },
  // UBS
  { id: "1000", company_id: "10", question_text: "Why UBS? What attracts you to our wealth management platform?", time_limit: 180, max_retries: 3 },
  { id: "1001", company_id: "10", question_text: "How would you explain a complex financial product to a client?", time_limit: 180, max_retries: 3 },
  { id: "1002", company_id: "10", question_text: "Tell us about a time you provided exceptional client service.", time_limit: 180, max_retries: 3 },
  // Morgan Stanley
  { id: "1200", company_id: "12", question_text: "What do you know about Morgan Stanley's business segments?", time_limit: 180, max_retries: 3 },
  { id: "1201", company_id: "12", question_text: "Tell us about a time you demonstrated leadership in a high-pressure environment.", time_limit: 180, max_retries: 3 },
  { id: "1202", company_id: "12", question_text: "How would you contribute to Morgan Stanley's culture of excellence?", time_limit: 180, max_retries: 3 },
  // Goldman Sachs
  { id: "1500", company_id: "15", question_text: "Why Goldman Sachs? What aligns with your career goals?", time_limit: 180, max_retries: 3 },
  { id: "1501", company_id: "15", question_text: "Describe a time when you went above and beyond to deliver results.", time_limit: 180, max_retries: 3 },
  { id: "1502", company_id: "15", question_text: "How do you approach solving complex problems under time constraints?", time_limit: 180, max_retries: 3 },
  // Bank of America
  { id: "1800", company_id: "18", question_text: "What interests you about Bank of America's approach to responsible growth?", time_limit: 180, max_retries: 3 },
  { id: "1801", company_id: "18", question_text: "How do you stay current with financial industry developments?", time_limit: 180, max_retries: 3 },
  { id: "1802", company_id: "18", question_text: "Describe a time when teamwork led to a successful outcome.", time_limit: 180, max_retries: 3 },
  // Citi
  { id: "2100", company_id: "21", question_text: "What do you know about Citi's global footprint?", time_limit: 180, max_retries: 3 },
  { id: "2101", company_id: "21", question_text: "Describe your approach to managing multiple stakeholders.", time_limit: 180, max_retries: 3 },
  { id: "2102", company_id: "21", question_text: "How would you handle a difficult client situation?", time_limit: 180, max_retries: 3 },
];

// Helper: get questions for a company, falling back to generic questions if none exist
export function getQuestionsForCompany(companyId: string, allQuestions: Question[]): Question[] {
  const specific = allQuestions.filter((q) => q.company_id === companyId);
  if (specific.length > 0) return specific;
  // Generate from generic pool
  return genericQuestions.map((text, i) => ({
    id: `gen-${companyId}-${i}`,
    company_id: companyId,
    question_text: text,
    time_limit: 180,
    max_retries: 3,
  }));
}

// Fisher-Yates shuffle
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
