'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Package, Building, IndianRupee, Tag, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

// --- Type Definitions ---
interface Product {
  id: number;
  name: string;
  company: string;
  category: string;
  mrp: string;
  ptr: string;
  qty: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  m_name: string;
  category?: string;
  mrp: string | number;
  ptr: string | number;
  qty?: string;
}

interface ManufacturerInfo {
  m_name: string;
}

// --- Reusable Skeleton Components for Loading State ---
const TableRowSkeleton = () => (
  <tr className="bg-white animate-pulse">
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    {/* <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td> */}
  </tr>
);

const CardSkeleton = () => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse">
    <div className="flex justify-between items-start space-x-3">
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded-full w-20 mt-1"></div>
    </div>
  </div>
);


// --- Main Page Component ---
const ManufacturerPage = () => {
  const params = useParams();
  const id = params.id;

  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturer, setManufacturer] = useState<ManufacturerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!id) return;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiFetch(`/manufactures/${id}`);

        if (response.success && Array.isArray(response.data)) {
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

          if (response.data.length > 0) {
            setManufacturer({ m_name: response.data[0].m_name });
          } else {
            // You might want a better way to get the name if the product list is empty
            setManufacturer({ m_name: "Selected Manufacturer" });
          }
        } else {
          throw new Error(response.message || "Failed to fetch product data.");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Filtering and Pagination Logic ---
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentProducts = filteredProducts.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1
  };


  return (
    <main>
      <Navbar />
      <section className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
              {isLoading ? 'Loading Products...' : `Products by ${manufacturer?.m_name || 'Manufacturer'}`}
            </h1>
          </header>

          <div className="relative mb-8 max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search products...`}
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-800 uppercase">
                  <tr className="bg-blue-50">
                    <th scope="col" className="px-6 py-3">
                      <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}>
                        <Package className="inline-block mr-2" size={18} /> Product
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}>
                        <Building className="inline-block mr-2" size={18} /> Company
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}>
                        <Tag className="inline-block mr-2" size={18} /> Category
                      </div>
                    </th>
                    {/* <th scope="col" className="px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <IndianRupee className="inline-block mr-2" size={18}/> MRP (₹)
                      </div>
                    </th>
                     <th scope="col" className="px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Receipt className="inline-block mr-2" size={18}/> PTR (₹)
                      </div>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => <TableRowSkeleton key={i} />)
                  ) : error ? (
                    <tr><td colSpan={5} className="text-center py-10 px-6 text-red-500">{error}</td></tr>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="text-center px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                        <td className="text-center px-6 py-4">{product.company}</td>
                        <td className="text-center px-6 py-4">{product.category}</td>
                        {/* <td className="text-center px-6 py-4">₹{product.mrp}</td>
                        <td className="text-center px-6 py-4">₹{product.ptr}</td> */}
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
                  <div className="flex justify-between items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-blue-800 truncate" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate" title={product.company}>
                        {product.company}
                      </p>
                    </div>
                    <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-blue-800 whitespace-nowrap mt-1">
                      {product.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 px-6 text-gray-500">No products found.</div>
            )}
          </div>

            {/* Pagination Controls */}
            {!isLoading && !error && filteredProducts.length > 0 && (
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

export default ManufacturerPage;

