'use client';
import MarkdownRenderer from '@/app/components/MarkdownRenerer';
import { TableSkeleton } from '@/app/components/SkeletonsLine';
import { DeckForm, PitchDeck } from '@/app/types/interfaces';
import { api, formatDate } from '@/app/utils/helpers';
import {
  Calendar,
  ChevronLeft,
  Download,
  Eye,
  LayoutTemplate,
  Loader2,
  Plus,
  Presentation,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function PitchDeckPage() {
  const [decks, setDecks] = useState<PitchDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<PitchDeck | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<DeckForm>();
  const ideaValue = watch('idea', '');

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/pitchdeck/');
      setDecks(res.data.pitchDecks ?? []);
    } catch (err) {
      console.error('[PitchDeck] Failed to load decks:', err);
      if (axios.isAxiosError(err)) {
        console.error('[PitchDeck] Error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error('Failed to load pitch decks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const onSubmit = async (data: DeckForm) => {
    setGenerating(true);
    try {
      const res = await api.post('/pitchdeck/', data);
      setDecks((prev) => [res.data.pitchDeck, ...prev]);
      setSelectedDeck(res.data.pitchDeck);
      setShowForm(false);
      reset();
      // success('Pitch deck generated successfully!');
    } catch (err) {
      console.error('[PitchDeck] Failed to generate deck:', err);
      if (axios.isAxiosError(err)) {
        console.error('[PitchDeck] Generate error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error(err instanceof Error ? err.message : 'Failed to generate pitch deck');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await api.delete(`/pitchdeck/${id}`);
      setDecks((prev) => prev.filter((d) => d.id !== id));
      if (selectedDeck?.id === id) setSelectedDeck(null);
      // success('Pitch deck deleted');
    } catch (err) {
      console.error('[PitchDeck] Failed to delete deck:', err);
      if (axios.isAxiosError(err)) {
        console.error('[PitchDeck] Delete error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      // error('Failed to delete pitch deck');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = (deck: PitchDeck) => {
    const blob = new Blob([deck.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.replace(/\s+/g, '-').toLowerCase()}-pitch-deck.md`;
    a.click();
    URL.revokeObjectURL(url);
    // success('Pitch deck exported as Markdown');
  };

  const extractSlides = (content: string): string[] => {
    const slidePattern = /##\s+(?:Slide\s+\d+[:\-]?\s*)?(.+)/gi;
    const matches = [];
    let match;
    while ((match = slidePattern.exec(content)) !== null) {
      const title = match[1].trim();
      if (title.length < 60) matches.push(title);
      if (matches.length >= 12) break;
    }
    return matches;
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${selectedDeck ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-72 xl:w-80 flex-shrink-0 border-r border-white/[0.06] overflow-hidden`}
        >
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-lg font-bold text-white">Pitch Deck</h1>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setSelectedDeck(null);
                }}
                className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Generate
              </button>
            </div>
            <p className="text-xs text-white/30">Investor-ready pitch decks</p>
          </div>

          {/* Form */}
          {showForm && (
            <div className="p-4 border-b border-white/[0.06] bg-amber-500/5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">
                    Deck Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field text-sm py-2"
                    placeholder="e.g. Series A Pitch — Solirna AI"
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
                      required: 'Startup idea is required',
                      minLength: {
                        value: 20,
                        message: 'Please provide more detail (min 20 chars)',
                      },
                      maxLength: { value: 1000, message: 'Max 1000 characters' },
                    })}
                    className="input-field text-sm py-2 resize-none"
                    rows={4}
                    placeholder="Describe your startup: what problem it solves, your solution, target market, business model..."
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
                      Generating deck...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Pitch Deck
                    </>
                  )}
                </button>
                {generating && (
                  <p className="text-[10px] text-white/30 text-center">
                    Building your 12-slide deck... (15-30 seconds)
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Deck list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loading ? (
              <TableSkeleton rows={3} />
            ) : decks.length === 0 && !showForm ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Presentation className="w-10 h-10 text-white/15 mb-3" />
                <p className="text-sm text-white/35 mb-3">No pitch decks yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" /> Create your first deck
                </button>
              </div>
            ) : (
              decks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeck(deck);
                    setShowForm(false);
                  }}
                  className={`w-full text-left glass rounded-xl p-3.5 transition-all group ${
                    selectedDeck?.id === deck.id
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'glass-hover'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Presentation
                      className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${selectedDeck?.id === deck.id ? 'text-amber-400' : 'text-white/30'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${selectedDeck?.id === deck.id ? 'text-amber-300' : 'text-white/70'}`}
                      >
                        {deck.title}
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5 truncate">{deck.idea}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/25">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(deck.createdAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(deck.id, e)}
                      disabled={deletingId === deck.id}
                      className="p-1 rounded text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {deletingId === deck.id ? (
                        <Loader2 className="w-3 h-3 spinner" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content viewer */}
        <div
          className={`${selectedDeck ? 'flex' : 'hidden lg:flex'} flex-1 flex-col overflow-hidden`}
        >
          {selectedDeck ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedDeck(null)}
                    className="lg:hidden p-2 glass rounded-lg text-white/40 hover:text-white/70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedDeck.title}</h2>
                    <p className="text-xs text-white/30">{formatDate(selectedDeck.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport(selectedDeck)}
                    className="flex items-center gap-1.5 text-xs glass glass-hover px-3 py-2 rounded-lg text-white/50 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    onClick={() => setSelectedDeck(null)}
                    className="p-2 glass glass-hover rounded-lg text-white/30 hover:text-white/60 lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Slide nav */}
                  {extractSlides(selectedDeck.content).length > 0 && (
                    <div className="lg:w-48 xl:w-56 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] p-3 overflow-y-auto">
                      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-2 mb-2">
                        Slides
                      </p>
                      <div className="space-y-0.5">
                        {extractSlides(selectedDeck.content).map((slide, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg glass-hover cursor-default"
                          >
                            <span className="text-[10px] text-amber-400/60 font-mono w-4">
                              {i + 1}
                            </span>
                            <span className="text-[10px] text-white/45 truncate">{slide}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main content */}
                  <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
                    <div className="max-w-3xl mx-auto">
                      <div className="glass rounded-2xl p-6 lg:p-8 card-glow mb-4">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="text-xs text-white/40">Startup: </span>
                          <span className="text-xs text-white/60">{selectedDeck.idea}</span>
                        </div>
                        <MarkdownRenderer content={selectedDeck.content} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600/20 to-orange-600/10 border border-amber-500/20 flex items-center justify-center mb-5">
                <LayoutTemplate className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Pitch Deck Builder</h2>
              <p className="text-white/40 text-sm max-w-xs mb-6">
                Generate compelling 12-slide investor pitch decks with AI-crafted content and
                data-driven insights.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Build Pitch Deck
                </button>
                {decks.length > 0 && (
                  <button
                    onClick={() => setSelectedDeck(decks[0])}
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
