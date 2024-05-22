import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDownWithScale } from "../animations";
import { FiltersData} from '../utils/helpers';
import useFilters from '../hooks/useFilters';
import { useQueryClient } from "react-query";

const Filters = () => {

  const [isClearHovered, setIsClearHovered] = useState(false);
  const { data : filterData, isLoading, isError } = useFilters();

  const queryClient = useQueryClient();

  const handleFilterValue = (value) => {
    const previousState = queryClient.getQueryData("globalFilter");
    const currentState = { ...previousState, searchTerm : value };
    queryClient.setQueryData("globalFilter", currentState);

  }

  const clearFilter = () => {
    const previousState = queryClient.getQueryData("globalFilter");
    const currentState = { ...previousState, searchTerm: "" };
    queryClient.setQueryData("globalFilter", currentState); 
  }



  return (
    <div className="w-full py-4 flex justify-start items-center">
      <div
        className="border border-gray-300 px-2 py-2 rounded-md mr-3 cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setIsClearHovered(true)}
        onMouseLeave={() => setIsClearHovered(false)}
        onClick={ clearFilter }
      >
        <MdLayersClear className="text-xl" />

        <AnimatePresence>
          {
          isClearHovered && (
            <motion.div
              {...slideUpDownWithScale}
              className="absolute -top-8 -left-1 bg-white shadow-md px-2 py-1 rounded-md"
            >
              <p className="whitespace-nowrap text-xs text-red-700">Clear all</p>
            </motion.div>
          )
          }
        </AnimatePresence>
      </div>

      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {
          FiltersData && FiltersData.map((item) => (
            <div 
              onClick={ () => { handleFilterValue(item.value) }}
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${filterData?.searchTerm === item.value && "bg-gray-300 shadow-md"}`}
            >
                <p className="text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">{item.label}</p>

            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Filters;
