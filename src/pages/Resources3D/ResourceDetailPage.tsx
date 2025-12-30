// src/pages/Resources3D/ResourceDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResource } from '../../hooks/useResources';
import { resourceService } from '../../services/resource';
import { formatDate } from '../../utils/formatDate';

interface Category {
  id: number;
  name: string;
}

interface RelatedResource {
  id: number;
  title: string;
  file_format?: string | null;
}

interface ResourceData {
  id: number;
  title: string;
  subject?: string | null;
  is_featured?: boolean;
  category?: Category | null;
  file_format?: string | null;
  view_count?: number | null;
  created_at?: string | null;
  file_size?: number | null;
  description?: string | null;
  related_resources?: RelatedResource[] | null;
}

interface ResourceResponse {
  data: ResourceData;
}

const ResourceDetail = (): JSX.Element => {
  const { id } = useParams<{ id?: string }>();
  const resourceId = Number(id);
  const navigate = useNavigate();
  const { data: resource, isLoading, error } = useResource(resourceId);
  const [trackingError, setTrackingError] = useState<Error | null>(null);

  useEffect(() => {
    if (resourceId) {
      resourceService.trackView(resourceId).catch((err: Error) => {
        // store tracking errors silently for debugging if needed
        setTrackingError(err as Error);
      });
    }
  }, [resourceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-purple-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Loading resource...
          </p>
        </div>
      </div>
    );
  }

  if (error || !resource?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-red-400 max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <p className="text-xl font-bold text-red-600 text-center">Resource not found</p>
          <button
            onClick={() => navigate('/resources')}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ← Back to Resources
          </button>
        </div>
      </div>
    );
  }

  const resourceData = resource.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/resources')}
          className="mb-6 px-6 py-3 bg-white border-3 border-purple-300 text-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base hover:border-purple-400 animate-slideDown"
        >
          ← Back to Resources
        </button>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-purple-300 overflow-hidden animate-slideUp" style={{ animationDelay: '100ms' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                🎯
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {resourceData.is_featured && (
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-800 rounded-full text-xs font-bold border-2 border-yellow-500">
                      ⭐ Featured
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/30 text-white rounded-full text-xs font-bold border-2 border-white/50">
                    {resourceData.category?.name || 'Uncategorized'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  {resourceData.title}
                </h1>
                <p className="text-white/90 font-medium mt-2 flex items-center gap-2">
                  <span>📚</span>
                  {resourceData.subject}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl text-center border-2 border-purple-200">
                <div className="text-2xl mb-1">📥</div>
                <p className="text-xs text-gray-600 font-bold uppercase">Format</p>
                <p className="font-black text-purple-600">{resourceData.file_format?.toUpperCase()}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-100 to-purple-100 p-4 rounded-2xl text-center border-2 border-cyan-200">
                <div className="text-2xl mb-1">👁️</div>
                <p className="text-xs text-gray-600 font-bold uppercase">Views</p>
                <p className="font-black text-cyan-600">{resourceData.view_count || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-yellow-100 p-4 rounded-2xl text-center border-2 border-pink-200">
                <div className="text-2xl mb-1">📅</div>
                <p className="text-xs text-gray-600 font-bold uppercase">Added</p>
                <p className="font-black text-pink-600">{formatDate(resourceData.created_at)}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-cyan-100 p-4 rounded-2xl text-center border-2 border-yellow-200">
                <div className="text-2xl mb-1">📦</div>
                <p className="text-xs text-gray-600 font-bold uppercase">Size</p>
                <p className="font-black text-yellow-600">{((resourceData.file_size ?? 0) / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Description
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border-3 border-purple-200">
                <p className="text-gray-700 font-medium leading-relaxed">
                  {resourceData.description || 'No description available for this resource.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={resourceService.downloadUrl(resourceData.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">📥</span>
                Download {resourceData.file_format?.toUpperCase()}
              </a>
              <button
                onClick={() => navigate(`/resources/${resourceData.id}/edit`)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">✏️</span>
                Edit Resource
              </button>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {resourceData.related_resources?.length > 0 && (
          <div className="mt-8 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              Related Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resourceData.related_resources!.map((related: RelatedResource) => (
                <button
                  key={related.id}
                  onClick={() => navigate(`/resources/${related.id}`)}
                  className="bg-white p-4 rounded-2xl shadow-lg border-3 border-cyan-200 hover:border-cyan-400 transform hover:scale-102 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                      📦
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{related.title}</p>
                      <p className="text-xs text-gray-500">{related.file_format?.toUpperCase()}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .border-3 {
          border-width: 3px;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ResourceDetail;

