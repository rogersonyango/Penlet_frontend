// src/types/resourceSchema.ts
import { z } from 'zod';

export const resourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  category_id: z.number({ message: "Category is required" }).positive(),
  description: z.string().optional(),
  is_featured: z.boolean().optional(),
  file: z.instanceof(File, { message: "3D file is required" }).refine(
    (file) => {
      const allowed = ['glb', 'gltf', 'obj'];
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ext ? allowed.includes(ext) : false;
    },
    { message: "Only .glb, .gltf, or .obj files are allowed" }
  ),
});

export type ResourceFormData = z.infer<typeof resourceFormSchema>;