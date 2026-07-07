'use client';
import { Company, CompanyForm } from '@/app/types/interfaces';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, WorkflowIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CompaniesPage({
  company,
  onClose,
  onSave,
}: {
  company?: Company;
  onClose: () => void;
  onSave: (data: CompanyForm) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyForm>({
    defaultValues: {
      name: company?.name ?? '',
      description: company?.description ?? '',
      industry: company?.industry ?? '',
    },
  });

  const [closeForm, setCloseForm] = useState(false);

  const onSubmit = async (data: CompanyForm) => {
    setSaving(true);
    try {
      console.log(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {!company ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <WorkflowIcon className="w-10 h-10 text-white/15 mb-3" />
          <p className="text-sm text-white/35 mb-3">No pitch decks yet</p>
          <button
            onClick={() => setCloseForm(true)}
            className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" /> Create your first company
          </button>
        </div>
      ) : (
        'There is company'
      )}
      {/* Create Form */}
      {closeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 w-full max-w-md card-glow fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">
                {company ? 'Edit Company' : 'New Company'}
              </h2>
              <button
                onClick={() => setCloseForm(false)}
                className="text-white/30 hover:text-white/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Company Name *
                </label>
                <input
                  {...register('name', { required: 'Company name is required' })}
                  className="input-field"
                  placeholder="e.g. Solirna AI"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Industry</label>
                <input
                  {...register('industry')}
                  className="input-field"
                  placeholder="e.g. SaaS, FinTech, HealthTech"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Brief description of your company..."
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCloseForm(false)}
                  className="flex-1 glass glass-hover py-2.5 rounded-xl text-sm text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 spinner" /> : null}
                  {saving ? 'Saving...' : company ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
