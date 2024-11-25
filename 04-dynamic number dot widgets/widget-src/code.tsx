const { widget } = figma;
const { Text, useSyncedState, AutoLayout, useWidgetId, useEffect, usePropertyMenu } = widget;

function DotWidget() {
  const [count, setCount] = useSyncedState("count", 0); // Placeholder array and function to handle counts
  const widgetId = useWidgetId(); // I get a deprecated warning on 'useWidgetID' for some reason.

  // Logs the Widget ID upon mount
  useEffect(() => {
    console.log(`Current Widget ID: ${widgetId}`);
  });



  // 🚨 I have 2 functions to find and count the widgets on the current page:
  
  // Function 1️⃣ - Uses 'findWidgetNodesByWidgetId()' which recommended by the Widget API but it doesn't find any widgets
  const findWidgetsAsync = async () => {
    await figma.currentPage.loadAsync();
    const widgetNodes = figma.currentPage.findWidgetNodesByWidgetId(widgetId);
    console.log(`Found ${widgetNodes.length} widgets with ID ${widgetId}:`, 
                widgetNodes.map(node => node.id));
    return widgetNodes;
  };

  // Function 2️⃣ - Leverages a Plugin API method currentPage.findAll(). This function works but is extremely slow
  // const findWidgetsAsync = async () => {
  //   await figma.currentPage.loadAsync();
  //   const widgetNodes = figma.currentPage.findAll(node => node.type === 'WIDGET' && node.widgetId === figma.widgetId);
  //   console.log(`Found ${widgetNodes.length} widgets with ID ${figma.widgetId}:`, 
  //               widgetNodes.map(node => node.id));
  //   return widgetNodes;
  // };


  // Exposes menu on click
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'findWidgets',
        tooltip: 'Find Widgets'
      }
    ],

    // Shows an action with text 'Find Widgets' to run the function
    async ({ propertyName }) => {
      if (propertyName === 'findWidgets') {
        figma.notify('Finding widgets...');
        const allWidgets = await findWidgetsAsync();
        console.log(`All Widget IDs on this page: ${allWidgets.map(widgetNode => widgetNode.id).join(', ')}`);
        figma.notify(`Total DotWidgets: ${allWidgets.length}`);``
      }
    }
  );

  return (
    <AutoLayout
      padding={8}
      fill={'#FFF'}
      cornerRadius={50}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <Text fontSize={16} horizontalAlignText="center">
        {count}
      </Text>
    </AutoLayout>
  );
}

widget.register(DotWidget);