import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RefundPolicyPage = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Refund Policy
          </h1>
           <p className="text-md text-gray-500">
            Last Updated: October 10, 2025
          </p>
        </header>

        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg prose prose-lg max-w-none text-gray-700">
            <h2>General Policy</h2>
            <p>
                We have a 10-day return policy, which means you have 10 days after receiving your item to request a return and refund. To be eligible, your item must be in the same condition that you received it: unopened, unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>

            <h2>Refunds Process</h2>
            <p>
                Once we’ve received and inspected your return, we will notify you about the approval or rejection of your refund. If approved, you’ll be automatically refunded on your original payment method or via credit note, as per our agreement. Please remember it can take some time for your bank or credit card company to process and post the refund.
            </p>

            <h2>Damages and Issues</h2>
            <p>
                Please inspect your order upon reception and contact us immediately if the item is defective, damaged, or if you receive the wrong item so that we can evaluate the issue and make it right.
            </p>
            
            <h2>Exceptions / Non-Refundable Items</h2>
            <p>
               Certain types of items cannot be returned for a refund, such as refrigerated items (e.g., vaccines, insulin), certain controlled substances, and items that have been opened or tampered with. Please get in touch if you have questions or concerns about your specific item.
            </p>

             <h2>Contact Us</h2>
            <p>
                To start a return or for any questions related to refunds, you can contact us through the details available on our website&apos;s Contact page.
            </p>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default RefundPolicyPage;
