/**
 * Simple build script to handle HTML chunks
 * 
 * Usage:
 * - Development: `node js/build.js dev` (includes WIP sections)
 * - Production: `node js/build.js prod` (excludes WIP sections)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  indexFile: 'index.html',
  chunksPattern: /<!-- INCLUDE: (.*?) -->/g,
  wipFolder: 'html_chunks/wip'
};

// Determine build mode
const buildMode = process.argv[2] || 'prod';
const includeWip = buildMode === 'dev';

console.log(`Building in ${buildMode} mode (WIP sections: ${includeWip ? 'included' : 'excluded'})`);

// Read index file
let indexContent = fs.readFileSync(config.indexFile, 'utf8');

// Find all chunk includes
const chunkMatches = [...indexContent.matchAll(config.chunksPattern)];

// Process each chunk
chunkMatches.forEach(match => {
  const [fullMatch, chunkPath] = match;
  
  // Check if this is a WIP chunk
  const isWipChunk = chunkPath.includes(config.wipFolder);
  
  // Skip WIP chunks in production mode
  if (isWipChunk && !includeWip) {
    indexContent = indexContent.replace(fullMatch, '<!-- WIP section removed for production -->');
    console.log(`Excluded WIP section: ${chunkPath}`);
    return;
  }
  
  // Try to read the chunk file
  try {
    // Make sure we're checking if the file exists with the correct path
    const absolutePath = path.resolve(process.cwd(), chunkPath);
    if (fs.existsSync(absolutePath)) {
      const chunkContent = fs.readFileSync(absolutePath, 'utf8');
      indexContent = indexContent.replace(fullMatch, chunkContent);
      console.log(`Included chunk: ${chunkPath}`);
    } else {
      console.error(`Warning: Chunk file not found: ${absolutePath}`);
      // For dev mode, we'll add a helpful comment
      if (includeWip) {
        indexContent = indexContent.replace(fullMatch, `<!-- File not found: ${chunkPath} -->`);
      }
    }
  } catch (error) {
    console.error(`Error processing chunk ${chunkPath}:`, error);
  }
});

// Write the result
const outputFile = buildMode === 'dev' ? 'index.dev.html' : 'index.html';
fs.writeFileSync(outputFile, indexContent);

console.log(`Build completed: ${outputFile}`); 