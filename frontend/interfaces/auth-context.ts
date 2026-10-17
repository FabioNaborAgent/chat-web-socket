interface AuthContextType {
  token: string | null;
  chatId: string | null;
  isAuthenticated: boolean;
  login: (token: string, chatId: string) => void;
  logout: () => void;
}