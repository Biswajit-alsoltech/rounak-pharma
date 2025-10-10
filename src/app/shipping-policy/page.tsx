import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ShippingPolicyPage = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Shipping Policy
          </h1>
           <p className="text-md text-gray-500">
            Last Updated: October 10, 2025
          </p>
        </header>

        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg prose prose-lg max-w-none text-gray-700">
            <h2>Order Processing Time</h2>
            <p>
                All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays. During periods of high order volume, shipments may experience a slight delay. We appreciate your patience and will communicate any significant delays.
            </p>

            <h2>Shipping Rates & Delivery Estimates</h2>
            <p>
                Shipping charges for your order will be calculated and displayed at the time of checkout. Delivery estimates vary depending on your location. A more precise delivery timeline will be provided in your shipment confirmation email.
            </p>

            <h2>Shipment Confirmation & Order Tracking</h2>
            <p>
                You will receive a Shipment Confirmation email containing your tracking number(s) once your order has shipped. The tracking number will become active within 24 hours.
            </p>

            <h2>Damages</h2>
            <p>
                Rounak Pharma is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. It is advisable to save all packaging materials and damaged goods before filing a claim and to take photographic evidence.
            </p>

            <h2>Contact Us</h2>
            <p>
                For any questions about our shipping policy, please contact our customer support team via the details provided on our Contact page.
            </p>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ShippingPolicyPage;
