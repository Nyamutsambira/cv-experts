import React, { useEffect } from "react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { MainSpinner, TemplateDesignPin } from "../components";
import { NoData } from "../assets";
import { getSavedResumes } from "../api";

const UserProfile = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState("collections");
  const {
    data: templatesData,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch,
  } = useTemplates();

  const { data: savedResumes } = useQuery(["savedResumes"], () => getSavedResumes(user?.uid));


  if(templatesIsLoading) return <MainSpinner/>

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72 bg-blue-50">
        <img src="" alt="" className="w-full h-full object-cover" />

        <div className="w-full flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <>
              <img
                src={data?.photoURL}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover -mt-12 border-2 border-white"
                loading="lazy"
              />
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full -mt-12 border-2 border-white cursor-pointer flex items-center justify-center bg-rose-600 ">
                <p className="text-white text-lg">
                  {data?.displayName.charAt(0)}
                </p>
              </div>
            </>
          )}
          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center mt-12">
        <div
          className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
          onClick={() => setActiveTab("collections")}
        >
          <p
            className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
              activeTab === "collections" && "bg-white text-blue-600 shadow-md"
            }`}
          >
            My Collections
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
          onClick={() => setActiveTab("resumes")}
        >
          <p
            className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
              activeTab === "resumes" && "bg-white text-blue-600 shadow-md"
            }`}
          >
            My Resumes
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
        <AnimatePresence>
          {activeTab === "collections" && (
            <>
              {user?.collections && user?.collections.length > 0 ? (
                <RenderATemplate
                  templates={templatesData?.filter((temp) =>
                    user?.collections?.includes(temp?._id)
                  )}
                />
              ) : (
                <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                  <img
                    src={NoData}
                    alt=""
                    className="w-32 h-auto object-contain"
                  />
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RenderATemplate = ({ templates }) => {
  return (
    <>
      {templates && templates.length > 0 && (
        <>
          <AnimatePresence>
            <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
              {templates &&
                templates.map((template, index) => (
                  <TemplateDesignPin
                    key={template?._id}
                    data={template}
                    index={index}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default UserProfile;
