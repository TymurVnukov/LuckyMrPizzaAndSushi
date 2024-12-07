const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 33903;

const STORAGE_DIR = './object_storage';

if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

app.get('/download/:objectId', (req, res) => {
    const objectId = req.params.objectId;
    const files = fs.readdirSync(STORAGE_DIR);
    
    const file = files.find(f => f.startsWith(objectId));
    if (file) {
        const filePath = path.join(STORAGE_DIR, file);
           res.download(filePath, file, (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
    } else {
        res.status(404).json({ error: 'Object not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
