import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FaHouse } from "react-icons/fa6";
import {
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
  BiFolderPlus,
} from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";

import { getTemplateDetails } from "../api";
import { MainSpinner } from "../components";
import { TemplateDesignPin } from "../components";
import { saveToCollections, saveToFavourites } from "../api";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();
  const { data, isLoading, isError, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();

  const {
    data: templates,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplates();

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg font-semibold text-txtPrimary">
          Error occured while fetching the data. Please try again
        </p>
      </div>
    );
  }

  const addToCollections = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templatesRefetch();
    refetch();
  };

  return (
    <div className="w-full flex flex-col items-center justify-start px-4 py-12">
      {/*Bread crump*/}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/*Design main section*/}

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 ">
        {/*Left column */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/*Load the template image */}
          <img
            className="w-full object-contain rounded-md h-auto"
            src={data?.imageUrl}
            alt=""
          />

          {/*The title and other data section */}

          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/*Title section */}
            <div className="w-full flex items-center justify-between">
              {/*Title */}
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {/*Number of likes */}
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>

            {/*Collection fav options */}
            {user && templates && (
              <div className="flex items-center justify-center gap-3">
                {user?.collections?.includes(data?._id) ? (
                  <>
                    <div
                      className=" flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToCollections}
                    >
                      <BiSolidFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove from collections
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className=" flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToCollections}
                    >
                      <BiFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add to collections
                      </p>
                    </div>
                  </>
                )}

                {data?.favourites?.includes(user?.uid) ? (
                  <>
                    <div
                      className=" flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToFavourites}
                    >
                      <BiSolidHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove from favourites
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className=" flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToFavourites}
                    >
                      <BiHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add to favourites
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/*Right column */}
        <div className="col-span-1 lg:col-span-4 flex flex-col items-center justify-start px-3 gap-6">
          {/*Discover more option */}
          <div
            className="w-full h-72 bg-blue-300 overflow-hidden rounded-md relative"
            style={{
              background: "url()",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-2 py-2 rounded-md border-2 border-gray-50 text-white"
              >
                Discover more
              </Link>
            </div>
          </div>

          {/* Edit the template section*/}
          {user && (
            <Link
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500"
              to={`/resume/${data?.name}?templateID=${templateID}`}
            >
              <p className="text-white font-semibold text-lg">
                Edit this template
              </p>
            </Link>
          )}

          {/*Tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            {data?.tags?.map((tag, index) => (
              <p
                className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                key={index}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/*Suggested templates */}

      {templates?.filter((temp) => temp._id !== data?._id)?.length > 0 && (
        <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-txtDark">
            You may also like
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <>
              <AnimatePresence>
                {templates
                  ?.filter((temp) => temp._id !== data?._id)
                  .map((template, index) => (
                    <TemplateDesignPin
                      key={template?._id}
                      data={template}
                      index={index}
                    />
                  ))}
              </AnimatePresence>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesignPinDetails;
