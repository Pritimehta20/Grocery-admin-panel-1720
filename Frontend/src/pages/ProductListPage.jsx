import React, { useEffect, useState } from 'react';
import CardProduct from '../components/CardProduct';
import { Link, useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/validURLConvert';
import Loading from '../components/loading';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]);

  // Safely parse categoryId and subCategoryId
  const categoryId = params?.category?.split('-').slice(-1)[0];
  const subCategoryId = params?.subCategory?.split('-').slice(-1)[0];

  const subCategoryArr = params?.subCategory?.split('-') || [];
  const subCategoryName = subCategoryArr.slice(0, subCategoryArr.length - 1).join(' ');

  const fetchProductData = async () => {
    if (!categoryId || !subCategoryId) return;

    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getProductByCategoryAndSubCategory,
        data: { categoryId, subCategoryId, page, limit: 8 },
      });

      if (response.data.success) {
        if (page === 1) setData(response.data.data);
        else setData((prev) => [...prev, ...response.data.data]);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params, page]);

  // Filter subcategories belonging to this category
  useEffect(() => {
    if (!categoryId) return;

    const filteredSubs = AllSubCategory.filter((s) =>
      s.category.some((el) => el._id === categoryId)
    );

    setDisplaySubCategory(filteredSubs);
  }, [params, AllSubCategory]);

  return (
    <section className="pt-6 lg:pt-5 bg-blue-50 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-white shadow-md rounded-md p-2 overflow-y-auto sticky top-24 max-h-[88vh] scrollbarCustom">
          {DisplaySubCategory.map((s) => {
            // Find the correct parent category
            const parentCategory = s.category.find((c) => c._id === categoryId);
            if (!parentCategory) return null;

            const link = `/${valideURLConvert(parentCategory.name)}-${parentCategory._id}/${valideURLConvert(s.name)}-${s._id}`;

            return (
              <Link
                key={s._id}
                to={link}
                className={`flex items-center gap-3 p-2 rounded hover:bg-green-100 transition-colors ${
                  subCategoryId === s._id ? 'bg-green-100' : ''
                }`}
              >
                <div className="w-14 h-14 lg:w-12 lg:h-12 rounded overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                  <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm lg:text-base truncate">{s.name}</p>
              </Link>
            );
          })}
        </div>

        {/* Products */}
        <div className="flex flex-col">
          <div className="bg-white shadow-md p-4 rounded-md sticky top-24 z-10">
            <h3 className="font-semibold text-lg">{subCategoryName || 'Products'}</h3>
          </div>
          <div className="overflow-y-auto max-h-[80vh] mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((p, index) => (
                <CardProduct key={p._id + 'productSubCategory' + index} data={p} />
              ))}
            </div>
            {loading && (
              <div className="mt-4 text-center">
                <Loading/>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
