import React, { useEffect, useMemo, useState } from 'react';
import CardProduct from '../components/CardProduct';
import { Link, useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/validURLConvert';
import Loading from '../components/loading';
import { FaChevronRight } from 'react-icons/fa6';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileSubsOpen, setMobileSubsOpen] = useState(false);

  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]);

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
    setPage(1);
    setData([]);
  }, [params]);

  useEffect(() => {
    fetchProductData();
  }, [params, page]);

  useEffect(() => {
    if (!categoryId) return;

    const filteredSubs = AllSubCategory.filter((s) =>
      s.category.some((el) => el._id === categoryId)
    );

    setDisplaySubCategory(filteredSubs);
  }, [params, AllSubCategory, categoryId]);

  const currentSubCategory = useMemo(() => {
    return DisplaySubCategory.find((s) => s._id === subCategoryId);
  }, [DisplaySubCategory, subCategoryId]);

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)] gap-4 lg:gap-6">
          
          {/* Mobile top section */}
          <div className="lg:hidden space-y-3">
            <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Subcategory
                  </p>
                  <h1 className="mt-1 line-clamp-2 text-lg font-semibold leading-6 text-neutral-900">
                    {subCategoryName || 'Products'}
                  </h1>
                </div>

                <button
                  onClick={() => setMobileSubsOpen((prev) => !prev)}
                  className="shrink-0 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 active:scale-[0.98]"
                >
                  {mobileSubsOpen ? 'Close' : 'Browse'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {DisplaySubCategory.map((s) => {
                  const parentCategory = s.category.find((c) => c._id === categoryId);
                  if (!parentCategory) return null;

                  const link = `/${valideURLConvert(parentCategory.name)}-${parentCategory._id}/${valideURLConvert(s.name)}-${s._id}`;
                  const isActive = subCategoryId === s._id;

                  return (
                    <Link
                      key={s._id}
                      to={link}
                      className={`flex min-w-[82px] max-w-[90px] flex-col items-center gap-2 rounded-xl px-2 py-2 text-center transition ${
                        isActive
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl ${
                        isActive ? 'bg-white/10' : 'bg-white border border-neutral-200'
                      }`}>
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-full w-full object-contain p-1.5"
                        />
                      </div>
                      <p className="line-clamp-2 text-[11px] font-medium leading-4">
                        {s.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileSubsOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
                <div className="grid grid-cols-1 gap-1">
                  {DisplaySubCategory.map((s) => {
                    const parentCategory = s.category.find((c) => c._id === categoryId);
                    if (!parentCategory) return null;

                    const link = `/${valideURLConvert(parentCategory.name)}-${parentCategory._id}/${valideURLConvert(s.name)}-${s._id}`;
                    const isActive = subCategoryId === s._id;

                    return (
                      <Link
                        key={s._id}
                        to={link}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                          isActive
                            ? 'bg-neutral-100 text-neutral-900'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                        <p className="min-w-0 flex-1 truncate text-sm font-medium">
                          {s.name}
                        </p>
                        <FaChevronRight className="text-xs text-neutral-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm lg:block">
            <div className="mb-3 px-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                Browse
              </p>
              <h2 className="mt-1 text-base font-semibold text-neutral-900">
                Subcategories
              </h2>
            </div>

            <div className="space-y-1.5">
              {DisplaySubCategory.map((s) => {
                const parentCategory = s.category.find((c) => c._id === categoryId);
                if (!parentCategory) return null;

                const link = `/${valideURLConvert(parentCategory.name)}-${parentCategory._id}/${valideURLConvert(s.name)}-${s._id}`;
                const isActive = subCategoryId === s._id;

                return (
                  <Link
                    key={s._id}
                    to={link}
                    className={`group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-neutral-100'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <p className={`truncate text-sm ${
                      isActive ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'
                    }`}>
                      {s.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Products area */}
          <div className="min-w-0">
            <div className="sticky top-20 z-10 mb-4 rounded-2xl border border-neutral-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Products
                  </p>
                  <h3 className="truncate text-base sm:text-lg font-semibold text-neutral-900">
                    {subCategoryName || 'Products'}
                  </h3>
                </div>

                <div className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-[11px] sm:text-xs font-medium text-neutral-600">
                  {data?.length || 0} items
                </div>
              </div>
            </div>

            {loading && page === 1 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white py-12 shadow-sm">
                <Loading />
              </div>
            ) : data.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-14 text-center shadow-sm">
                <p className="text-sm font-medium text-neutral-900">No products found</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Try another subcategory.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.map((p, index) => (
                    <div
                      key={p._id + 'productSubCategory' + index}
                      className="animate-[fadeIn_.25s_ease]"
                    >
                      <CardProduct data={p} />
                    </div>
                  ))}
                </div>

                {loading && page > 1 && (
                  <div className="mt-5 text-center">
                    <Loading />
                  </div>
                )}

                {!loading && data.length >= 8 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-[0.98]"
                    >
                      Load more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductListPage;