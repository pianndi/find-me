import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function compressImages() {
  const inputDir = 'images/raw';
  const outputDir = 'images';

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🖼️  Starting image compression (max width: 720px)...');

  try {
    // Find all image files (PNG, JPG, JPEG)
    const imageFiles = await glob(`${inputDir}/*.{png,jpg,jpeg,PNG,JPG,JPEG}`);

    console.log(`Found ${imageFiles.length} image(s) to convert to WebP`);

    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    // Process each image file
    for (const inputPath of imageFiles) {
      const fileName = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(outputDir, `${fileName}.webp`);

      // Get original file size
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;

      // Convert to WebP with max width of 720px
      await sharp(inputPath)
        .resize(720, null, {
          withoutEnlargement: true, // Don't enlarge images smaller than 720px
          fit: 'inside'
        })
        .webp({
          quality: 80,
          effort: 6
        })
        .toFile(outputPath);

      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      totalCompressedSize += compressedStats.size;

      const savings = ((originalStats.size - compressedStats.size) / originalStats.size * 100).toFixed(1);
      console.log(`✅ ${path.basename(inputPath)} → ${fileName}.webp (${savings}% smaller)`);
    }

    // Handle SVG files (copy them as is)
    const svgFiles = await glob(`${inputDir}/*.svg`);

    for (const svgPath of svgFiles) {
      const fileName = path.basename(svgPath);
      const outputPath = path.join(outputDir, fileName);
      fs.copyFileSync(svgPath, outputPath);
      console.log(`📋 Copied: ${fileName}`);
    }

    // Copy existing WebP files (resize if needed)
    const existingWebpFiles = await glob(`${inputDir}/*.webp`);

    for (const webpPath of existingWebpFiles) {
      const fileName = path.basename(webpPath);
      const outputPath = path.join(outputDir, fileName);

      // Resize WebP files to max 720px width if needed
      await sharp(webpPath)
        .resize(720, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality: 80,
          effort: 6
        })
        .toFile(outputPath);

      console.log(`📋 Processed: ${fileName}`);
    }

    // Display summary
    if (imageFiles.length > 0) {
      const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
      const originalSizeMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
      const compressedSizeMB = (totalCompressedSize / 1024 / 1024).toFixed(2);

      console.log('\n📊 Compression Summary:');
      console.log(`   Original size: ${originalSizeMB} MB`);
      console.log(`   Compressed size: ${compressedSizeMB} MB`);
      console.log(`   Total savings: ${totalSavings}%`);
    }

    console.log(`\n✅ Processed ${imageFiles.length} image(s), ${svgFiles.length} SVG(s), and ${existingWebpFiles.length} existing WebP file(s)`);
    console.log(`📁 All files saved to: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error compressing images:', error);
    process.exit(1);
  }
}

compressImages();
