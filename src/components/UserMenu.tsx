import Link from "next/link";
import { useState } from "react";

interface UserMenu {
  userLogout: (scope: "user" | "admin") => void;
}

function UserMenu({ userLogout }: UserMenu) {
  const [hideMenu, setHideMenu] = useState<boolean>(true);

  return !hideMenu ? (
    <></>
  ) : (
    <div className="bg-white p-4 absolute right-0 top-0 min-w-60 shadow-lg rounded-md">
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href="/user/transaction-history"
            className="text-left p-2 text-gray-950 inline-block rounded-md w-full hover:bg-gray-100 "
          >
            My Bookings
          </Link>
        </li>
        <li>
          <button
            onClick={() => userLogout("user")}
            className="rounded-md text-left p-2 text-gray-950  hover:bg-gray-100 w-full"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default UserMenu;
