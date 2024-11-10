const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const ExifTransformer = require('exif-be-gone')

const directoryPath = path.join(__dirname, '.');

function removeExifData(filePath) {
    const tempFilePath = `${filePath}.tmp`;
    const reader = fs.createReadStream(filePath);
    const writer = fs.createWriteStream(tempFilePath);

    reader.pipe(new ExifTransformer()).pipe(writer).on('finish', () => {
        fs.stat(tempFilePath, (err, tempStats) => {
            if (err) {
                console.error(`Unable to stat temp file: ${err}`);
                return;
            }

            fs.stat(filePath, (err, originalStats) => {
                if (err) {
                    console.error(`Unable to stat original file: ${err}`);
                    return;
                }

                if (tempStats.size !== originalStats.size) {
                    fs.rename(tempFilePath, filePath, (err) => {
                        if (err) {
                            console.error(`Unable to rename temp file: ${err}`);
                            return;
                        }
                        console.log(`Removed EXIF data from ${filePath}`);
                    });
                } else {
                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error(`Unable to delete temp file: ${err}`);
                        }
                    });
                }
            });
        });
    });
}

function processDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Unable to scan directory: ${err}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Unable to stat file: ${err}`);
                    return;
                }

                if (stats.isDirectory()) {
                    if (file !== 'public' && file !== 'themes') {
                        processDirectory(filePath);
                    }
                } else if (/\.(jpg|jpeg|png|gif|tiff)$/i.test(file)) {
                    removeExifData(filePath);
                }
            });
        });
    });
}

processDirectory(directoryPath);