import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface StorageUploadResult {
  path: string;
  url: string;
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export const storageService = {
  /**
   * Uploads an image to the local uploads directory.
   * @param file Buffer of the file to upload
   * @param fileName Original file name
   * @param folder Optional folder name (e.g., container ID)
   */
  async uploadImage(file: Buffer, fileName: string, folder: string = 'general'): Promise<StorageUploadResult> {
    const fileExt = fileName.split('.').pop();
    const fileNameClean = uuidv4();
    const fileNameFinal = `${fileNameClean}.${fileExt}`;

    const folderPath = path.join(UPLOADS_DIR, folder);
    await fs.mkdir(folderPath, { recursive: true });

    const fullPath = path.join(folderPath, fileNameFinal);
    await fs.writeFile(fullPath, file);

    // The public URL is relative to the public folder
    const publicPath = `/uploads/${folder}/${fileNameFinal}`;

    return {
      path: publicPath,
      url: publicPath,
    };
  },

  /**
   * Deletes an image from the local uploads directory.
   * @param path The public path of the file to delete
   */
  async deleteImage(publicPath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), 'public', publicPath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Local delete error: ${error}`);
      // We don't throw here so that DB deletion can still proceed if file is already gone
    }
  },

  /**
   * Returns the public URL for a given path.
   */
  getPublicUrl(publicPath: string): string {
    return publicPath;
  },

  getContentType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  },
};
