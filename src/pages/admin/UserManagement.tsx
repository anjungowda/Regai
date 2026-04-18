import React, { useState } from 'react';
import { UserPlus, MoreVertical, Edit2 } from 'lucide-react';
import { InviteUserModal } from '../../components/admin/InviteUserModal';

export default function UserManagement() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const mockUsers = [
    { id: 1, name: 'Anju Narasegowda', email: 'admin@horizonpayments.com', role: 'admin', status: 'Active', cases: 0 },
    { id: 2, name: 'Sarah Ahmed', email: 'manager@horizonpayments.com', role: 'compliance_manager', status: 'Active', cases: 4 },
    { id: 3, name: 'James Okonkwo', email: 'analyst1@horizonpayments.com', role: 'analyst', status: 'Active', cases: 14 },
    { id: 4, name: 'Pending Auditor', email: 'audit_team@horizonpayments.com', role: 'auditor', status: 'Pending', cases: 0 }
  ];

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'compliance_manager': return 'bg-blue-100 text-blue-800';
      case 'analyst': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0F2557]">Team Members</h2>
          <p className="text-sm text-slate-500 mt-1">Manage RBAC roles and organisation permissions.</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="bg-[#1B4FD8] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="overflow-x-auto">
         <table className="w-full text-left">
           <thead>
             <tr>
               <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Member ID</th>
               <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Role Assignation</th>
               <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
               <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Cases Bound</th>
               <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100"></th>
             </tr>
           </thead>
           <tbody>
             {mockUsers.map(u => (
               <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition group">
                 <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${u.status === 'Pending' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-700'}`}>
                         {u.name.substring(0, 2).toUpperCase()}
                       </div>
                       <div>
                         <p className="font-bold text-slate-800 text-sm group-hover:text-[#1B4FD8] transition">{u.name}</p>
                         <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                       </div>
                    </div>
                 </td>
                 <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border ${getRoleStyle(u.role)} flex w-fit items-center gap-2 cursor-pointer`}>
                      {u.role.replace('_', ' ')} <Edit2 className="w-3 h-3 opacity-50" />
                    </span>
                 </td>
                 <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-amber-400'}`} />
                      <span className="text-xs font-bold text-slate-600">{u.status}</span>
                    </div>
                 </td>
                 <td className="px-4 py-4 font-bold text-slate-700">
                    {u.cases}
                 </td>
                 <td className="px-4 py-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition"><MoreVertical className="w-5 h-5"/></button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      <InviteUserModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}
