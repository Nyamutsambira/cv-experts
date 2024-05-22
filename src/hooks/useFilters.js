
import { useQuery } from 'react-query';

const useFilters = () => {
    const { data, isLoading, isError, refetch} = useQuery(
        "globalFilter",
        () => ( {searchTerm : ""} ),
        {refetchOnWindowFocus : false}
    );

    console.log("useFilters method...")

    return { data, isLoading, isError, refetch};
}

export default useFilters;