import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomeScreen, Authentication } from "../pages";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/*" element={<HomeScreen />} />
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </Suspense>
      <ToastContainer
        theme="dark"
        closeOnClick
        pauseOnHover
        position="top-right"
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
