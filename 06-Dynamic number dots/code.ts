figma.showUI(__html__);

// Handle messages from the UI
figma.ui.onmessage = msg => {
  if (msg.type === 'create-shapes') {
    // Handle UI messages here
  }
  
  // figma.closePlugin(); // Only close when you're done
}