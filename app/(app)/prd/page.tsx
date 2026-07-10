'use client';
import MarkdownRenderer from '@/app/components/MarkdownRenerer';
import { TableSkeleton } from '@/app/components/SkeletonsLine';
import { PRD, PRDForm } from '@/app/types/interfaces';
import { api, formatDate } from '@/app/utils/helpers';
import {
  Calendar,
  ChevronLeft,
  Download,
  Eye,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function PrdPage() {
  const [prds, setPRDs] = useState<PRD[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPRD, setSelectedPRD] = useState<PRD | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PRDForm>();
  const ideaValue = watch('idea', '');

  const fetchPRDs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/prd/');
      setPRDs(res.data.prds ?? []);
    } catch (err) {
      console.error('[PRD] Failed to load PRDs:', err);
      if (axios.isAxiosError(err)) {
        console.error('[PRD] Error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPRDs();
  }, [fetchPRDs]);

  const onSubmit = async (data: PRDForm) => {
    setGenerating(true);
    try {
      const res = await api.post('/prd/', data);
      setPRDs((prev) => [res.data.prd, ...prev]);
      setSelectedPRD(res.data.prd);
      setShowForm(false);
      reset();
      // success('PRD generated successfully!');
    } catch (err) {
      console.error('[PRD] Failed to generate PRD:', err);
      if (axios.isAxiosError(err)) {
        console.error('[PRD] Generate error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error(err instanceof Error ? err.message : 'Failed to generate PRD');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await api.delete(`/prd/${id}`);
      setPRDs((prev) => prev.filter((p) => p.id !== id));
      if (selectedPRD?.id === id) setSelectedPRD(null);
      // success('PRD deleted');
    } catch (err) {
      console.error('[PRD] Failed to delete PRD:', err);
      if (axios.isAxiosError(err)) {
        console.error('[PRD] Delete error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error('Failed to delete PRD');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = (prd: PRD) => {
    const blob = new Blob([prd.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prd.title.replace(/\s+/g, '-').toLowerCase()}-prd.md`;
    a.click();
    URL.revokeObjectURL(url);
    // success('PRD exported as Markdown');
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar list */}
        <div
          className={`${selectedPRD ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-72 xl:w-80 flex-shrink-0 border-r border-white/[0.06] overflow-hidden`}
        >
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-lg font-bold text-white">PRD Generator</h1>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setSelectedPRD(null);
                }}
                className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Generate
              </button>
            </div>
            <p className="text-xs text-white/30">Product Requirements Documents</p>
          </div>

          {/* Form */}
          {showForm && (
            <div className="p-4 border-b border-white/[0.06] bg-violet-500/5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">
                    PRD Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field text-sm py-2"
                    placeholder="e.g. Mobile Payment App PRD"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">
                    Startup Idea *
                    <span className="ml-1 text-white/20">({ideaValue.length}/1000)</span>
                  </label>
                  <textarea
                    {...register('idea', {
                      required: 'Idea description is required',
                      minLength: {
                        value: 20,
                        message: 'Please provide more detail (min 20 chars)',
                      },
                      maxLength: { value: 1000, message: 'Max 1000 characters' },
                    })}
                    className="input-field text-sm py-2 resize-none"
                    rows={4}
                    placeholder="Describe your startup idea in detail: what problem it solves, who it's for, key features..."
                  />
                  {errors.idea && (
                    <p className="text-red-400 text-xs mt-1">{errors.idea.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={generating}
                  className="btn-primary w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 spinner" />
                      Generating PRD...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate PRD
                    </>
                  )}
                </button>
                {generating && (
                  <p className="text-[10px] text-white/30 text-center">
                    This may take 15-120 seconds...
                  </p>
                )}
              </form>
            </div>
          )}

          {/* PRD List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loading ? (
              <TableSkeleton rows={3} />
            ) : prds.length === 0 && !showForm ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <FileText className="w-10 h-10 text-white/15 mb-3" />
                <p className="text-sm text-white/35 mb-3">No PRDs yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" /> Generate your first PRD
                </button>
              </div>
            ) : (
              prds.map((prd) => (
                <div
                key={prd.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedPRD(prd);
                  setShowForm(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedPRD(prd);
                    setShowForm(false);
                  }
                }}
                className={`w-full text-left glass rounded-xl p-3.5 transition-all group cursor-pointer ${
                  selectedPRD?.id === prd.id
                    ? 'border-violet-500/40 bg-violet-500/10'
                    : 'glass-hover'
                }`}
              >
                <div className="flex items-start gap-2">
                  <FileText
                    className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${selectedPRD?.id === prd.id ? 'text-violet-400' : 'text-white/30'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${selectedPRD?.id === prd.id ? 'text-violet-300' : 'text-white/70'}`}>
                      {prd.title}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{prd.idea}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/25">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDate(prd.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(prd.id, e)}
                    disabled={deletingId === prd.id}
                    className="p-1 rounded text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {deletingId === prd.id ? (
                      <Loader2 className="w-3 h-3 spinner" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                    </div>
                  </div>
              ))
            )}
          </div>
        </div>

        {/* Content viewer */}
        <div
          className={`${selectedPRD ? 'flex' : 'hidden lg:flex'} flex-1 flex-col overflow-hidden`}
        >
          {selectedPRD ? (
            <>
              {/* Viewer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPRD(null)}
                    className="lg:hidden p-2 glass rounded-lg text-white/40 hover:text-white/70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedPRD.title}</h2>
                    <p className="text-xs text-white/30">{formatDate(selectedPRD.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport(selectedPRD)}
                    className="flex items-center gap-1.5 text-xs glass glass-hover px-3 py-2 rounded-lg text-white/50 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    onClick={() => setSelectedPRD(null)}
                    className="p-2 glass glass-hover rounded-lg text-white/30 hover:text-white/60 lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
                <div className="max-w-3xl mx-auto">
                  <div className="glass rounded-2xl p-6 lg:p-8 card-glow mb-4">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span className="text-xs text-white/40">Idea: </span>
                      <span className="text-xs text-white/60">{selectedPRD.idea}</span>
                    </div>
                    <MarkdownRenderer content={selectedPRD.content} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">PRD Generator</h2>
              <p className="text-white/40 text-sm max-w-xs mb-6">
                Generate investor-grade Product Requirements Documents from a single prompt.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate PRD
                </button>
                {prds.length > 0 && (
                  <button
                    onClick={() => setSelectedPRD(prds[0])}
                    className="glass glass-hover flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/60"
                  >
                    <Eye className="w-4 h-4" />
                    View Latest
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
