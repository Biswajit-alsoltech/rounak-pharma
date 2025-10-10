import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, Undo2 } from 'lucide-react';

const DeliveryAndReturnsPage = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Delivery & Returns
          </h1>
          <p className="text-lg text-gray-600">
            Clear information about how we get your orders to you and how to handle returns.
          </p>
        </header>

        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-12">
          {/* Delivery Section */}
          <section id="delivery">
            <div className="flex items-center mb-6">
              <Truck className="w-10 h-10 text-green-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-800">Delivery Policy</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                At Rounak Pharma, we are committed to delivering your products in a timely and secure manner.
              </p>
              <h3>Processing Time</h3>
              <p>
                Orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
              </p>
              <h3>Shipping Rates & Delivery Estimates</h3>
              <p>
                Shipping charges for your order will be calculated and displayed at checkout. Delivery estimates will be provided once your order is shipped.
              </p>
            </div>
          </section>

          {/* Returns Section */}
          <section id="returns">
            <div className="flex items-center mb-6">
              <Undo2 className="w-10 h-10 text-green-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-800">Returns Policy</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Our return policy lasts 10 days. If 10 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange.
              </p>
              <h3>Eligibility for Returns</h3>
              <p>
                To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Several types of goods are exempt from being returned, including perishable items and hazardous materials.
              </p>
              <h3>Return Process</h3>
              <p>
                To initiate a return, please contact our customer service team with your order number and details about the product you would like to return. We will respond quickly with instructions for how to return items from your order.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default DeliveryAndReturnsPage;
