import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import ListLogo from "@/components/section/ListLogoSection";
import EventListSection from "@/components/section/EventListSection";
import { useAuth } from "@/utils/userContext";
import ReferralSection from "@/components/section/ReferralSection";
import Header from "@/components/Header";

function Home() {
  const { user, isLogin } = useAuth();
  console.log("Init", user);

  return (
    <>
      <NavigationBar
        isLogin={isLogin}
        userRole="user"
        point={user?.points}
        name={user?.name}
      />
      <Header>
        <title>Home | Find latest tech event</title>
        <meta
          name="description"
          content="Find the latest tech events and stay updated on the hottest conferences, workshops, and exhibitions. Discover exciting opportunities to learn, network, and innovate."
        />
      </Header>

      <section
        id="heroSection"
        className="customBgImage bg-indigo-600 px-4 py-16 lg:min-h-[400px] flex flex-col justify-center"
      >
        <div className="max-w-screen-xl mx-auto text-center ">
          <h1 className="text-3xl text-white font-bold mb-4 lg:text-5xl lg:max-w-[500px] lg:mx-auto">
            LEVEL UP YOUR TECH MIND HERE
          </h1>
          <p className="text-white">
            A place where you find a tech related confrences
          </p>
        </div>
      </section>
      {user?.referral_use === null ? <ReferralSection /> : ""}
      <ListLogo />
      <EventListSection />
    </>
  );
}

export default Home;
