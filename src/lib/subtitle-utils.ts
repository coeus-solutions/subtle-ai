export async function convertSrtToVtt(srtUrl: string): Promise<string> {
  try {
    // Fetch the SRT content
    const response = await fetch(srtUrl);
    const srtContent = await response.text();

    // Add WebVTT header
    let vttContent = 'WEBVTT\n\n';

    // Split content into subtitle blocks
    const blocks = srtContent.trim().split('\n\n');

    // Convert each subtitle block
    const convertedBlocks = blocks.map(block => {
      const lines = block.split('\n');
      
      // Remove the subtitle number (first line)
      lines.shift();

      // Convert timestamp format from SRT to VTT
      if (lines[0]) {
        lines[0] = lines[0].replace(/,/g, '.');
      }

      return lines.join('\n');
    });

    vttContent += convertedBlocks.join('\n\n');

    // Create a Blob with the VTT content
    const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
    
    // Create an object URL for the Blob
    return URL.createObjectURL(vttBlob);
  } catch (error) {
    console.error('Error converting SRT to VTT:', error);
    throw error;
  }
} 
