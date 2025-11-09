import cloudinary from './cloudinaryConfig.js';
import { ApiError } from './apiError.js';
import { Readable } from 'stream';

// Supports multer memoryStorage by streaming buffer to Cloudinary
const uploadToCloudinary = async (file, folder = 'avatars') => {
    try {
        if (!file) throw new ApiError(400, 'No file provided');

        // If a path exists (diskStorage), use direct upload
        if (file.path) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
                resource_type: 'auto'
            });
            return { public_id: result.public_id, url: result.secure_url };
        }

        // Otherwise, stream the in-memory buffer (memoryStorage)
        if (file.buffer) {
            if (!file.buffer.length) {
                throw new ApiError(400, 'Empty file buffer');
            }
            const result = await new Promise((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream(
                    { folder, resource_type: 'image' },
                    (error, res) => {
                        if (error) return reject(error);
                        return resolve(res);
                    }
                );
                const readable = Readable.from(file.buffer);
                readable.on('error', reject);
                readable.pipe(upload);
            });
            return { public_id: result.public_id, url: result.secure_url };
        }

        throw new ApiError(400, 'Unsupported file input for upload');
    } catch (error) {
        const message = error?.message || 'Cloudinary upload failed';
        throw new ApiError(500, 'Error uploading file to Cloudinary', [message]);
    }
};

export default uploadToCloudinary;