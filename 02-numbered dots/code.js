figma.showUI(__html__, { themeColors: true, /* other options */ })


// Creating the Single Frame
async function createDotWithNumber(number) {
    const dot = figma.createFrame();
    dot.name = `Dot ${number}`;
    dot.resize(48  , 48);
      dot.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
      // Add stroke
      dot.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 0 } }];
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

    const dotNumber = figma.createText();
    dotNumber.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // Set text properties
    dotNumber.characters = number.toString();
    dotNumber.fontSize = 24;
    dotNumber.fontName = { family: "Inter", style: "Regular" };

    // Center the text in the frame
    dotNumber.x = (dot.width - dotNumber.width) / 2;
    dotNumber.y = (dot.height - dotNumber.height) / 2;

    dot.appendChild(dotNumber); 

    return dot; 
}

// Adding and placing the frames
async function appendDotsToCanvas(count) { //value of numDots is assigned to count
    const center = figma.viewport.center; //to center the dots in the viewport
    const OFFSET = 16; // Define offset amount

    for (let i = 1; i <= count; i++) {
        // Create a frame with a number
        const dot = await createDotWithNumber(i);
        dot.x = center.x + (i * OFFSET);
      dot.y = center.y + (i * OFFSET);
        figma.currentPage.appendChild(dot);
    }
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'BUTTON_CLICKED') {
        const numDots = msg.dotsToCreate; // Get the number of dots from the message
        await appendDotsToCanvas(numDots); // Passes the number to appendDotsToCanvas
    }
}