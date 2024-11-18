import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/utils/userContext";
import { AuthHandler } from "@/utils/authValidation";
import { formatNumber } from "@/utils/formatter/formatNumber";
import UserMenu from "./UserMenu";
import NavLink from "./NavLink";
import Overlay from "./Overlay";

interface NavigationBarProps {
  isLogin: boolean;
  userRole: "admin" | "user";
  name?: string;
  point?: number;
}

function NavigationBar({
  isLogin,
  point,
  name,
  userRole = "user",
}: NavigationBarProps) {
  const { user, userLogin, userLogout, isLoading, setLoading } = useAuth();
  const uniqueCode = userRole === "user" ? "ussr" : "ussad";
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const authHandler = new AuthHandler();
  let formattedNumber: string = "0";
  if (point) {
    formattedNumber = formatNumber(point);
  }
  // Add logout functionality here using userLogout hook
  function handleLogout(scope: "user" | "admin") {
    setShowOverlay(true);
    const token = Cookies.get(`access${uniqueCode}_token`);
    userLogout(token as string);
    Cookies.remove(`access${uniqueCode}_token`);
    Cookies.remove(`refresh${uniqueCode}_token`);
    if (scope === "user") {
      window.location.href = "/"; // Replace '/' with your desired URL
    } else if (scope === "admin") {
      window.location.href = "/admin/auth";
    }
  }

  // Fetch data user based on access token
  async function handleFethingUserData(userToken: string): Promise<void> {
    try {
      setLoading(true);
      const response = await authHandler.validateUserToken(userToken);
      console.log("New data user (data)", response);

      // Check if the response true
      response ? userLogin(response) : userLogin(null);
      setLoading(false);
    } catch (error) {
      console.log("Error validating token after refresh", error);
    }
  }

  // Refersh user token
  async function refreshUserAcessToken(refreshToken: string): Promise<void> {
    try {
      setLoading(true);
      const response = await authHandler.refreshUserAcessToken(refreshToken);

      // Check if the response true
      response ? userLogin(response) : userLogin(null);
      setLoading(false);
    } catch (error) {
      console.log("Error refreshing token", error);
    }
  }

  // Can be improved to meet DRY concept
  useEffect(() => {
    console.log(userRole);

    const userToken = Cookies.get(`access${uniqueCode}_token`);
    const refreshToken = Cookies.get(`refresh${uniqueCode}_token`);

    // Check if the data user already available
    if (!user) {
      console.log("exec");
      // Check if the user already has a refresh token
      if (refreshToken) {
        // Check the availability of the access token
        userToken
          ? handleFethingUserData(userToken)
          : refreshUserAcessToken(refreshToken);
      } else {
        setLoading(false);

        // Do nothing
      }
      // Do nothing
    } else {
      setLoading(false);
    }
  }, []);
  const loginState = (
    <div className="flex gap-5">
      <div className="p-2 bg-[#f8f7f7] rounded-md flex gap-2 items-center">
        <Image
          width={64}
          height={64}
          className="w-6 h-6"
          alt="coin"
          src="/icon/coin.svg"
        />
        <p className="text-sm font-semibold sm:text-base">{formattedNumber}</p>
      </div>
      <button
        className="cursor-pointer p-2 bg-[#f8f7f7] rounded-md flex gap-2 items-center hover:bg-zinc-100"
        onClick={() => {
          setShowMenu(!showMenu);
          console.log("click");
        }}
      >
        <Image
          width={64}
          height={64}
          className="w-5 h-5  sm:w-6 sm:h-6"
          alt="coin"
          src="/icon/user.svg"
        />
        <p className="hidden font-semibold sm:inline-block">{name}</p>
        <Image
          width={64}
          height={64}
          className={`w-6 h-6 ease-in-out transition-transform duration-200 ${showMenu ? "rotate-180" : "rotate-0"}`}
          alt="coin"
          src="/icon/dropdown.svg"
        />
      </button>
    </div>
  );
  const loadingState = (
    <div className="flex gap-5 ">
      <div className="w-20 h-10 bg-zinc-300 rounded-md animate-pulse"></div>
      <div className="w-20 h-10 bg-zinc-300 rounded-md animate-pulse"></div>
    </div>
  );

  switch (userRole) {
    case "user":
      return (
        <>
          {showOverlay ? <Overlay /> : ""}
          <header className="p-3 bg-transparent">
            <div className="max-w-screen-xl mx-auto w-full flex justify-between items-center">
              <Link href="/">
                <Image
                  src="/mainLogo.png"
                  width={668}
                  height={164}
                  //layout="responsive"
                  alt="main-logo"
                  className="w-28 sm:w-36"
                />
              </Link>

              {isLoading ? (
                loadingState
              ) : isLogin ? (
                loginState
              ) : (
                <nav className="flex gap-3">
                  <Button
                    width="w-fit"
                    href="http://localhost:3000/auth/login"
                    isButton={false}
                    isButtonDisable={false}
                    type="primary-border"
                    text="
              LOGIN"
                  />
                  <Button
                    width="w-fit"
                    isButton={false}
                    href="http://localhost:3000/auth/register"
                    isButtonDisable={false}
                    type="primary"
                    text="
              REGISTER"
                  />
                </nav>
              )}
            </div>
          </header>
          <div className="max-w-screen-xl mx-auto relative h-1 px-4">
            {showMenu && <UserMenu userLogout={handleLogout} />}
          </div>
        </>
      );

    case "admin":
      return (
        <>
          {showOverlay ? <Overlay /> : ""}
          <header className="p-3 bg-transparent">
            <div className="max-w-screen-xl mx-auto w-full flex justify-between items-center">
              <Link href="/">
                <Image
                  src="/mainLogo.png"
                  width={668}
                  height={164}
                  //layout="responsive"
                  alt="main-logo"
                  className="w-36"
                />
              </Link>
              <nav>
                <ul className="flex gap-3">
                  <li>
                    <NavLink href="/admin/dashboard">Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/list-events">List Events</NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/list-users">List Users</NavLink>
                  </li>
                </ul>
              </nav>
              <Button
                isButton={true}
                text="Logout"
                type="primary"
                width="w-fit"
                onClick={() => handleLogout("admin")}
              />
            </div>
          </header>
        </>
      );
  }
}

export default NavigationBar;
