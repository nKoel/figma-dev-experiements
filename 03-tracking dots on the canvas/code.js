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
function createDot() {
    // Define the object type to Frae
    const frame = figma.createFrame();

    // Styling the frame
    frame.resize(100, 100);
    frame.x = figma.viewport.center.x;
    frame.y = figma.viewport.center.y;
    frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];

    // Marking the frame as a Dot
    frame.setPluginData("isDot", "true");

    // Adding the dot
    figma.currentPage.appendChild(frame);
    

    // is ".add" as reserved method for Sets? And explain the connection betweeen these two below lines. Why do we first add then save?
    dotIds.add(frame.id);
    saveDotIds(); // Save dotIds after adding a new dot
        
    return frame;
}

// ADD DOT FROM UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === "ADD_DOT") {
        try {
            const newDot = createDot();
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
function countExistingDots() {
    // 1. Find all frames marked as dots
    const allDots = figma.currentPage.findAll(node => node.type === "FRAME" && node.getPluginData("isDot") === "true");

    // 2. Create new Set with just the IDs
    dotIds = new Set(allDots.map(dot => dot.id));

    // 3. Save to permanent storage
    saveDotIds();

     // 4. Update the count
    figma.currentPage.setPluginData("dotCount", allDots.length.toString()); // First, set the pluginData
    updateDotCount(); // Then, run the updateDotCount function
}

// Function to set up the document change event listener
function setupEventListener() {
    figma.on("documentchange", (event) => {

        // what's the purpose of this variable?
        let dotCountChanged = false;
        
        // I don't understand the code in the () here, please explain
        for (const change of event.documentChanges) {
            if (change.type === "DELETE") {

                // how can the system see and compare the ID to pick? I don't understand this one
                if (dotIds.has(change.node.id)) {
                    dotIds.delete(change.node.id);
                    decrementDotCount();
                    dotCountChanged = true;
                    console.log("Dot deleted, ID:", change.node.id); // Add this for debugging
                }
            } else if (change.type === "CREATE") {
                // Handle creation of dots outside the plugin UI
                if (change.node.type === "FRAME" && change.node.parent === figma.currentPage) {
                    setTimeout(() => {
                        if (change.node.getPluginData("isDot") === "true") {
                            dotIds.add(change.node.id);
                            incrementDotCount();
                            dotCountChanged = true;
                            console.log("Dot created, ID:", change.node.id); // Add this for debugging
                        }
                    }, 0);
                }
            }
        }

        if (dotCountChanged) {
            saveDotIds();
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