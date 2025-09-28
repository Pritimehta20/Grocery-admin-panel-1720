import React, { useEffect, useState } from "react";
import CardProduct from "../components/CardProduct";
import CardLoading from "../components/CardLoading";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import nothing_here_yet from "../assets/nothing_here_yet.webp";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const loadingArrayCard = new Array(10).fill(null);

  const location = useLocation();

  // Parse query param ?q=searchTerm
  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("q") || "";

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.searchProduct,
        data: { search: searchText, page },
      });

      const responseData = response.data;

      if (responseData.success) {
        if (page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // reset page when search text changes
  }, [searchText]);

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleFetchMore = () => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">
          Search Results: {data.length} for "{searchText}"
        </p>

        <InfiniteScroll
          dataLength={data.length}
          next={handleFetchMore}
          hasMore={page < totalPage}
          loader={<p className="text-center">Loading...</p>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
            {data.map((p, index) => (
              <CardProduct data={p} key={p._id + "searchProduct" + index} />
            ))}

            {loading &&
              loadingArrayCard.map((_, index) => (
                <CardLoading key={"loadingsearchpage" + index} />
              ))}
          </div>
        </InfiniteScroll>

        {!data.length && !loading && (
          <div className="flex flex-col justify-center items-center w-full mx-auto">
            <img
              src={nothing_here_yet}
              className="w-full h-full max-w-xs max-h-xs block"
            />
            <p className="font-semibold my-2">No Data found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
