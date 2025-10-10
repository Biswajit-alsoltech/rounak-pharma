'use client'; // Required for interactive components like the accordion
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 hover:text-blue-700 focus:outline-none"
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="w-6 h-6 text-blue-600" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-gray-600 text-base leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      question: "How do I place an order?",
      answer: "You can place an order directly through our official portal or by contacting our sales representatives. If you are a new customer, you will need to register and provide the necessary documentation (e.g., drug license)."
    },
    {
      question: "What are the payment options available?",
      answer: "We accept various payment methods, including online bank transfers (NEFT/RTGS), UPI, and cheques. Credit terms may be available for established customers subject to approval."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is dispatched, you will receive a shipment confirmation email and/or SMS containing your tracking number(s). You can use this number to track your order on the courier partner's website."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns for damaged or incorrect products within 10 days of delivery. The products must be in their original, unopened packaging. Please contact our support team to initiate a return process."
    },
    {
      question: "Are all products authentic?",
      answer: "Absolutely. Rounak Pharma is an authorized distributor for all listed companies. We guarantee that all our products are 100% authentic and sourced directly from manufacturers."
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our services and products.
          </p>
        </header>

        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default FaqPage;
