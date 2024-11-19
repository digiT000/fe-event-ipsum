import Link from "next/link";
import { use, useState } from "react";

interface UserMenu {
  referralCode: string;
  limitUse: number;
  used: number;
  userLogout: (scope: "user" | "admin") => void;
}

function UserMenu({ referralCode, limitUse, used, userLogout }: UserMenu) {
  const [hideMenu] = useState<boolean>(true);

  return !hideMenu ? (
    <></>
  ) : (
    <div className="bg-white p-4 absolute right-0 top-0 min-w-64 shadow-lg rounded-md">
      <ul className="flex flex-col gap-2">
        <li className="p-2 rounded-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Your Referral Code
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            share it to your friends & get points
          </p>
          <div className="rounded-sm p-3 bg-indigo-950">
            <h2 className="font-bold mb-1 text-white">{referralCode}</h2>
            <p className="text-sm text-white text-opacity-90 ">
              Already use : {used}/{limitUse}
            </p>
          </div>
        </li>
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
