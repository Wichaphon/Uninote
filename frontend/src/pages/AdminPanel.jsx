import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import DashboardStats from '../components/admin/DashboardStats';
import { formatPrice, formatDate } from '../lib/utils';

function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Load stats error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DashboardStats stats={stats} isLoading={isLoading} />
    </div>
  );
}

export default AdminPanel;