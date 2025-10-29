'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Hourglass,
  Truck,
  IndianRupee,
  PackageSearch,
  Clock,
  Globe,
  ShieldAlert,
} from 'lucide-react';

// Reusable component for the section headers
const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => {
  const Icon = icon;
  return (
    <div className="flex items-center mb-5">
      <Icon className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
    </div>
  );
};

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
            Last Updated: October 29, 2025
          </p>
        </header>

        {/* Main content card with section spacing */}
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-12">
          
          {/* Section 1: Order Processing */}
          <section>
            <SectionHeader icon={Hourglass} title="1. Order Processing" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>
                  All orders placed with Rounak Pharma are processed within 24
                  hours of confirmation.
                </li>
                <li>
                  Orders placed after 6:00 PM or on Sundays/public holidays
                  will be processed on the next working day.
                </li>
                <li>
                  You will receive an order confirmation email/SMS once your
                  order is successfully placed.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Shipping Duration */}
          <section>
            <SectionHeader icon={Truck} title="2. Shipping Duration" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>
                  We aim to dispatch all confirmed orders within 24–48 hours.
                </li>
                <li>
                  Delivery timelines may vary based on your location, product
                  availability, and courier service.
                </li>
                <li>
                  For metro cities, delivery usually takes 1–2 days after
                  dispatch.
                </li>
                <li>
                  For other areas or remote locations, delivery may take 3–5
                  working days.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Shipping Charges */}
          <section>
            <SectionHeader icon={IndianRupee} title="3. Shipping Charges" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>
                  Free shipping on all orders above ₹X (you can set your
                  limit, e.g., ₹499).
                </li>
                <li>
                  For orders below ₹X, a nominal shipping fee will be applied
                  at checkout.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Order Tracking */}
          <section>
            <SectionHeader icon={PackageSearch} title="4. Order Tracking" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>
                  Once your order is shipped, you will receive a tracking ID
                  via email or SMS.
                </li>
                <li>
                  You can track your shipment directly through our courier
                  partner’s website or the “Track Order” section on our
                  website.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Delayed or Failed Deliveries */}
          <section>
            <SectionHeader
              icon={Clock}
              title="5. Delayed or Failed Deliveries"
            />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>
                  Delivery delays may occur due to unforeseen reasons such as
                  weather conditions, courier issues, or local restrictions.
                </li>
                <li>
                  If your order is delayed beyond the expected time, please
                  contact our support team at{" "}
                  <a href="mailto:support@rounakpharma.com">
                    support@rounakpharma.com
                  </a>{" "}
                  or call [insert phone number].
                </li>
                <li>
                  In case of failed delivery attempts, the courier may
                  reattempt or return the parcel to us.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Service Availability */}
          <section>
            <SectionHeader
              icon={Globe}
              title="6. Service Availability"
            />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>We currently ship across India.</li>
                <li>
                  Certain pincode restrictions may apply due to medicine
                  regulations or courier limitations.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Damaged or Missing Items */}
          <section>
            <SectionHeader
              icon={ShieldAlert}
              title="7. Damaged or Missing Items"
            />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ul>
                <li>
                  If you receive a damaged, incorrect, or incomplete order,
                  please contact us within 48 hours of delivery with your
                  order number and proof (photo/video) for quick
                  resolution.
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ShippingPolicyPage;