import React, { Suspense } from "react";
import { Header, MainSpinner } from "../components";
import { Route, Routes } from "react-router-dom";
import { HomeContainer } from "../containers";
import {
  CreateResume,
  CreateTemplate,
  TemplateDesignPinDetails,
  UserProfile,
} from "../pages";

const HomeScreen = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/*Header */}
      <Header />

      {/*Main section */}
      <main className="w-full">
        {/*Custom routes */}

        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate />} />
            <Route path="/profile/:uid" element={<UserProfile />} />
            <Route path="/resume/*" element={<CreateResume />} />
            <Route
              path="/resume-detail/:templateID"
              element={<TemplateDesignPinDetails />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default HomeScreen;
