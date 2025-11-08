import { formatPrice } from '../../lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ShoppingCartIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeSlashIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function DashboardStats({ stats, isLoading }) {
  if (isLoading) {
    return <LoadingSpinner text="Loading statistics..." />;
  }

  if (!stats) {
    return <div className="text-center p-8 text-gray-500">No data available</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Users Stats */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Users Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Total Users" 
              value={stats.users.total} 
              icon={UserGroupIcon}
              color="blue" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Active Sellers" 
              value={stats.users.sellers} 
              icon={UsersIcon}
              color="green" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Pending Sellers" 
              value={stats.users.pendingSellers} 
              icon={ClockIcon}
              color="yellow" 
            />
          </motion.div>
        </div>
      </div>

      {/* Sheets Stats */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Sheets Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Total Sheets" 
              value={stats.sheets.total} 
              icon={DocumentTextIcon}
              color="blue" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Active Sheets" 
              value={stats.sheets.active} 
              icon={CheckCircleIcon}
              color="green" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Inactive Sheets" 
              value={stats.sheets.inactive} 
              icon={EyeSlashIcon}
              color="gray" 
            />
          </motion.div>
        </div>
      </div>

      {/* Purchases Stats */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Sales Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Total Purchases" 
              value={stats.purchases.total} 
              icon={ShoppingCartIcon}
              color="blue" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Completed" 
              value={stats.purchases.completed} 
              icon={CheckCircleIcon}
              color="green" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Pending" 
              value={stats.purchases.pending} 
              icon={ClockIcon}
              color="yellow" 
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard 
              label="Total Revenue" 
              value={formatPrice(stats.purchases.totalRevenue)} 
              icon={BanknotesIcon}
              color="purple" 
              highlight
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color = 'blue', icon: Icon, highlight = false }) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      ring: 'ring-blue-200',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      ring: 'ring-green-200',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      ring: 'ring-yellow-200',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      ring: 'ring-red-200',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      ring: 'ring-purple-200',
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      ring: 'ring-indigo-200',
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      ring: 'ring-gray-200',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all ${highlight ? 'ring-2 ' + colors.ring : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.text}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold text-gray-900 truncate`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;