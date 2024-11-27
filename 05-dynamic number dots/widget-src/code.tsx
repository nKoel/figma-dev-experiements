// Import necessary components and hooks from the Figma Widget API
const { widget } = figma;
const { Text, useSyncedState, AutoLayout, useEffect, usePropertyMenu } = widget;

function DotWidget() {
  // Create a state variable 'count' initialized to 0, which syncs across instances
  const [count, setCount] = useSyncedState("count", 0);

  // useEffect hook runs after the widget mounts
  useEffect(() => {
    // Log the widget ID from the manifest file
    console.log(`Widget ID from manifest: ${figma.widgetId}`);
  });

  // Asynchronous function to find all instances of this widget on the current page
  const findWidgetsAsync = async () => {
    // Ensure the current page is fully loaded before searching
    await figma.currentPage.loadAsync();
    
    // Find all widget nodes with the same widget ID as this instance
    const widgetNodes = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId as string);
    
    // Log the number of widgets found and their node IDs
    console.log(`Found ${widgetNodes.length} widgets with Widget ID ${figma.widgetId}:`, 
                widgetNodes.map(node => node.id));
    return widgetNodes;
  };

  // Set up the property menu for the widget
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'findWidgets',
        tooltip: 'Find Widgets'
      }
    ],
    // Handler for property menu actions
    async ({ propertyName }) => {
      if (propertyName === 'findWidgets') {
        figma.notify('Finding widgets...'); // Show a notification
        const allWidgets = await findWidgetsAsync(); // Find all widget instances
        // Log all found widget IDs
        console.log(`All Widget IDs on this page: ${allWidgets.map(widgetNode => widgetNode.id).join(', ')}`);
        // Show a notification with the total count of widgets
        figma.notify(`Total DotWidgets: ${allWidgets.length}`);
      }
    }
  );

  // Return the widget's UI
  return (
    <AutoLayout
      padding={8}
      fill={'#FFF'}
      cornerRadius={50}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      onClick={() => {
        // Increment the count when clicked
        const newCount = count + 1;
        setCount(newCount);
        // Show a notification with the new count
        figma.notify(`Dot count: ${newCount}`);
      }}
    >
      <Text fontSize={16} horizontalAlignText="center">
        {count} {/* Display the current count */}
      </Text>
    </AutoLayout>
  );
}

// Register the DotWidget with Figma
widget.register(DotWidget);