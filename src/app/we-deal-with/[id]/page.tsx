'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Corrected import for App Router
import { Search, SlidersHorizontal, Package, Building, IndianRupee, Warehouse, Tag, Receipt } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

// --- Type Definitions ---
// This is the consistent data structure used within the component
interface Product {
  id: number;
  name: string;
  company: string;
  category: string;
  mrp: string;
  ptr: string;
  qty: string;
}

interface ManufacturerInfo {
    m_name: string;
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

// --- Main Page Component ---
const ManufacturerPage = () => {
  const params = useParams(); // Correct hook for App Router
  const id = params.id; // Get id from params

  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturer, setManufacturer] = useState<ManufacturerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!id) return; 

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiFetch(`/manufactures/${id}`);

        if (response.success && Array.isArray(response.data)) {
          if (response.data.length > 0) {
            // Transform the incoming API data to match our component's Product interface
            const transformedProducts = response.data.map((p: any) => ({
              id: p.id,
              name: p.product_name,
              company: p.m_name,
              category: p.category || 'Generic', // Add category with a fallback
              mrp: String(p.mrp),
              ptr: String(p.ptr), // Add PTR
              qty: p.qty || 'N/A', // Handle missing quantity field
            }));
            setProducts(transformedProducts);
            // Extract manufacturer name from the first product
            setManufacturer({ m_name: response.data[0].m_name });
          } else {
            setProducts([]);
            setManufacturer({ m_name: "Manufacturer" });
          }
        } else {
          throw new Error("Failed to fetch product data or data is in an invalid format.");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setProducts([]); // Ensure no old data is shown on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // This filter works because we transformed the API data to match { name, company, ... }
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <Navbar />
      <section className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search for products by ${manufacturer?.m_name || '...'} `}
              className="w-full py-3 pl-12 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button className="text-gray-500 hover:text-blue-600">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
          
          {/* Products Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-800 uppercase">
                  <tr className="bg-blue-50">
                    {/* Custom Header Cells */}
                    <th scope="col" className="px-6 py-3">
                      <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Package className="inline-block mr-2" size={18}/> Product
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Building className="inline-block mr-2" size={18}/> Company
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Tag className="inline-block mr-2" size={18}/> Category
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <IndianRupee className="inline-block mr-2" size={18}/> MRP (₹)
                      </div>
                    </th>
                     <th scope="col" className="px-6 py-3">
                       <div className="relative bg-blue-500 text-white text-base font-bold text-center py-4 px-2 -mt-4 rounded-t-lg shadow-md" style={{clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'}}>
                        <Receipt className="inline-block mr-2" size={18}/> PTR (₹)
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                  ) : error ? (
                    <tr>
                        <td colSpan={6} className="text-center py-10 px-6 text-red-500">{error}</td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                        <td className="px-6 text-center py-4 font-bold text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-center ">{product.company}</td>
                        <td className="px-6 py-4 text-center">{product.category}</td>
                        <td className="px-6 py-4 text-center">₹{product.mrp}</td>
                        <td className="px-6 py-4 text-center">₹{product.ptr}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 px-6 text-gray-500">No products found for this manufacturer.</td>
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

export default ManufacturerPage;

