import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, color, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import {
  HiLogout,
  HiBookOpen,
  HiOutlineFolder,
  HiTemplate,
} from "react-icons/hi";
import { fadeInOutWithOpacity, slideMenuUpDown } from "../animations";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utils/helpers";
import useFilters from "../hooks/useFilters";

const Header = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);
  const { data: filterData } = useFilters();

  const signOutUSer = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueriesData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    const previousState = queryClient.getQueryData("globalFilter");
    const currentState = { ...previousState, searchTerm: e.target.value };
    queryClient.setQueryData("globalFilter", currentState);
  };

  const clearFilter = () => {
    const previousState = queryClient.getQueryData("globalFilter");
    const currentState = { ...previousState, searchTerm: "" };
    queryClient.setQueryData("globalFilter", currentState);
  };

  return (
    <div
      className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-100
    sticky  gap-12  top-0 header"
    >
      <Link to={"/"}>
        <img className="w-6 h-auto object-contain" src={Logo} alt="" />
      </Link>

      <div className="flex-1 border border-gray-100 rounded-md px-4 py-1 flex items-center justify-between bg-gray-100 ">
        <input
          type="text"
          value={filterData?.searchTerm ? filterData?.searchTerm : ""}
          placeholder="Search here..."
          className="flex-1 h-10 bg-transparent text-base outline-none border-none focus-within:text-black"
          onChange={handleSearchTerm}
        />

        <AnimatePresence>
          {filterData?.searchTerm.length > 0 && (
            <motion.div
              onClick={clearFilter}
              {...fadeInOutWithOpacity}
              className="h-8 w-8 flex flex-col items-center justify-center bg-gray-200 rounded-md cursor-pointer active:scale-95 duration-150"
            >
              <p className=" text-2xl mb-1 text-red-700">x</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile section */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="blue" size={40} />
        ) : (
          <>
            {/*  */}

            {data ? (
              <motion.div
                {...fadeInOutWithOpacity}
                className="relative"
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer">
                    <img
                      src={data?.photoURL}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center bg-rose-600 ">
                    <p className="text-white text-lg">
                      {data?.displayName.charAt(0)}
                    </p>
                  </div>
                )}
                {/* Drop down menu */}

                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...slideMenuUpDown}
                      className="absolute bg-gray-100 px-0 py-2 rounded-md right-0 top-12 flex flex-col 
                    justify-start items-center gap-2 w-60 pt-10"
                    >
                      {data?.photoURL ? (
                        <div className="w-12 h-12 rounded-full flex flex-col items-center cursor-pointer justify-center">
                          <img
                            src={data?.photoURL}
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center cursor-pointer justify-center bg-rose-600 ">
                          <p className="text-white text-xl">
                            {data?.displayName.charAt(0)}
                          </p>
                        </div>
                      )}

                      {data?.displayName && (
                        <p className="text-txtDark text-base w-full text-center whitespace-nowrap font-semibold">
                          {data?.displayName}
                        </p>
                      )}

                      <div className="pt-1 gap-3 flex flex-col items-start w-full">
                        <Link
                          className="w-full text-txtDark hover:bg-gray-200  whitespace-nowrap 
                      flex flex-1 justify-between accountMenu px-2 py-1 items-center"
                          to={`/profile/${data?.uid}`}
                        >
                          <p className="text-txtDark   accountMenu flex-1">
                            My Account
                          </p>
                          <HiOutlineFolder className="text-txtDark " />
                        </Link>

                        {adminIds.includes(data?.uid) && (
                          <Link
                            className="w-full text-txtDark  hover:bg-gray-200  
                          whitespace-nowrap accountMenu flex flex-1 px-2 py-1 justify-between items-center"
                            to={"/template/create"}
                          >
                            <p className="text-txtDark   accountMenu flex-1">
                              Add Templates
                            </p>
                            <HiTemplate
                              className="text-txtDark "
                              color="#222"
                            />
                          </Link>
                        )}

                        <div
                          className="w-full px-2 border-t border-gray-300 flex items-center 
                      justify-between group cursor-pointer hover:bg-gray-200 py-1"
                          onClick={signOutUSer}
                        >
                          <p className="text-txtDark   accountMenu flex-1">
                            Sign Out
                          </p>
                          <HiLogout
                            className="text-txtDark "
                            color="rgb(200,96,10)"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link
                to={"/auth"}
                className="w-20 h-12 rounded-md bg-blue-600 flex items-center hover:bg-gray-200 active:scale-95 duration-150 hover:shadow-md"
              >
                <motion.button
                  {...fadeInOutWithOpacity}
                  className="text-white text-center flex-1 text-lg"
                  type="button"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
