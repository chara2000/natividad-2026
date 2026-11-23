import React, { useState } from 'react';
import {
  Camera,
  Heart,
  Plus,
  Share2,
  Sparkles,
  Calendar,
  X,
  Upload,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  FilterBar,
  ChipGroup,
  SearchInput,
  SortDropdown,
  MonthPicker,
} from '../ui/FilterBar';

export const MemoriesModule: React.FC = () => {
  const { memories, addMemoryPhoto, toggleLikeMemory, currentUser, activities, community } = useChristmas();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoActivity, setPhotoActivity] = useState(activities[0]?.title || 'Navidad Familiar');
  const [photoImagePreview, setPhotoImagePreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Filter state
  const [memSearch, setMemSearch] = useState('');
  const [memActivityFilter, setMemActivityFilter] = useState('');
  const [memMonth, setMemMonth] = useState<number | null>(null);
  const [memSortBy, setMemSortBy] = useState('recientes');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImageFile(file, 800, 0.72);
        setPhotoImagePreview(compressedBase64);
      } catch (err) {
        console.error('Error al comprimir foto:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;

    // Use uploaded preview or festive placeholder
    const finalUrl = photoImagePreview || 'https://images.unsplash.com/photo-1543258103-a62bdc069871?w=800&auto=format&fit=crop&q=80';

    addMemoryPhoto({
      communityId: community?.id || 'comm-navidad-2026',
      title: photoTitle,
      activityName: photoActivity,
      authorName: currentUser?.name || 'Familiar',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1543258103-a62bdc069871?w=150&auto=format&fit=crop&q=80',
      imageUrl: finalUrl,
      date: new Date().toISOString().split('T')[0],
      caption: photoCaption || '¡Recuerdo inolvidable de nuestra Navidad en familia!',
    });

    setShowUploadModal(false);
    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoImagePreview('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" /> Álbum Colaborativo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Recuerdos Navideños
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Comparte fotos de las novenas, el encendido de velitas y la cena en un solo lugar.
          </p>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            setShowUploadModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Subir Foto o Recuerdo
        </button>
      </div>

      {/* ✨ Beautiful Filter Bar */}
      <FilterBar
        label="Filtrar Recuerdos"
        activeFiltersCount={[memSearch, memActivityFilter, memMonth].filter(Boolean).length}
        onClearAll={() => {
          setMemSearch('');
          setMemActivityFilter('');
          setMemMonth(null);
          setMemSortBy('recientes');
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={memSearch}
            onChange={setMemSearch}
            placeholder="Buscar foto o recuerdo…"
          />
          <SortDropdown
            options={[
              { id: 'recientes', label: 'Más recientes' },
              { id: 'likes', label: 'Más me gustas' },
              { id: 'titulo_az', label: 'Título A-Z' },
            ]}
            value={memSortBy}
            onChange={setMemSortBy}
            label="Ordenar"
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <ChipGroup
            label="Actividad"
            options={[
              ...activities.slice(0, 5).map(act => ({
                id: act.title,
                label: act.title.length > 20 ? act.title.slice(0, 20) + '…' : act.title,
                color: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
              })),
            ]}
            value={memActivityFilter}
            onChange={setMemActivityFilter}
          />
          <MonthPicker
            value={memMonth}
            onChange={setMemMonth}
            label="Mes"
          />
        </div>
      </FilterBar>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories
          .filter(mem => {
            if (memSearch && !mem.title.toLowerCase().includes(memSearch.toLowerCase()) &&
              !(mem.caption || '').toLowerCase().includes(memSearch.toLowerCase())) return false;
            if (memActivityFilter && mem.activityName !== memActivityFilter) return false;
            if (memMonth) {
              const month = mem.date ? Number(mem.date.split('-')[1]) : 0;
              if (month !== memMonth) return false;
            }
            return true;
          })
          .sort((a, b) => {
            if (memSortBy === 'likes') return (typeof b.likes === 'number' ? b.likes : 0) - (typeof a.likes === 'number' ? a.likes : 0);
            if (memSortBy === 'titulo_az') return a.title.localeCompare(b.title);
            return (b.date || '').localeCompare(a.date || '');
          })
          .map(mem => (
          <div
            key={mem.id}
            className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-xl group hover:border-amber-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo Display */}
              <div className="relative aspect-video sm:aspect-square overflow-hidden bg-black/50">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {mem.activityName && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                    {mem.activityName}
                  </span>
                )}
              </div>

              {/* Caption & Details */}
              <div className="p-4 sm:p-5 space-y-2">
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {mem.title}
                </h3>
                <p className="text-xs text-emerald-200/70 line-clamp-2 leading-relaxed">
                  {mem.caption}
                </p>
              </div>
            </div>

            {/* Author bar & Likes */}
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={mem.authorAvatar}
                  alt={mem.authorName}
                  className="w-6 h-6 rounded-full object-cover border border-amber-400/30"
                />
                <span className="text-emerald-100 font-medium text-[11px] truncate max-w-[120px]">
                  {mem.authorName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLikeMemory(mem.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    mem.likedByCurrentUser
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                      : 'bg-black/30 text-white/60 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${mem.likedByCurrentUser ? 'fill-current' : ''}`} />
                  <span>{mem.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Subir Foto */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" /> Subir Recuerdo Familiar
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Título del Recuerdo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: La tanda de buñuelos con la abuela"
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Actividad asociada
                </label>
                <select
                  value={photoActivity}
                  onChange={e => setPhotoActivity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  {activities.map(a => (
                    <option key={a.id} value={a.title}>{a.title}</option>
                  ))}
                  <option value="Momento Espontáneo">Momento Espontáneo</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Seleccionar Fotografía
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-emerald-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-pine-950 hover:file:bg-amber-400 cursor-pointer"
                />
                {isCompressing && (
                  <p className="text-[11px] text-amber-300 font-semibold mt-1 animate-pulse flex items-center gap-1.5">
                    <span>⚡</span> Optimizando foto para que no sature la memoria...
                  </p>
                )}
                {photoImagePreview && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-amber-400/40">
                    <img src={photoImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Pie de foto / Comentario
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Qué hizo especial este momento navideño?..."
                  value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-emerald-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-pine-950 font-bold shadow-md"
                >
                  Publicar en el Álbum 📸
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
