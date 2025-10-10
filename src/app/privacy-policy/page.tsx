import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Privacy Policy
          </h1>
          <p className="text-md text-gray-500">
            Last Updated: October 10, 2025
          </p>
        </header>

        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg prose prose-lg max-w-none text-gray-700">
          <h2>Introduction</h2>
          <p>
         Rounak Pharma (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Rounak Pharma. This Privacy Policy applies to our website and its associated subdomains (collectively, our &quot;Service&quot;).
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information from you when you visit our website, register on our site, place an order, subscribe to our newsletter, or fill out a form. Such information may include your name, email address, mailing address, phone number, and professional details like your Drug License number.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            Any of the information we collect from you may be used in one of the following ways: to personalize your experience, to improve our website, to improve customer service, to process transactions, or to send periodic emails.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server.
          </p>
            
          <h2>Cookies</h2>
          <p>
            We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
          </p>

          <h2>Changes to Our Privacy Policy</h2>
          <p>
            If we decide to change our privacy policy, we will post those changes on this page, and/or update the Privacy Policy modification date above.
          </p>

          <h2>Contact Us</h2>
          <p>
            If there are any questions regarding this privacy policy, you may contact us using the information on our Contact page.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PrivacyPolicyPage;
