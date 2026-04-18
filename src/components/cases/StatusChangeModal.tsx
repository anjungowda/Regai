import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useUpdateCase } from '../../hooks/useCaseDetail';
import { useCreateNote } from '../../hooks/useNotes';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  currentStatus: string;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({ isOpen, onClose, caseId, currentStatus }) => {
  const [newStatus, setNewStatus] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  const updateCase = useUpdateCase(caseId);
  const createNote = useCreateNote(caseId);

  const getValidTransitions = () => {
    switch(currentStatus) {
      case 'NEW': return [{ id: 'IN_REVIEW', label: 'In Review' }, { id: 'ESCALATED', label: 'Escalated' }];
      case 'IN_REVIEW': return [{ id: 'ESCALATED', label: 'Escalated' }, { id: 'PENDING_REVIEW', label: 'Pending Review' }];
      case 'ESCALATED': return [{ id: 'IN_REVIEW', label: 'In Review' }, { id: 'PENDING_REVIEW', label: 'Pending Review' }];
      case 'PENDING_REVIEW': return [{ id: 'CLOSED', label: 'Closed (Manager Only)' }];
      default: return [];
    }
  };

  const transitions = getValidTransitions();

  const handleSave = async () => {
    if (!newStatus) return;
    if (noteContent.trim()) {
      await createNote.mutateAsync({ content: `Status changed to ${newStatus}. Note: ${noteContent}`, isInternal: false });
    }
    updateCase.mutate(
      { status: newStatus as any },
      { onSuccess: () => onClose() }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#1B4FD8]" /> Change Status
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">New Status</label>
            <select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:border-[#1B4FD8] focus:ring-1 focus:ring-[#1B4FD8] text-sm text-slate-700"
            >
              <option value="" disabled>Select transition...</option>
              {transitions.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Add a note about this status change (optional)</label>
            <textarea 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
              placeholder="Reason for escalation, etc..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:border-[#1B4FD8] focus:ring-1 focus:ring-[#1B4FD8] resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={!newStatus || updateCase.isPending || createNote.isPending}
            className="px-4 py-2 font-medium text-white bg-[#1B4FD8] hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {updateCase.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
};
