'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Info,
  CalendarClock,
  ListChecks,
  XCircle,
  RefreshCw,
  Banknote,
  Mail,
  Phone,
} from 'lucide-react';

// A new reusable component for the section headers
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

const DeliveryAndReturnsPage = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Return Policy
          </h1>
          <p className="text-lg text-gray-600">
            Clear information about how we handle returns and product expiry.
          </p>
        </header>

        {/* Main content card with section spacing */}
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg space-y-12">
          
          {/* Section 1: Overview */}
          <section>
            <SectionHeader icon={Info} title="1. Overview" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <p>
                At Rounak Pharma, we ensure that all medicines and healthcare
                products are delivered in perfect condition and within their
                valid shelf life. However, if you receive a product that does
                not meet our quality standards or is close to expiry, you may
                request a return as per the guidelines below.
              </p>
            </div>
          </section>

          {/* Section 2: Expiry Policy */}
          <section>
            <SectionHeader icon={CalendarClock} title="2. Expiry Policy" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <p>
                All products shipped by Rounak Pharma have a minimum shelf life
                of 2 to 4 months before expiry at the time of delivery.
              </p>
              <p>
                Products nearing expiry (less than 2 months remaining) will not
                be shipped unless specifically mentioned and approved by the
                customer (for example, discounted or clearance items).
              </p>
              <p>
                If you receive a product with less than 2 months of expiry
                remaining, you are eligible for a return or replacement.
              </p>
            </div>
          </section>

          {/* Section 3: Return Eligibility */}
          <section>
            <SectionHeader icon={ListChecks} title="3. Return Eligibility" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <p>
                You may initiate a return within 7 days of delivery under the
                following conditions:
              </p>
              <ul>
                <li>
                  The product delivered is expired or near expiry (less than 2
                  months left)
                </li>
                <li>You received the wrong product or brand</li>
                <li>
                  The product is damaged, leaked, or defective in transit
                </li>
                <li>The packaging or seal is broken upon delivery</li>
              </ul>
              <p>
                <strong>Note:</strong> Products must be unused, unopened, and in
                their original packaging for return approval.
              </p>
            </div>
          </section>

          {/* Section 4: Non-Returnable Products */}
          <section>
            <SectionHeader icon={XCircle} title="4. Non-Returnable Products" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <p>
                For safety and regulatory reasons, we do not accept returns of:
              </p>
              <ul>
                <li>Prescription medicines once opened</li>
                <li>
                  Temperature-sensitive items (like insulin, injections,
                  vaccines)
                </li>
                <li>
                  Personal care and hygiene products (e.g., creams, lotions,
                  soaps)
                </li>
                <li>Products explicitly marked as non-returnable</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Return Process */}
          <section>
            <SectionHeader icon={RefreshCw} title="5. Return Process" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <ol>
                <li>
                  Contact us within 7 days of delivery with your order details.
                </li>
                <li>
                  Provide your order ID, reason for return, and photo/video
                  proof of the issue (if applicable).
                </li>
                <li>
                  Once verified, we’ll arrange a reverse pickup or guide you on
                  how to send the item back.
                </li>
                <li>
                  After inspection, your refund or replacement will be
                  processed within 5–7 business days.
                </li>
              </ol>
            </div>
          </section>

          {/* Section 6: Refunds */}
          <section>
            <SectionHeader icon={Banknote} title="6. Refunds" />
            <div className="prose prose-lg max-w-none text-gray-700 ml-12">
              <p>
                Refunds will be issued to your original payment method (card,
                UPI, bank transfer, etc.).
              </p>
              <p>
                For COD orders, refunds will be processed via bank transfer or
                store credit.
              </p>
              <p>
                Shipping charges are refundable only if the return is due to
                our error (wrong or expired product).
              </p>
            </div>
          </section>
        </div>

        {/* Section 7: Contact Us (Special Callout) */}
        <section className="mt-12 bg-blue-50 p-8 rounded-xl border border-blue-200 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            7. Contact Us
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            For any questions or support regarding returns or expiry
            issues, please get in touch with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="mailto:support@rounakpharma.com"
              className="inline-flex items-center justify-center font-medium text-blue-700 bg-white border border-blue-300 px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              support@rounakpharma.com
            </a>
            <a
              href="tel:9934623700"
              className="inline-flex items-center justify-center font-medium text-blue-700 bg-white border border-blue-300 px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              9934623700
            </a>
          </div>
        </section>
        
      </div>
      <Footer />
    </main>
  );
};

export default DeliveryAndReturnsPage;