import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import PendingSellersList from '../../components/admin/PendingSellersList';
import { toast } from 'react-hot-toast';
import { UserGroupIcon } from '@heroicons/react/24/outline';

function AdminSellers() {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingSellers();
  }, []);

  const loadPendingSellers = async () => {
    try {
      const data = await adminService.getPendingSellers();
      setPendingSellers(data.sellers);
    } catch (err) {
      console.error('Load pending sellers error:', err);
      toast.error('Failed to load pending sellers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      await adminService.approveSeller(sellerId);
      toast.success('Seller approved successfully!');
      loadPendingSellers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Approval failed');
    }
  };

  const handleReject = async (sellerId) => {
    try {
      await adminService.rejectSeller(sellerId);
      toast.success('Seller rejected');
      loadPendingSellers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rejection failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Applications
            </h3>
            <p className="text-sm text-gray-600">
              {pendingSellers.length} {pendingSellers.length === 1 ? 'seller' : 'sellers'} waiting for approval
            </p>
          </div>
        </div>
      </div>

      <PendingSellersList
        sellers={pendingSellers}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

export default AdminSellers;