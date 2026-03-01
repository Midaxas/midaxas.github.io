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

const EDITABLE_FIELDS = [
    { key: 'ImageDescription', ifd: '0th', tag: piexif.ImageIFD.ImageDescription, label: 'Description' },
    { key: 'Artist', ifd: '0th', tag: piexif.ImageIFD.Artist, label: 'Artist' },
    { key: 'Copyright', ifd: '0th', tag: piexif.ImageIFD.Copyright, label: 'Copyright' },
    { key: 'Make', ifd: '0th', tag: piexif.ImageIFD.Make, label: 'Camera Make' },
    { key: 'Model', ifd: '0th', tag: piexif.ImageIFD.Model, label: 'Camera Model' },
    { key: 'Software', ifd: '0th', tag: piexif.ImageIFD.Software, label: 'Software' },
    { key: 'DateTimeOriginal', ifd: 'Exif', tag: piexif.ExifIFD.DateTimeOriginal, label: 'Date Time Original (YYYY:MM:DD HH:MM:SS)' },
    { key: 'LensModel', ifd: 'Exif', tag: piexif.ExifIFD.LensModel, label: 'Lens Model' }
];

let currentFile = null;
let currentDataUrl = '';
let currentExif = null;

function setStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.style.color = isError ? '#fca5a5' : '#93c5fd';
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
        setStatus('Select a photo first.', true);
        return;
    }

    setStatus('Reading metadata...');

    try {
        const metadata = await exifr.parse(currentFile, true);
        metadataOutput.textContent = metadata
            ? JSON.stringify(metadata, null, 2)
            : 'No metadata found in this file.';

        createEditorFields(metadata || {});
        setStatus('Metadata loaded. You can edit fields and download a new file.');
    } catch (error) {
        metadataOutput.textContent = 'Could not parse metadata.';
        clearEditor();
        setStatus(`Metadata read failed: ${error.message}`, true);
    }
}

function applyEditsAndDownload() {
    if (!currentFile || !currentDataUrl) {
        setStatus('Select a photo first.', true);
        return;
    }

    if (!isJpeg(currentFile)) {
        setStatus('Editing EXIF is currently supported for JPEG files.', true);
        return;
    }

    try {
        const exif = piexif.load(currentDataUrl);
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

        const exifBytes = piexif.dump(exif);
        const output = piexif.insert(exifBytes, currentDataUrl);
        downloadDataUrl(output, `${baseName(currentFile.name)}-edited.jpg`);
        setStatus('Edited image downloaded.');
    } catch (error) {
        setStatus(`Could not apply edits: ${error.message}`, true);
    }
}

function removeMetadataAndDownload() {
    if (!currentFile || !currentDataUrl) {
        setStatus('Select a photo first.', true);
        return;
    }

    if (!isJpeg(currentFile)) {
        setStatus('Metadata removal in this version supports JPEG files.', true);
        return;
    }

    try {
        const cleaned = piexif.remove(currentDataUrl);
        downloadDataUrl(cleaned, `${baseName(currentFile.name)}-clean.jpg`);
        setStatus('Metadata removed and cleaned image downloaded.');
    } catch (error) {
        setStatus(`Could not remove metadata: ${error.message}`, true);
    }
}

photoInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
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

    fileNameLabel.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    setStatus('Loading image...');

    try {
        currentDataUrl = await toDataURL(file);
        imagePreview.src = currentDataUrl;
        imagePreview.hidden = false;
        previewPlaceholder.hidden = true;

        readButton.disabled = false;
        applyEditsButton.disabled = !isJpeg(file);
        removeMetadataButton.disabled = !isJpeg(file);

        if (!isJpeg(file)) {
            setStatus('Image loaded. Read works for many formats; edit/remove are enabled for JPEG only.');
        } else {
            setStatus('Image loaded. Click "Read Metadata" to begin.');
        }
    } catch (error) {
        setStatus(`Failed to load file: ${error.message}`, true);
    }
});

readButton.addEventListener('click', readMetadata);
applyEditsButton.addEventListener('click', applyEditsAndDownload);
removeMetadataButton.addEventListener('click', removeMetadataAndDownload);
