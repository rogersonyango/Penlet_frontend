// src/pages/Resources3D/AddRessourcePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceFormSchema, type ResourceFormData } from '../../types/resourceSchema';
import { useCategories } from '../../hooks/useResources';
import { resourceService } from '../../services/resource';

const AddResourcePage = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      is_featured: false,
    },
  });

  const selectedFile = watch('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ResourceFormData) => {
    setSubmitting(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('subject', data.subject);
    formData.append('category_id', data.category_id.toString());
    if (data.description) formData.append('description', data.description);
    formData.append('is_featured', data.is_featured ? 'true' : 'false');
    formData.append('file', data.file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await resourceService.create(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      navigate('/resources');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to upload resource';
      setError(msg);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Category colors for variety
  const getCategoryColor = (index: number) => {
    const colors = [
      { border: 'border-purple-300', bg: 'from-purple-50 to-pink-50', text: 'text-purple-600' },
      { border: 'border-pink-300', bg: 'from-pink-50 to-cyan-50', text: 'text-pink-600' },
      { border: 'border-cyan-300', bg: 'from-cyan-50 to-green-50', text: 'text-cyan-600' },
      { border: 'border-yellow-300', bg: 'from-yellow-50 to-orange-50', text: 'text-yellow-600' },
      { border: 'border-green-300', bg: 'from-green-50 to-cyan-50', text: 'text-green-600' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-24 h-24 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed top-40 right-20 w-32 h-32 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="fixed bottom-20 left-1/4 w-28 h-28 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-bounceIn">
          <button
            onClick={() => navigate('/resources')}
            className="group mb-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-110 hover:rotate-3 transition-all duration-300"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl shadow-2xl mb-4 transform hover:rotate-12 hover:scale-110 transition-all duration-300 animate-float">
              <span className="text-5xl drop-shadow-lg">➕</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-transparent bg-clip-text mb-2 animate-pulse">
              Add 3D Resource
            </h1>
            <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
              <span className="animate-bounce">✨</span>
              Share your 3D models with the world!
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🚀</span>
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-purple-300 hover:border-pink-400 transition-all duration-300 animate-slideUp">
          {/* Icon Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
              📦
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Resource Details</h2>
              <p className="text-sm text-gray-500 font-medium">Fill in the information below</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg flex items-center gap-2 animate-shake">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📝</span>
              </div>
              <input
                type="text"
                {...register('title')}
                placeholder="Resource title..."
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 group-hover:border-purple-300"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-medium">{errors.title.message}</p>
              )}
            </div>

            {/* Subject Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📚</span>
              </div>
              <input
                type="text"
                {...register('subject')}
                placeholder="Subject (e.g., Biology, Chemistry...)"
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-cyan-50 to-purple-50 border-3 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 group-hover:border-cyan-300"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-medium">{errors.subject.message}</p>
              )}
            </div>

            {/* Category Select */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📁</span>
              </div>
              <select
                {...register('category_id', { valueAsNumber: true })}
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-pink-50 to-cyan-50 border-3 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 focus:outline-none transition-all duration-300 font-medium text-lg appearance-none cursor-pointer group-hover:border-pink-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem',
                }}
              >
                <option value="">Select a category</option>
                {Array.isArray((categories as any)?.data) ? (categories as any).data.map((cat: any, index: number) => {
                  const color = getCategoryColor(index);
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  );
                }) : null}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-medium">{errors.category_id.message}</p>
              )}
            </div>

            {/* Description Textarea */}
            <div className="group relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="text-2xl group-focus-within:scale-125 transition-transform">📋</span>
              </div>
              <textarea
                {...register('description')}
                placeholder="Describe your 3D resource..."
                rows={4}
                className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-3 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 focus:outline-none transition-all duration-300 font-medium text-lg placeholder-gray-400 resize-none group-hover:border-yellow-300"
              />
            </div>

            {/* Featured Toggle */}
            <div className="bg-gradient-to-r from-green-50 via-cyan-50 to-green-50 p-5 rounded-2xl border-3 border-green-300 hover:border-green-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform">
                    ⭐
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-lg">Featured</p>
                    <p className="text-sm text-gray-500 font-medium">Show on homepage</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="sr-only peer"
                  />
                  <div className="w-16 h-9 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content=['🙌'] after:absolute after:top-1 after:left-1 after:bg-gradient-to-r after:from-green-400 after:to-cyan-500 after:rounded-full after:h-7 after:w-7 after:transition-all after:flex after:items-center after:justify-center after:text-sm"></div>
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 p-5 rounded-2xl border-3 border-purple-300 hover:border-purple-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  📁
                </div>
                <div>
                  <p className="font-black text-gray-800 text-lg">3D Model File</p>
                  <p className="text-sm text-gray-500 font-medium">Supported: .glb, .gltf, .obj</p>
                </div>
              </div>
              <input
                type="file"
                accept=".glb,.gltf,.obj"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
              />
              {selectedFile && (
                <div className="mt-3 p-3 bg-white rounded-xl border-2 border-purple-200 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center text-xl">
                    ✅
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
              {errors.file && (
                <p className="text-red-500 text-sm mt-2 font-medium">{errors.file.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg ${
                  submitting
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-2xl">📤</span>
                    Upload Resource
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/resources')}
                className="flex-1 py-4 bg-white border-3 border-gray-300 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-lg border-4 border-cyan-200 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
              💡
            </div>
            <div>
              <h3 className="font-black text-cyan-700 text-lg mb-2">Upload Tips</h3>
              <ul className="text-gray-700 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  Use clear, descriptive titles that explain what the model represents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  Add detailed descriptions to help others understand the resource
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  Choose the most appropriate category for better discoverability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  GLB format is recommended for best compatibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default AddResourcePage;

