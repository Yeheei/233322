const fs = require('fs');
const path = require('path');

const wallpaperDir = path.join(__dirname, '登录页壁纸');
const outputFilePath = path.join(__dirname, 'wallpaper-list.js');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

console.log('Starting to generate wallpaper list...');

try {
    // Check if the directory exists
    if (!fs.existsSync(wallpaperDir)) {
        console.log('Directory "登录页壁纸" not found. Creating an empty wallpaper list.');
        const fileContent = 'const backgroundImages = [];';
        fs.writeFileSync(outputFilePath, fileContent, 'utf8');
        console.log('Successfully generated an empty wallpaper-list.js.');
        return;
    }

    const files = fs.readdirSync(wallpaperDir);

    const imageFiles = files.filter(file => {
        return imageExtensions.includes(path.extname(file).toLowerCase());
    }).map(file => {
        // Use forward slashes for web paths, which is compatible everywhere.
        return `登录页壁纸/${file}`.replace(/\\/g, '/');
    });

    // Using JSON.stringify for proper escaping of characters in filenames.
    const fileContent = `const backgroundImages = ${JSON.stringify(imageFiles, null, 4)};`;

    fs.writeFileSync(outputFilePath, fileContent, 'utf8');

    console.log(`Successfully generated wallpaper-list.js with ${imageFiles.length} images.`);

} catch (error) {
    console.error('Error generating wallpaper list:', error);
    // As a fallback, create an empty list to prevent site errors.
    const fileContent = 'const backgroundImages = [];';
    fs.writeFileSync(outputFilePath, fileContent, 'utf8');
}