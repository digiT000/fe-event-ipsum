import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthHandler } from "./authValidation";

function useAuthLogic(authHandler: any, userLogin: any) {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const userToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    const handleRefreshToken = async (userToken: string) => {
      try {
        const response = await authHandler.validateUserToken(userToken);
        if (response) {
          setUser(response.data.data);
          setIsLogin(true);
          userLogin(response); // Update user state in context/store if needed
        }
      } catch (error) {}
    };

    const refreshUserAcessToken = async (refreshToken: string) => {
      try {
        const response = await authHandler.refreshUserAcessToken(refreshToken);
        if (response) {
          setUser(response.data.data);
          setIsLogin(true);
          userLogin(response); // Update user state in context/store if needed
        } else {
          setUser(null);
          setIsLogin(false);
          userLogin(null); // Update user state in context/store if needed
        }
      } catch (error) {}
    };

    if (!user) {
      if (refreshToken) {
        if (userToken) {
          handleRefreshToken(userToken);
        } else {
          console.log("Refresh Token got exec");
          refreshUserAcessToken(refreshToken);
        }
      }
    }
  }, []);

  return { user, isLogin };
}

export default useAuthLogic;
