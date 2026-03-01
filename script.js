const photoInput = document.getElementById('photo-input');
const fileNameLabel = document.getElementById('file-name');
const statusText = document.getElementById('status');
const imagePreview = document.getElementById('image-preview');
const previewPlaceholder = document.getElementById('preview-placeholder');
const metadataOutput = document.getElementById('metadata-output');
const editor = document.getElementById('editor');
const readButton = document.getElementById('read-metadata-btn');
const applyEditsButton = document.getElementById('apply-edits-btn');
const removeMetadataButton = document.getElementById('remove-metadata-btn');
const uploadZone = document.getElementById('upload-zone');
const libraryStatus = document.getElementById('library-status');

let exifrLib = window.exifr;
let piexifLib = window.piexif;

const EDITABLE_FIELDS = [
    { key: 'ImageDescription', ifd: '0th', tag: piexifLib?.ImageIFD?.ImageDescription ?? 270, label: 'Description' },
    { key: 'Artist', ifd: '0th', tag: piexifLib?.ImageIFD?.Artist ?? 315, label: 'Artist' },
    { key: 'Copyright', ifd: '0th', tag: piexifLib?.ImageIFD?.Copyright ?? 33432, label: 'Copyright' },
    { key: 'Make', ifd: '0th', tag: piexifLib?.ImageIFD?.Make ?? 271, label: 'Camera Make' },
    { key: 'Model', ifd: '0th', tag: piexifLib?.ImageIFD?.Model ?? 272, label: 'Camera Model' },
    { key: 'Software', ifd: '0th', tag: piexifLib?.ImageIFD?.Software ?? 305, label: 'Software' },
    { key: 'DateTimeOriginal', ifd: 'Exif', tag: piexifLib?.ExifIFD?.DateTimeOriginal ?? 36867, label: 'Date Time Original (YYYY:MM:DD HH:MM:SS)' },
    { key: 'LensModel', ifd: 'Exif', tag: piexifLib?.ExifIFD?.LensModel ?? 42036, label: 'Lens Model' }
];

let currentFile = null;
let currentDataUrl = '';
let currentExif = null;

function setStatus(message, type = 'info') {
    statusText.textContent = message;
    statusText.className = `status ${type}`;
}

function setLibraryStatus() {
    if (exifrLib && piexifLib) {
        libraryStatus.textContent = 'Metadata libraries ready.';
        return;
    }
    if (exifrLib && !piexifLib) {
        libraryStatus.textContent = 'Reader ready. Edit/remove library missing.';
        return;
    }
    if (!exifrLib && piexifLib) {
        libraryStatus.textContent = 'Editor ready. Reader library missing.';
        return;
    }
    libraryStatus.textContent = 'Metadata libraries not loaded yet.';
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Could not load ${src}`));
        document.head.appendChild(script);
    });
}

async function ensureLibraries() {
    if (!exifrLib) {
        const exifrSources = [
            'https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/full.umd.js',
            'https://unpkg.com/exifr@7.1.3/dist/full.umd.js'
        ];

        for (const src of exifrSources) {
            try {
                await loadScript(src);
                exifrLib = window.exifr;
                if (exifrLib) break;
            } catch {
                continue;
            }
        }
    }

    if (!piexifLib) {
        const piexifSources = [
            'https://cdn.jsdelivr.net/npm/piexifjs@1.0.6/piexif.min.js',
            'https://unpkg.com/piexifjs@1.0.6/piexif.js'
        ];

        for (const src of piexifSources) {
            try {
                await loadScript(src);
                piexifLib = window.piexif;
                if (piexifLib) break;
            } catch {
                continue;
            }
        }
    }

    setLibraryStatus();
}

function isJpeg(file) {
    return ['image/jpeg', 'image/jpg'].includes(file.type) || /\.jpe?g$/i.test(file.name);
}

function toDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsDataURL(file);
    });
}

function downloadDataUrl(dataUrl, name) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function baseName(filename) {
    const parts = filename.split('.');
    if (parts.length === 1) return filename;
    parts.pop();
    return parts.join('.');
}

function clearEditor() {
    editor.innerHTML = '';
}

function createEditorFields(exifData) {
    clearEditor();

    EDITABLE_FIELDS.forEach((field) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'field';

        const label = document.createElement('label');
        label.setAttribute('for', `field-${field.key}`);
        label.textContent = field.label;

        const input = document.createElement('input');
        input.id = `field-${field.key}`;
        input.dataset.ifd = field.ifd;
        input.dataset.tag = String(field.tag);
        input.value = exifData?.[field.key] ?? '';

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        editor.appendChild(wrapper);
    });
}

async function readMetadata() {
    if (!currentFile) {
        setStatus('Select a photo first.', 'error');
        return;
    }

    if (!exifrLib) {
        metadataOutput.textContent = JSON.stringify({
            fileName: currentFile.name,
            fileType: currentFile.type || 'unknown',
            fileSizeBytes: currentFile.size,
            message: 'Metadata reader library unavailable.'
        }, null, 2);
        setStatus('Image loaded, but metadata reader is unavailable. Check internet/CDN access.', 'error');
        clearEditor();
        return;
    }

    setStatus('Reading metadata...', 'info');

    try {
        const metadata = await exifrLib.parse(currentFile, true);
        metadataOutput.textContent = metadata
            ? JSON.stringify(metadata, null, 2)
            : 'No metadata found in this file.';

        createEditorFields(metadata || {});
        setStatus('Metadata loaded. You can edit fields and download a new file.', 'success');
    } catch (error) {
        metadataOutput.textContent = 'Could not parse metadata.';
        clearEditor();
        setStatus(`Metadata read failed: ${error.message}`, 'error');
    }
}

function applyEditsAndDownload() {
    if (!currentFile || !currentDataUrl) {
        setStatus('Select a photo first.', 'error');
        return;
    }

    if (!isJpeg(currentFile)) {
        setStatus('Editing EXIF is currently supported for JPEG files.', 'error');
        return;
    }

    if (!piexifLib) {
        setStatus('Metadata editor failed to load. Refresh the page and try again.', 'error');
        return;
    }

    try {
        const exif = piexifLib.load(currentDataUrl);
        const inputs = editor.querySelectorAll('input');

        inputs.forEach((input) => {
            const ifd = input.dataset.ifd;
            const tag = Number(input.dataset.tag);
            const value = input.value.trim();

            if (!value) {
                delete exif[ifd][tag];
            } else {
                exif[ifd][tag] = value;
            }
        });

        const exifBytes = piexifLib.dump(exif);
        const output = piexifLib.insert(exifBytes, currentDataUrl);
        downloadDataUrl(output, `${baseName(currentFile.name)}-edited.jpg`);
        setStatus('Edited image downloaded.', 'success');
    } catch (error) {
        setStatus(`Could not apply edits: ${error.message}`, 'error');
    }
}

function removeMetadataAndDownload() {
    if (!currentFile || !currentDataUrl) {
        setStatus('Select a photo first.', 'error');
        return;
    }

    if (!isJpeg(currentFile)) {
        setStatus('Metadata removal in this version supports JPEG files.', 'error');
        return;
    }

    if (!piexifLib) {
        setStatus('Metadata remover failed to load. Refresh the page and try again.', 'error');
        return;
    }

    try {
        const cleaned = piexifLib.remove(currentDataUrl);
        downloadDataUrl(cleaned, `${baseName(currentFile.name)}-clean.jpg`);
        setStatus('Metadata removed and cleaned image downloaded.', 'success');
    } catch (error) {
        setStatus(`Could not remove metadata: ${error.message}`, 'error');
    }
}

async function handleSelectedFile(file) {
    currentFile = file || null;
    currentExif = null;

    if (!file) {
        fileNameLabel.textContent = 'No file selected';
        imagePreview.hidden = true;
        previewPlaceholder.hidden = false;
        clearEditor();
        metadataOutput.textContent = 'No metadata loaded yet.';
        readButton.disabled = true;
        applyEditsButton.disabled = true;
        removeMetadataButton.disabled = true;
        return;
    }

    if (!file.type.startsWith('image/')) {
        setStatus('Please select a valid image file.', 'error');
        return;
    }

    fileNameLabel.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    setStatus('Loading image...', 'info');

    try {
        currentDataUrl = await toDataURL(file);
        imagePreview.src = currentDataUrl;
        imagePreview.hidden = false;
        previewPlaceholder.hidden = true;

        readButton.disabled = false;
        applyEditsButton.disabled = !isJpeg(file);
        removeMetadataButton.disabled = !isJpeg(file);

        if (!isJpeg(file)) {
            setStatus('Image loaded. Read works for many formats; edit/remove are enabled for JPEG only.', 'info');
        } else {
            setStatus('Image loaded. Reading metadata...', 'info');
        }

        await readMetadata();
    } catch (error) {
        setStatus(`Failed to load file: ${error.message}`, 'error');
    }
}

photoInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    await handleSelectedFile(file);
});

uploadZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadZone.classList.add('active');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('active');
});

uploadZone.addEventListener('drop', async (event) => {
    event.preventDefault();
    uploadZone.classList.remove('active');
    const file = event.dataTransfer?.files?.[0];
    if (file) {
        await handleSelectedFile(file);
    }
});

readButton.addEventListener('click', readMetadata);
applyEditsButton.addEventListener('click', applyEditsAndDownload);
removeMetadataButton.addEventListener('click', removeMetadataAndDownload);

(async function init() {
    await ensureLibraries();
    setLibraryStatus();
    setStatus('Ready. Upload an image to start.', 'info');
})();
