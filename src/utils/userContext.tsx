import { useContext, createContext, useState } from "react";
import { LoginAuth, UserProps } from "@/models/models";
import { AuthHandler } from "./authValidation";

// Define the interface
interface UserProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  user: UserProps | null;
  isLogin: boolean;
  isLoading: boolean;
  userLogin: (userData: UserProps | null) => void;
  userLogout: (token: string) => void;
  updateUserPoint: (referralCode: string) => void;
  decreseUserPoint: (point: number) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create Context and define the default value
const AuthContext = createContext<AuthContextProps>({
  isLogin: false,
  isLoading: false,
  user: null,
  setLoading: () => {},
  userLogin: () => {},
  userLogout: () => {},
  updateUserPoint: () => {},
  decreseUserPoint: () => {},
});

export function AuthProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authHandler = new AuthHandler();

  function userLogin(userData: UserProps | null) {
    if (userData) {
      setUser(userData);
      setIsLogin(true);
    } else {
      setUser(null);
      setIsLogin(false);
    }
  }

  function userLogout(token: string) {
    authHandler.handleUserLogout(token);
    setUser(null);
    setIsLogin(false);
  }

  function updateUserPoint(referralCode: string) {
    // update state point of the user
    if (user) {
      setUser({
        ...user,
        referral_use: referralCode,
        points: user.points + 20000,
      });
    }
  }

  function decreseUserPoint(point: number) {
    if (user) {
      setUser({
        ...user,
        points: user.points - point,
      });
    }
  }
  function setLoading(loadingState: boolean) {
    setIsLoading(loadingState);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogin,
        userLogin,
        userLogout,
        isLoading,
        updateUserPoint,
        decreseUserPoint,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
