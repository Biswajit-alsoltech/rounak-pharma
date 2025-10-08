'use client';

import { useState, useEffect } from 'react';
import { Search, Package, Building, IndianRupee, Tag, Receipt } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

// --- Type Definitions ---
// Add this new interface
interface ApiProduct {
  id: number;
  product_name: string;
  m_name: string;
  category?: string; // Optional property
  mrp: number | string;
  ptr: number | string;
  qty?: string; // Optional property
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

// --- Reusable Skeleton Component for Loading State ---
const TableRowSkeleton = () => (
  <tr className="bg-white animate-pulse">
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded"></div></td>
  </tr>
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
  
  // State for our filter inputs
  const [productNameFilter, setProductNameFilter] = useState('');
  const [companyNameFilter, setCompanyNameFilter] = useState('');

  // Debounce the filter inputs to avoid excessive API calls
  const debouncedProductName = useDebounce(productNameFilter, 500);
  const debouncedCompanyName = useDebounce(companyNameFilter, 500);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Prepare the request body with active filters
        const requestBody: { [key: string]: string } = {};
        if (debouncedProductName) {
            requestBody.p_name = debouncedProductName;
        }
        if (debouncedCompanyName) {
            requestBody.m_name = debouncedCompanyName;
        }

        const response = await apiFetch(`/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
        } else {
          // Handle cases where API returns success:false or invalid data
          setProducts([]); // Clear previous results
          // Optionally set an error message based on response.message if available
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
  }, [debouncedProductName, debouncedCompanyName]); // Re-run effect when debounced filters change

  return (
    <main>
      <Navbar />
      <section className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
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
          
          {/* Products Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 table-fixed">
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
                    {/* <th scope="col" className="w-1/12 px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md whitespace-nowrap" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Warehouse className="inline-block mr-2" size={18}/> QTY
                      </div>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} />)
                  ) : error ? (
                    <tr>
                        <td colSpan={6} className="text-center py-10 px-6 text-red-500">{error}</td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                        <td className="px-6 text-center py-4 font-bold text-gray-900">{product.name}</td>
                        <td className="px-6 text-center py-4">{product.company}</td>
                        <td className="px-6 text-center py-4">{product.category}</td>
                        <td className="px-6 text-center py-4">₹{product.mrp}</td>
                        <td className="px-6 text-center py-4">₹{product.ptr}</td>
                        {/* <td className="px-6 py-4">{product.qty}</td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 px-6 text-gray-500">No products found for the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AllProductsPage;

