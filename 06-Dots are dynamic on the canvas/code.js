figma.showUI(__html__);

// When plugin starts, use let variable
let dotIds = new Set(); // Creates empty Set: {}

// Function to update the UI with the current dot count
function updateDotCount() {
    // First, Get / read and parse the stored dotCount - NB: the key "dotCount" must 
    // match the setter key to work
    const dotCount = parseInt(figma.currentPage.getPluginData("dotCount") || "0");

    // Send message to UI
    figma.ui.postMessage({ type: 'UPDATE_COUNT', count: dotCount });
    console.log("Current dot count:", dotCount);
}

// Function to increment the dot count
function incrementDotCount() {

    // First, Get / read and parse the stored dotCount
    const currentCount = parseInt(figma.currentPage.getPluginData("dotCount") || "0");

    // Then, set the dotCount to the currentCount +1 one and convert to string
    // The key (first argument) = label, the value (2nd argument) = value
    figma.currentPage.setPluginData("dotCount", (currentCount + 1).toString());

    // Finally, run the function to update the dot count
    updateDotCount();
}

// Function to decrement the dot count
function decrementDotCount() {
    const currentCount = parseInt(figma.currentPage.getPluginData("dotCount") || "0");
    if (currentCount > 0) {
        figma.currentPage.setPluginData("dotCount", (currentCount - 1).toString());
        updateDotCount();
    }
}

// Function to create a new dot
async function createDot() {
    // Get current dot count to use as the number
    const currentCount = parseInt(figma.currentPage.getPluginData("dotCount") || "0") + 1;

    // Define the object type to Frame
    const frame = figma.createFrame();
    frame.name = `Dot ${currentCount}`; // Frame name is correct

    // Styling the frame
    frame.resize(100, 100);
    frame.x = figma.viewport.center.x;
    frame.y = figma.viewport.center.y;
    frame.cornerRadius = 100;
    frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];

    // Marking the frame as a Dot
    frame.setPluginData("isDot", "true");

    // Create and style text layer
    const text = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    
    // Use currentCount for the text content
    text.characters = currentCount.toString();
    text.fontSize = 24;
    text.fontName = { family: "Inter", style: "Regular" };
    text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Add text to frame and center it
    frame.appendChild(text);
    text.x = (frame.width - text.width) / 2;
    text.y = (frame.height - text.height) / 2;

    // Add to page
    figma.currentPage.appendChild(frame);

    dotIds.add(frame.id);
    saveDotIds();
        
    return frame;
}

// ADD DOT FROM UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === "ADD_DOT") {
        try {
            const newDot = await createDot();
            figma.notify("Dot added successfully");

            // why put 'error' here
        } catch (error) {

            // What's error.message? 
            figma.notify("Error adding dot: " + error.message);
        }
    }
};

// Function to save dotIds to plugin data
function saveDotIds() {

    figma.currentPage.setPluginData("dotIds", JSON.stringify(Array.from(dotIds)));
}

// Function to load dotIds from plugin data

// Will load ID's to check if any previous dots have been made. 
function loadDotIds() {
    const savedDotIds = figma.currentPage.getPluginData("dotIds"); // Gets saved IDs
    if (savedDotIds) {
        // Replaces empty Set with new Set containing saved IDs
        dotIds = new Set(JSON.parse(savedDotIds));
    }
}

// Function to count existing dots on the current page
async function countExistingDots() {
    // 1. Find all frames marked as dots
    const allDots = figma.currentPage.findAll(node => node.type === "FRAME" && node.getPluginData("isDot") === "true");

    // 2. Create new Set with just the IDs
    dotIds = new Set(allDots.map(dot => dot.id));

    // 3. Save to permanent storage
    saveDotIds();

    // 4. Update the count
    figma.currentPage.setPluginData("dotCount", allDots.length.toString());
    
    // 5. Update text content for all dots
    for (let i = 0; i < allDots.length; i++) {
        const dot = allDots[i];
        const textNode = dot.findOne(node => node.type === "TEXT");
        if (textNode) {
            await figma.loadFontAsync(textNode.fontName);
            textNode.characters = (i + 1).toString();
            // Recenter the text
            textNode.x = (dot.width - textNode.width) / 2;
            textNode.y = (dot.height - textNode.height) / 2;
        }
    }

    updateDotCount();
}

// Function to reorder and update all dot numbers
async function reorderDots() {
    // Find all dots on the page in their current order
    const allDots = figma.currentPage.findAll(node => 
        node.type === "FRAME" && node.getPluginData("isDot") === "true"
    );

    // Update each dot with its new number
    for (let i = 0; i < allDots.length; i++) {
        const dot = allDots[i];
        const newNumber = i + 1;
        
        // Update frame name
        dot.name = `Dot ${newNumber}`;
        
        // Update text content
        const textNode = dot.findOne(node => node.type === "TEXT");
        if (textNode) {
            await figma.loadFontAsync(textNode.fontName);
            textNode.characters = newNumber.toString();
            // Recenter the text
            textNode.x = (dot.width - textNode.width) / 2;
            textNode.y = (dot.height - textNode.height) / 2;
        }
    }

    // Update the total count
    figma.currentPage.setPluginData("dotCount", allDots.length.toString());
    updateDotCount();
}

// Function to set up the document change event listener
function setupEventListener() {
    figma.on("documentchange", (event) => {
        let dotCountChanged = false;
        let newDots = [];
        let deletionOccurred = false;
        
        for (const change of event.documentChanges) {
            if (change.type === "DELETE") {
                if (dotIds.has(change.node.id)) {
                    dotIds.delete(change.node.id);
                    decrementDotCount();
                    dotCountChanged = true;
                    deletionOccurred = true;
                }
            } else if (change.type === "CREATE") {
                if (change.node.type === "FRAME" && 
                    change.node.parent === figma.currentPage && 
                    change.node.getPluginData("isDot") === "true") {
                    newDots.push(change.node);
                }
            }
        }

        // If any dots were deleted, reorder the remaining ones
        if (deletionOccurred) {
            setTimeout(async () => {
                await reorderDots();
            }, 0);
        }

        // Handle new dots
        if (newDots.length > 0) {
            setTimeout(async () => {
                for (const dot of newDots) {
                    const currentCount = parseInt(figma.currentPage.getPluginData("dotCount") || "0") + 1;
                    dot.name = `Dot ${currentCount}`;
                    
                    const textNode = dot.findOne(node => node.type === "TEXT");
                    if (textNode) {
                        await figma.loadFontAsync(textNode.fontName);
                        textNode.characters = currentCount.toString();
                        textNode.x = (dot.width - textNode.width) / 2;
                        textNode.y = (dot.height - textNode.height) / 2;
                    }

                    dotIds.add(dot.id);
                    incrementDotCount();
                    dotCountChanged = true;
                }

                if (dotCountChanged) {
                    saveDotIds();
                }
            }, 0);
        }
    });
}

// Initialize the plugin
async function initializePlugin() {
    await figma.loadAllPagesAsync();
    loadDotIds(); // Load saved dotIds
    countExistingDots();
    setupEventListener();
}

// why is this called twice, seemingly - we have an async of the same name above.
initializePlugin();