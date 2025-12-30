// src/pages/EditResourcePage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResource, useCategories } from '../../hooks/useResources';
import { resourceService } from '../../services/resource';

// Edit schema (no file required)
const editResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  category_id: z.number({ message: "Category is required" }).positive(),
  description: z.string().optional(),
  is_featured: z.boolean().optional(),
});

type EditResourceFormData = z.infer<typeof editResourceSchema>;

const EditResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const resourceId = Number(id);
  const navigate = useNavigate();
  const { data: resource, isLoading: loadingResource } = useResource(resourceId);
  const categories = useCategories();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditResourceFormData>({
    resolver: zodResolver(editResourceSchema),
  });

  // Populate form when resource loads
  useEffect(() => {
    if (resource?.data) {
      reset({
        title: resource.data.title,
        subject: resource.data.subject,
        category_id: resource.data.category?.id || 0,
        description: resource.data.description || '',
        is_featured: resource.data.is_featured,
      });
    }
  }, [resource, reset]);

  const onSubmit = async (data: EditResourceFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      await resourceService.update(resourceId, data);
      navigate(`/resources/${resourceId}`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to update resource';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingResource) return <div className="p-8">Loading...</div>;
  if (!resource?.data) return <div className="p-8 text-red-500">Resource not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Resource: {resource.data.title}</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input
            {...register('title')}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject *</label>
          <input
            {...register('subject')}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select
            {...register('category_id', { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a category</option>
            {Array.isArray(categories?.data) ? (
              (categories.data as { id: number; name: string }[]).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : null}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-center">
          <input
            {...register('is_featured')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Featured resource</label>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/resources/${resourceId}`)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResourcePage;