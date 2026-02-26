import { useState, useRef } from 'react';
import { uploadAPI } from '../utils/api';

/**
 * Reusable image uploader with drag-and-drop, preview, and URL fallback.
 *
 * Props:
 *   value   — current image URL (controlled)
 *   onChange — called with the new URL string
 *   label   — optional label text
 */
export default function ImageUploader({ value, onChange, label = 'Product Image' }) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef();

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
        setError('');
        setUploading(true);
        try {
            const res = await uploadAPI.upload(file);
            onChange(res.data.url);
        } catch {
            setError('Upload failed. Check your internet and try again.');
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div className="img-uploader">
            <label className="img-uploader-label">{label}</label>

            {/* Drop zone */}
            <div
                className={`img-drop-zone ${dragging ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => !uploading && inputRef.current.click()}
            >
                {uploading ? (
                    <div className="img-uploading-state">
                        <div className="img-spinner" />
                        <span>Uploading to Cloudinary…</span>
                    </div>
                ) : value ? (
                    <div className="img-preview-wrap">
                        <img src={value} alt="preview" className="img-preview" />
                        <div className="img-preview-overlay">
                            <span>Click or drop to change</span>
                        </div>
                    </div>
                ) : (
                    <div className="img-empty-state">
                        <div className="img-upload-icon">📷</div>
                        <p>Click or drag &amp; drop an image here</p>
                        <span>JPG, PNG, WEBP — max 5 MB</span>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
            />

            {/* URL fallback */}
            <div className="img-url-row">
                <span className="img-url-label">Or paste image URL:</span>
                <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="img-url-input"
                />
            </div>

            {error && <p className="img-error">{error}</p>}
        </div>
    );
}
