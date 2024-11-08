// Show the UI
figma.showUI(__html__, { themeColors: true, /* other options */ })

// Listen for messages from the UI
figma.ui.onmessage = (msg) => {
  // Listen to DRAW_CIRCLES message
  if (msg.type === "DRAW_CIRCLES") {
    const center = figma.viewport.center; //to center the dots in the viewport
    const OFFSET = 16; // Define offset amount

    for (let i = 0; i < msg.numberOfDots; i++) {
      const dot = figma.createFrame();

      // STYLING
      dot.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
      // Add stroke
      dot.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      dot.strokeWeight = 2;
      dot.cornerRadius = 100;
      dot.effects = [{
        type: 'DROP_SHADOW',
        color: {r: 0, g: 0, b: 0, a: 0.10}, 
        offset: {x: 4, y: 4},
        radius: 4,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL'
      }];

      

      // PLACEMENT
      // Add offset based on the dot's index
      dot.x = center.x + (i * OFFSET);
      dot.y = center.y + (i * OFFSET);
      dot.resize(50, 50);


      // scroll and zoom into view
      figma.viewport.scrollAndZoomIntoView([dot]);
    }
    
    // Notify the user
    figma.notify('Dots added and zoomed in!');
  }
};
