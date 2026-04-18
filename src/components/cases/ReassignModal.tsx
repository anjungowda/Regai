import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { useOrgUsers } from '../../hooks/useOrgUsers';
import { useUpdateCase } from '../../hooks/useCaseDetail';

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  currentAssigneeId?: string;
}

export const ReassignModal: React.FC<ReassignModalProps> = ({ isOpen, onClose, caseId, currentAssigneeId }) => {
  const [selectedUserId, setSelectedUserId] = useState(currentAssigneeId || '');
  const { data: users, isLoading } = useOrgUsers();
  const updateCase = useUpdateCase(caseId);

  const handleSave = () => {
    updateCase.mutate(
      { assignedTo: selectedUserId },
      { onSuccess: () => onClose() }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#1B4FD8]" /> Reassign Case
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Select New Assignee</label>
          <select 
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:border-[#1B4FD8] focus:ring-1 focus:ring-[#1B4FD8] text-sm text-slate-700"
          >
            <option value="">Unassigned</option>
            {isLoading ? (
              <option disabled>Loading users...</option>
            ) : (
              users?.map((u: any) => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role.replace('_', ' ')})</option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={updateCase.isPending || selectedUserId === currentAssigneeId}
            className="px-4 py-2 font-medium text-white bg-[#1B4FD8] hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {updateCase.isPending ? 'Saving...' : 'Reassign'}
          </button>
        </div>
      </div>
    </div>
  );
};
