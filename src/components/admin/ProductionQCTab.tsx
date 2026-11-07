import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ProductionRecord, ProductionStage } from '../../types';
import { 
  Scissors, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  X, 
  Check, 
  User, 
  FileText, 
  Package, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const ProductionQCTab: React.FC = () => {
  const {
    productionRecords,
    updateProductionStage,
    toggleQCCheck,
    verifyPackaging,
    reportProductionIssue,
  } = useAdmin();

  const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [issueInput, setIssueInput] = useState('');
  const [showIssueBox, setShowIssueBox] = useState(false);

  const stages: ProductionStage[] = [
    'Awaiting Materials',
    'Ready to Start',
    'In Production',
    'Quality Check',
    'Ready to Dispatch',
    'Completed',
  ];

  const filtered = productionRecords.filter(
    (r) => stageFilter === 'All' || r.stage === stageFilter
  );

  const getStageBadge = (stage: ProductionStage) => {
    switch (stage) {
      case 'Awaiting Materials':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      case 'Ready to Start':
        return 'bg-blue-950/60 text-blue-300 border-blue-800';
      case 'In Production':
        return 'bg-purple-950/60 text-purple-300 border-purple-800';
      case 'Quality Check':
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-800';
      case 'Ready to Dispatch':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
      case 'Completed':
        return 'bg-gray-800 text-gray-300 border-gray-700';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !issueInput.trim()) return;
    reportProductionIssue(selectedRecord.id, issueInput.trim());
    setSelectedRecord({
      ...selectedRecord,
      issueReported: issueInput.trim(),
    });
    setIssueInput('');
    setShowIssueBox(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header and Stage Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3532] pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-emerald-400" />
            Handmade Production & Quality Control
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Track crafting progress, assign studio artisans, and verify QC checklists before wax-sealed dispatch.
          </p>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStageFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              stageFilter === 'All'
                ? 'bg-[#145C45] text-white shadow-xs'
                : 'bg-[#161B19] text-gray-400 hover:text-white border border-[#2C3532]'
            }`}
          >
            All Work ({productionRecords.length})
          </button>
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                stageFilter === st
                  ? 'bg-[#145C45] text-white shadow-xs'
                  : 'bg-[#161B19] text-gray-400 hover:text-white border border-[#2C3532]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Production Queue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rec) => {
          const checkedCount = rec.qcChecklist.filter((q) => q.checked).length;
          const totalQc = rec.qcChecklist.length;
          const isQcComplete = checkedCount === totalQc && rec.packagingVerified;

          return (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="bg-[#161B19] rounded-2xl p-5 border border-[#2C3532] hover:border-emerald-600 transition-all hover:shadow-lg space-y-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-[#101413] px-2 py-0.5 rounded border border-[#2C3532]">
                      {rec.orderId}
                    </span>
                    {rec.isUrgent && (
                      <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        RUSH
                      </span>
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadge(rec.stage)}`}>
                    {rec.stage}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-white line-clamp-1">
                    {rec.productSummary}
                  </h3>
                  <span className="text-xs text-gray-400 block">
                    Patron: <strong className="text-gray-200">{rec.customerName}</strong>
                  </span>
                </div>

                {rec.issueReported && (
                  <div className="p-2.5 bg-red-950/70 border border-red-800 rounded-xl text-[11px] text-red-200 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">Issue: {rec.issueReported}</span>
                  </div>
                )}

                {/* QC Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Quality Control:</span>
                    <span className={isQcComplete ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
                      {checkedCount}/{totalQc} Passed
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#101413] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isQcComplete ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                      style={{ width: `${(checkedCount / totalQc) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2C3532] flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[130px]">{rec.assignedArtisan}</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-300 font-medium">
                  Due: {rec.requiredArrivalDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production & QC Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#161B19] rounded-3xl border border-[#2C3532] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2C3532] pb-4">
              <div>
                <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider block">
                  Studio Production Card
                </span>
                <h3 className="font-mono text-xl font-bold text-white flex items-center gap-2">
                  {selectedRecord.orderId}
                  <span className="text-xs font-sans text-gray-400 font-normal">
                    ({selectedRecord.customerName})
                  </span>
                </h3>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2A3330]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Update Crafting Stage:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {stages.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateProductionStage(selectedRecord.id, st);
                      setSelectedRecord({ ...selectedRecord, stage: st });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      selectedRecord.stage === st
                        ? 'bg-[#145C45] border-emerald-500 text-white shadow-xs'
                        : 'bg-[#101413] border-[#2C3532] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedRecord.stage === st && <Check className="w-3.5 h-3.5 text-emerald-200" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Personalisation instructions */}
            <div className="p-4 bg-[#101413] rounded-2xl border border-[#2C3532] space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Approved Personalisation Instructions:
              </span>
              <p className="text-xs text-gray-200 leading-relaxed font-medium">
                "{selectedRecord.personalisationInstructions}"
              </p>
            </div>

            {/* Quality-Control Checklist (Interactive) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Studio Quality-Control (QC) Verification Checklist:
              </span>
              <div className="space-y-2">
                {selectedRecord.qcChecklist.map((item) => (
                  <label
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      item.checked
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                        : 'bg-[#101413] border-[#2C3532] text-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {
                        toggleQCCheck(selectedRecord.id, item.id);
                        setSelectedRecord({
                          ...selectedRecord,
                          qcChecklist: selectedRecord.qcChecklist.map((q) =>
                            q.id === item.id ? { ...q, checked: !q.checked } : q
                          ),
                        });
                      }}
                      className="w-4 h-4 accent-[#145C45] rounded"
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                  </label>
                ))}

                {/* Packaging verification */}
                <label
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    selectedRecord.packagingVerified
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                      : 'bg-[#101413] border-[#2C3532] text-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRecord.packagingVerified}
                    onChange={(e) => {
                      verifyPackaging(selectedRecord.id, e.target.checked);
                      setSelectedRecord({
                        ...selectedRecord,
                        packagingVerified: e.target.checked,
                      });
                    }}
                    className="w-4 h-4 accent-[#145C45] rounded"
                  />
                  <span className="text-xs font-medium">
                    Rigid courier box, protective foam wrap & wax seal inspected before sealing
                  </span>
                </label>
              </div>
            </div>

            {/* Internal Notes (Private to Studio) */}
            <div className="p-3 bg-[#101413] rounded-2xl border border-[#2C3532] text-xs text-gray-400 space-y-1">
              <span className="font-bold text-gray-300 block">Private Internal Notes:</span>
              <p>{selectedRecord.internalStudioNotes}</p>
            </div>

            {/* Issue Reporting Form */}
            {selectedRecord.issueReported ? (
              <div className="p-3 bg-red-950/70 border border-red-800 rounded-2xl text-xs text-red-200 space-y-1">
                <strong>Flagged Production Issue:</strong>
                <p>{selectedRecord.issueReported}</p>
              </div>
            ) : showIssueBox ? (
              <form onSubmit={handleReportIssue} className="space-y-2">
                <label className="text-xs font-bold text-red-400 block">
                  Report Production / Quality Defect:
                </label>
                <textarea
                  rows={2}
                  required
                  value={issueInput}
                  onChange={(e) => setIssueInput(e.target.value)}
                  placeholder="e.g. Photo paper smudge during drying, damaged wooden base, ribbon frayed..."
                  className="w-full px-3 py-2 rounded-xl bg-[#101413] border border-red-800 text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                  >
                    Flag Issue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIssueBox(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#2C3532] text-gray-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowIssueBox(true)}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report Defect or Re-crafting Issue</span>
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
