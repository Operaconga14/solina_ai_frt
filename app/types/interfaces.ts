export interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DashboardStats {
  companies: number;
  prds: number;
  pitchDecks: number;
  chatMessages: number;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export interface Company {
  id: number;
  name: string;
  description: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyForm {
  name: string;
  description: string;
  industry: string;
}

export interface PRD {
  id: number;
  title: string;
  idea: string;
  content: string;
  createdAt: string;
}

export interface PRDForm {
  title: string;
  idea: string;
}
export interface PitchDeck {
  id: number;
  title: string;
  idea: string;
  content: string;
  createdAt: string;
}

export interface DeckForm {
  title: string;
  idea: string;
}

export interface User {
  userId?: number;
  id?: number;
  email: string;
  fullName?: string;
  full_name?: string;
  company_id?: number | null;
  created_at?: string;
  hashed_password?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
