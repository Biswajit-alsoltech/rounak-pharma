'use client';

import { useState, useEffect } from 'react';
import { Search, Package, Building, IndianRupee, Tag, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

// --- Type Definitions ---
interface ApiProduct {
  id: number;
  product_name: string;
  m_name: string;
  category?: string;
  mrp: number | string;
  ptr: number | string;
  qty?: string;
}

interface Product {
  id: number;
  name: string;
  company: string;
  category: string;
  mrp: string;
  ptr: string;
  qty: string;
}

// --- Reusable Skeleton Components for Loading State ---
const TableRowSkeleton = () => (
  <tr className="bg-white animate-pulse">
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
  </tr>
);

const CardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="flex justify-between mt-2 border-t pt-3">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);


// --- Custom Hook for Debouncing Input ---
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


// --- Main Page Component ---
const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [productNameFilter, setProductNameFilter] = useState('');
  const [companyNameFilter, setCompanyNameFilter] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const debouncedProductName = useDebounce(productNameFilter, 500);
  const debouncedCompanyName = useDebounce(companyNameFilter, 500);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const requestBody: { [key: string]: string } = {};
        if (debouncedProductName) {
            requestBody.p_name = debouncedProductName;
        }
        if (debouncedCompanyName) {
            requestBody.m_name = debouncedCompanyName;
        }

        const response = await apiFetch(`/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (response.status && Array.isArray(response.data)) {
          const transformedProducts = response.data.map((p: ApiProduct) => ({
            id: p.id,
            name: p.product_name,
            company: p.m_name,
            category: p.category || 'Generic',
            mrp: String(p.mrp),
            ptr: String(p.ptr),
            qty: p.qty || 'N/A',
          }));
          setProducts(transformedProducts);
          setCurrentPage(1); // Reset to first page on new search
        } else {
          setProducts([]);
          if(response.message) setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, [debouncedProductName, debouncedCompanyName]);

  // --- Pagination Logic ---
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentProducts = products.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when changing items per page
  };


  return (
    <main>
      <Navbar />
      <section className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Our Complete Product Catalog</h1>
                <p className="mt-2 text-gray-600">Search for medicines and companies to find what you need.</p>
            </header>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    value={productNameFilter}
                    onChange={(e) => setProductNameFilter(e.target.value)}
                    placeholder="Search by medicine..."
                    className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    value={companyNameFilter}
                    onChange={(e) => setCompanyNameFilter(e.target.value)}
                    placeholder="Search by company..."
                    className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-800 uppercase">
                  <tr className="bg-blue-50">
                    <th scope="col" className="w-3/12 px-6 py-3">
                      <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md whitespace-nowrap" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Package className="inline-block mr-2" size={18}/> Product
                      </div>
                    </th>
                    <th scope="col" className="w-2/12 px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md whitespace-nowrap" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Building className="inline-block mr-2" size={18}/> Company
                      </div>
                    </th>
                    <th scope="col" className="w-2/12 px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md whitespace-nowrap" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Tag className="inline-block mr-2" size={18}/> Category
                      </div>
                    </th>
                    <th scope="col" className="w-2/12 px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md whitespace-nowrap" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <IndianRupee className="inline-block mr-2" size={18}/> MRP (₹)
                      </div>
                    </th>
                     <th scope="col" className="w-2/12 px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md whitespace-nowrap" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Receipt className="inline-block mr-2" size={18}/> PTR (₹)
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => <TableRowSkeleton key={i} />)
                  ) : error ? (
                    <tr><td colSpan={5} className="text-center py-10 px-6 text-red-500">{error}</td></tr>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                        <td className="text-center px-6 py-4 font-bold text-gray-900">{product.name}</td>
                        <td className="text-center px-6 py-4">{product.company}</td>
                        <td className="text-center px-6 py-4">{product.category}</td>
                        <td className="text-center px-6 py-4">₹{product.mrp}</td>
                        <td className="text-center px-6 py-4">₹{product.ptr}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-10 px-6 text-gray-500">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
                 {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => <CardSkeleton key={i} />)
                  ) : error ? (
                    <div className="text-center py-10 px-6 text-red-500">{error}</div>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-lg text-blue-800">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.company}</p>
                             <p className="text-sm text-gray-500 mb-3">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
                                    {product.category}
                                </span>
                            </p>
                            <div className="flex justify-between items-center border-t pt-3 mt-3">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold">MRP</p>
                                    <p className="font-bold text-green-700">₹{product.mrp}</p>
                                </div>
                               <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold">PTR</p>
                                    <p className="font-bold text-green-700">₹{product.ptr}</p>
                                </div>
                            </div>
                        </div>
                    ))
                  ) : (
                    <div className="text-center py-10 px-6 text-gray-500">No products found for the current filters.</div>
                  )}
            </div>

             {/* Pagination Controls */}
            {!isLoading && !error && products.length > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t">
                    <div className="flex items-center mb-4 md:mb-0">
                        <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-4">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous Page"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next Page"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AllProductsPage;

