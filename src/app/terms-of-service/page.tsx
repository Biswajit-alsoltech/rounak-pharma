import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Terms of Service
          </h1>
           <p className="text-md text-gray-500">
            Last Updated: October 10, 2025
          </p>
        </header>

        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg prose prose-lg max-w-none text-gray-700">
            <h2>1. Agreement to Terms</h2>
            <p>
                By accessing our website and using our services, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2>2. Use License</h2>
            <p>
                Permission is granted to temporarily download one copy of the materials on Rounak Pharma&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
                The materials on Rounak Pharma&apos;s website are provided on an &apos;as is&apos; basis. Rounak Pharma makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2>4. Limitations</h2>
            <p>
                In no event shall Rounak Pharma or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Rounak Pharma&apos;s website.
            </p>

            <h2>5. Governing Law</h2>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Kolkata, West Bengal.
            </p>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default TermsOfServicePage;
