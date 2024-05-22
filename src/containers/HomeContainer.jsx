import React from "react";
import { Filters, MainSpinner, TemplateDesignPin } from "../components";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence, motion } from "framer-motion";

const HomeContainer = () => {
  const {
    data: templatesData,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch,
  } = useTemplates();

  if (templatesIsLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-6 flex items-center justify-start flex-col">
      {/*Filter section */}
      <Filters />

      {/*Render the templates - Resume Pins */}

      {templatesIsError ? (
        <>
          <p>Something went wrong. Try again later...</p>
        </>
      ) : (
        <>
          <div>
            <RenderATemplate templates={templatesData} />
          </div>
        </>
      )}
    </div>
  );
};

const RenderATemplate = ({ templates }) => {
  return (
    <>
      {templates && templates.length > 0 ? (
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
      ) : (
        <>
          <div className="h-[310px] flex flex-col items-center justify-center">
            <p>No templates found</p>
          </div>
          
        </>
      )}
    </>
  );
};

export default HomeContainer;
