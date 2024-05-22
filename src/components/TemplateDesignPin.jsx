import React from "react";
import { AnimatePresence, motion, easeInOut, delay } from "framer-motion";
import { fadeInOutWithOpacity, scaleInOut } from "../animations";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import { useState } from "react";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { saveToCollections, saveToFavourites } from "../api";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, key, index }) => {
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: templatesRefetch } = useTemplates();
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const addToCollections = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templatesRefetch();
  };

  const handleRouteNavigation = () => {
    navigate(`/resume-detail/${data?._id}`, { replace: true });
  };

  return (
    <motion.div key={key} {...scaleInOut(index)}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full h-[410px] 2xl:h-[650px] rounded-md bg-gray-200 overflow-hidden relative"
      >
        <img
          src={data?.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-[rgb(0,0,0,0.4)] flex flex-col items-center justify-start px-4, py-3 z-50 cursor-pointer"
              {...fadeInOutWithOpacity}
              onClick={handleRouteNavigation}
            >
              <div className="w-full flex flex-col items-end justify-start gap-8">
                <InnerBoxCard
                  label={
                    user?.collections?.includes(data?._id)
                      ? "Added to collections"
                      : "Add to collections"
                  }
                  Icon={
                    user?.collections?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  onHandle={addToCollections}
                />
                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Added to favourites"
                      : "Add to favourites"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFavourites}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md flex items-center justify-center hover:shadow-md relative bg-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="text-txtPrimary text-base" />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 bg-gray-200 rounded-md absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
