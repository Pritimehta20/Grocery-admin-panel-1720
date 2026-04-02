import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { valideURLConvert } from '../utils/validURLConvert';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay.jsx';
import banner from '../assets/banner.png';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import bannermobile1 from '../assets/bannermobile1.png';
import mobilebanner1 from '../assets/mobilebanner1.png';
import bannermobile2 from '../assets/bannermobile2.png';

import {
  FaArrowRight,
  FaHouse,
  FaCartShopping,
  FaMagnifyingGlass,
  FaLayerGroup,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa6';

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const cartItem = useSelector((state) => state.cartItem?.cart || state.cartItem || []);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = Array.isArray(cartItem) ? cartItem.length : 0;
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = useMemo(
    () => [
      {
        id: 1,
        title: 'Fresh groceries, faster.',
        desc: 'Daily essentials with a cleaner shopping experience.',
        cta: 'Shop now',
        image: banner,
        mobileImage: bannermobile1,
      },
      {
        id: 2,
        title: 'Snacks, Sweets, and more.',
        desc: 'Browse popular picks in just a few taps.',
        cta: 'Explore',
        image: banner1,
        mobileImage: mobilebanner1,
      },
      {
        id: 3,
        title: 'Personal care, simplified.',
        desc: 'Better layout, quick categories, visible cart.',
        cta: 'Start',
        image: banner2,
        mobileImage: bannermobile2,
      },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  const mobileNavItems = [
    {
      label: 'Home',
      icon: <FaHouse />,
      onClick: () => navigate('/'),
      active: location.pathname === '/',
    },
    {
      label: 'Search',
      icon: <FaMagnifyingGlass />,
      onClick: () => navigate('/search'),
      active: location.pathname.includes('/search'),
    },
    {
      label: 'Browse',
      icon: <FaLayerGroup />,
      onClick: () =>
        document.getElementById('shop-by-category')?.scrollIntoView({ behavior: 'smooth' }),
      active: false,
    },
    {
      label: 'Cart',
      icon: <FaCartShopping />,
      onClick: () => navigate('/cart'),
      active: location.pathname.includes('/cart'),
      badge: cartCount,
    },
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 pb-28 lg:pb-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-6">
        {/* Hero carousel */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-neutral-900 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
          <div className="relative h-[250px] sm:h-[320px] lg:h-[360px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  activeSlide === index
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="hidden h-full w-full object-cover lg:block"
                />
                <img
                  src={slide.mobileImage}
                  alt={slide.title}
                  className="h-full w-full object-cover lg:hidden"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_26%)]" />

                <div className="absolute inset-0 flex items-center">
                  <div className="px-4 sm:px-6 lg:px-10 text-white max-w-md">
                    <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md sm:text-xs">
                      Fresh picks
                    </span>

                    <h1 className={`mt-3 font-bold leading-tight ${
                      'text-xl sm:text-xl lg:text-5xl'
                    }`}>
                      {slide.title}
                    </h1>

                    <p className={`mt-2 text-white/85 ${
                      'text-xs sm:text-sm lg:text-base'
                    }`}>
                      {slide.desc}
                    </p>

                    <button
                      onClick={() => {
                        if (categoryData?.[0]) {
                          handleRedirectProductListpage(categoryData[0]._id, categoryData[0].name);
                        }
                      }}
                      className="mt-4 inline-flex min-h-[46px] items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 active:scale-[0.98]"
                    >
                      {slide.cta}
                      <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:flex"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:flex"
            >
              <FaChevronRight />
            </button>

            {/* dots */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 sm:left-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? 'w-6 bg-white' : 'w-2.5 bg-white/45'
                  }`}
                />
              ))}
            </div>

            {/* improved mobile cart */}
            <button
              onClick={() => navigate('/cart')}
              className="absolute right-4 top-4 z-20 flex h-12 min-w-[52px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white text-neutral-900 shadow-lg transition active:scale-[0.98] lg:hidden px-3"
            >
              <FaCartShopping className="text-base" />
              {cartCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div id="shop-by-category" className="mt-6 sm:mt-8 scroll-mt-24">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Discover
            </p>
            <h2 className="mt-1 text-xl font-bold text-neutral-900 sm:text-2xl">
              Shop by category
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Jump into products faster with quick category access.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
            {loadingCategory
              ? new Array(12).fill(null).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[22px] border border-neutral-200/80 bg-white p-3 shadow-sm animate-pulse"
                  >
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-neutral-200 sm:h-20 sm:w-20"></div>
                    <div className="mx-auto mt-3 h-3 w-16 rounded bg-neutral-200"></div>
                  </div>
                ))
              : categoryData.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                    className="group rounded-[22px] border border-white/70 bg-white p-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-50 to-emerald-50 ring-1 ring-neutral-100 sm:h-20 sm:w-20">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs font-semibold text-neutral-700 sm:text-sm">
                      {cat.name}
                    </p>
                  </button>
                ))}
          </div>
        </div>

        {/* Product sections */}
        <div className="mt-8 space-y-8 sm:space-y-10 lg:space-y-12">
          {categoryData?.map((c) => (
            <div
              key={c?._id + 'CategorywiseProduct'}
              className="overflow-hidden rounded-[26px] border border-white/70 bg-white p-3 shadow-sm sm:p-4 lg:p-5"
            >
              <CategoryWiseProductDisplay id={c?._id} name={c?.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-16px)] max-w-md -translate-x-1/2 lg:hidden">
        <div className="grid grid-cols-4 rounded-[24px] border border-white/70 bg-white/95 p-2 shadow-[0_12px_35px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          {mobileNavItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`relative flex min-h-[56px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                item.active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-600 active:scale-[0.97]'
              }`}
            >
              <span className="text-[18px]">{item.icon}</span>
              <span className="mt-1">{item.label}</span>

              {item.badge > 0 && (
                <span className="absolute right-3 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;