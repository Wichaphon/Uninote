import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSheetStore from "../store/useSheetStore";
import useAuthStore from "../store/useAuthStore";
import SheetCard from "../components/sheets/SheetCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  FireIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sheets, isLoading, fetchSheets } = useSheetStore();

  useEffect(() => {
    fetchSheets({
      page: 1,
      limit: 3,
      sortBy: "purchaseCount",
      order: "desc",
    });
  }, [fetchSheets]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean Gradient */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
        <motion.div
          className="container mx-auto px-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
            variants={itemVariants}
          >
            Learn Smarter with Quality Study Materials
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow"
            variants={itemVariants}
          >
            Find high-quality study notes from ComSci KMITL seniors. Get the
            summaries you need to ace your exams.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/explore")}
                className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto cursor-pointer"
              >
                Explore Sheets <ArrowRightIcon className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Popular Sheets Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col sm:flex-row justify-between sm:items-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FireIcon className="w-8 h-8 text-indigo-600" />
                Most Popular Sheets
              </h2>
              <p className="text-gray-600">Top selling sheets this month</p>
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              View All
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </motion.div>

          {isLoading ? (
            <LoadingSpinner text="Loading popular sheets..." />
          ) : sheets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No sheets available yet</p>
              <p className="text-sm mt-2">Be the first to upload!</p>
              {user && (user.role === "SELLER" || user.role === "ADMIN") && (
                <button
                  onClick={() => navigate("/seller")}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Upload Sheet
                </button>
              )}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={cardListVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {sheets.slice(0, 3).map((sheet) => (
                <motion.div variants={cardVariants} key={sheet.id}>
                  <SheetCard sheet={sheet} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section - Clean Gradient */}
      <section className="py-16 bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={cardListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="text-center" variants={cardVariants}>
              <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <MagnifyingGlassIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">1. Search & Browse</h3>
              <p className="text-white/90">
                Find the perfect study material from our vast collection
              </p>
            </motion.div>
            <motion.div className="text-center" variants={cardVariants}>
              <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CreditCardIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">2. Purchase Securely</h3>
              <p className="text-white/90">
                Safe and secure payment through Stripe
              </p>
            </motion.div>
            <motion.div className="text-center" variants={cardVariants}>
              <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <ArrowDownTrayIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">3. Download & Study</h3>
              <p className="text-white/90">
                Instant access to high-quality PDF materials
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Share Your Knowledge Section - Original Style */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-indigo-950">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Share Your Knowledge
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Share your knowledge and earn extra cash. Help fellow ComSci
            students succeed.
          </p>
          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else if (user.role === "SELLER" || user.role === "ADMIN") {
                navigate("/seller");
              } else {
                navigate("/become-seller");
              }
            }}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-900/50 cursor-pointer"
          >
            {!user
              ? "Get Started"
              : user.role === "SELLER" || user.role === "ADMIN"
              ? "Start Selling"
              : "Become a Seller"}
          </button>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;