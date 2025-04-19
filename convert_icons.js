const fs = require('fs');
const sharp = require('sharp');

async function convertSvgToPng(inputFile, outputFile, size) {
    const svgBuffer = fs.readFileSync(inputFile);
    await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
}

async function convertIcons() {
    const sizes = [16, 48, 128];
    
    for (const size of sizes) {
        await convertSvgToPng(
            `icons/icon${size}.svg`,
            `icons/icon${size}.png`,
            size
        );
        console.log(`Converted icon${size}.svg to icon${size}.png`);
    }
}

convertIcons().catch(console.error); 