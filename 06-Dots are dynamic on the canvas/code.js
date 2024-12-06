figma.showUI(__html__);

// Initialize variables
let dotIds = new Set();
let groups = {};

// Load saved dot IDs
function loadDotIds() {
    const savedDotIds = figma.currentPage.getPluginData("dotIds");
    if (savedDotIds) {
        dotIds = new Set(JSON.parse(savedDotIds));
    }
}

// Save dot IDs
function saveDotIds() {
    figma.currentPage.setPluginData("dotIds", JSON.stringify(Array.from(dotIds)));
}

// Load saved groups
function loadGroups() {
    const savedGroups = figma.currentPage.getPluginData("groups");
    if (savedGroups) {
        try {
            groups = JSON.parse(savedGroups);
            console.log("Loaded groups:", groups);
        } catch (error) {
            console.error("Error parsing saved groups, initializing default:", error);
            initializeDefaultGroups();
        }
    } else {
        initializeDefaultGroups();
    }
}

// New helper function to initialize default groups
function initializeDefaultGroups() {
    groups = {
        "group-1": { name: "Group 1", dotCount: 0 },
        "group-2": { name: "Group 2", dotCount: 0 }
    };
    saveGroups();
}

// Save groups
function saveGroups() {
    figma.currentPage.setPluginData("groups", JSON.stringify(groups));
    console.log("Saved groups:", groups);
}

// Update dot count in UI
function updateDotCount() {
    figma.ui.postMessage({ 
        type: 'UPDATE_COUNT', 
        count: dotIds.size,
        groups: groups // Make sure we're sending the groups data
    });
    console.log("Sending update to UI:", { count: dotIds.size, groups: groups }); // Debug log
}

// Create a new dot
async function createDot(groupId = "group-1") {
    try {
        const frame = figma.createFrame();
        frame.name = `Dot ${dotIds.size + 1}`;
        frame.resize(100, 100);
        frame.x = figma.viewport.center.x;
        frame.y = figma.viewport.center.y;
        frame.cornerRadius = 100;
        frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
        
        // Wait for the frame to be fully created
        await new Promise(resolve => setTimeout(resolve, 0));
        
        frame.setPluginData("isDot", "true");
        frame.setPluginData("groupId", groupId);``

        const text = figma.createText();
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        text.characters = (dotIds.size + 1).toString();
        text.fontSize = 24;
        text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        
        frame.appendChild(text);
        text.x = (frame.width - text.width) / 2;
        text.y = (frame.height - text.height) / 2;

        figma.currentPage.appendChild(frame);
        dotIds.add(frame.id);
        saveDotIds();

        await syncGroupCounts();
        
        return frame;
    } catch (error) {
        console.error("Error in createDot:", error);
        throw error;
    }
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === "ADD_DOT") {
        try {
            const groupId = msg.groupId || "group-1";
            await createDot(groupId);
            await reorderDots();
            updateDotCount();
        } catch (error) {
            console.error("Error adding dot:", error);
        }
    } else if (msg.type === "SAVE_GROUPS") {
        groups = msg.groups;
        saveGroups();
        updateDotCount();
    } else if (msg.type === "DELETE_GROUP") {
        // Find and delete all dots belonging to the group
        const dotsToDelete = figma.currentPage.findAll(node => 
            node.type === "FRAME" && 
            node.getPluginData("isDot") === "true" &&
            node.getPluginData("groupId") === msg.groupId
        );
        
        // Remove the dots from our tracking set and delete them
        dotsToDelete.forEach(dot => {
            dotIds.delete(dot.id);
            dot.remove();
        });
        
        // Save the updated state
        saveDotIds();
        groups = msg.groups;
        saveGroups();
        
        // Make sure we update the counts
        await syncGroupCounts();
        updateDotCount();  // This will update the "You've got x Dots" text
    }
};

// Setup event listener for document changes
function setupEventListener() {
    figma.on("documentchange", async (event) => {
        try {
            let dotCountChanged = false;
            let needsReorder = false;
            
            for (const change of event.documentChanges) {
                if (change.type === "DELETE") {
                    if (dotIds.has(change.node.id)) {
                        dotIds.delete(change.node.id);
                        dotCountChanged = true;
                        needsReorder = true;
                    }
                } else if (change.type === "CREATE") {
                    const node = change.node;
                    if (node.type === "FRAME" && node.getPluginData("isDot") === "true") {
                        await new Promise(resolve => setTimeout(resolve, 0)); // Give time for node to be fully created
                        dotIds.add(node.id);
                        const groupId = node.getPluginData("groupId") || "group-1";
                        node.setPluginData("groupId", groupId);
                        dotCountChanged = true;
                        needsReorder = true;
                    }
                }
            }

            if (needsReorder) {
                await reorderDots();
                saveDotIds();
                await syncGroupCounts();
            } else if (dotCountChanged) {
                saveDotIds();
                await syncGroupCounts();
            }
        } catch (error) {
            console.log("Handled error in document change:", error);
        }
    });
}

// Sync group counts with actual dots
async function syncGroupCounts() {
    // Find all dots on the canvas
    const allDots = figma.currentPage.findAll(node => 
        node.type === "FRAME" && node.getPluginData("isDot") === "true"
    );
    
    // Reset all group counts
    for (const groupId in groups) {
        groups[groupId].dotCount = 0;
    }
    
    // Count dots per group and log each dot's group
    for (const dot of allDots) {
        const groupId = dot.getPluginData("groupId") || "group-1";
        console.log(`Dot ${dot.name} belongs to group: ${groupId}`); // Debug log
        
        if (groups[groupId]) {
            groups[groupId].dotCount += 1;
            console.log(`Incremented count for ${groupId} to ${groups[groupId].dotCount}`); // Debug log
        }
    }
    
    // Log final group state
    console.log("Final group state:", JSON.stringify(groups, null, 2));
    
    saveGroups();
    updateDotCount();
}

// Initialize plugin
async function initializePlugin() {
    console.log("Initializing plugin...");
    await figma.loadAllPagesAsync();
    loadGroups(); // Load groups first
    loadDotIds();
    await syncGroupCounts(); // This will handle counting existing dots
    setupEventListener();
    console.log("Plugin initialization complete");
}

// Start the plugin
initializePlugin();
figma.showUI(__html__);

// Reorder dots and update their numbers
async function reorderDots() {
    // First, organize dots by group
    const dotsByGroup = {};
    
    const allDots = figma.currentPage.findAll(node => 
        node.type === "FRAME" && node.getPluginData("isDot") === "true"
    );

    // Sort dots into their groups
    allDots.forEach(dot => {
        const groupId = dot.getPluginData("groupId") || "group-1";
        if (!dotsByGroup[groupId]) {
            dotsByGroup[groupId] = [];
        }
        dotsByGroup[groupId].push(dot);
    });

    // Update numbers for each group separately
    for (const groupId in dotsByGroup) {
        const groupDots = dotsByGroup[groupId];
        
        for (let i = 0; i < groupDots.length; i++) {
            const dot = groupDots[i];
            const newNumber = i + 1;
            
            dot.name = `${groups[groupId].name} Dot ${newNumber}`;
            
            const textNode = dot.findOne(node => node.type === "TEXT");
            if (textNode) {
                await figma.loadFontAsync(textNode.fontName);
                textNode.characters = newNumber.toString();
                textNode.x = (dot.width - textNode.width) / 2;
                textNode.y = (dot.height - textNode.height) / 2;
            }
        }
    }
}