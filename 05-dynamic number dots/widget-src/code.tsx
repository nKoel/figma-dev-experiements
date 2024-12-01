// Import necessary components and hooks from the Figma Widget API
const { widget } = figma;
const { Text, useSyncedState, AutoLayout, useEffect, usePropertyMenu } = widget;

function DotWidget() {
  const [count, setCount] = useSyncedState<number>("count", 1);
  const [orderedWidgets, setOrderedWidgets] = useSyncedState<Array<{
    id: string,
    number: number
  }>>("orderedWidgets", []);

  const findWidgetsAsync = async () => {
    await figma.currentPage.loadAsync();
    const widgetNodes = figma.currentPage.findWidgetNodesByWidgetId(figma.widgetId as string);
    const currentIds = new Set(widgetNodes.map(node => node.id));
    
    console.log('Starting update:', {
      currentIds: Array.from(currentIds),
      orderedWidgets
    });

    let updatedWidgets = [...orderedWidgets];
    
    // Remove widgets that no longer exist
    updatedWidgets = updatedWidgets.filter(widget => currentIds.has(widget.id));
    
    // Find widgets that need numbers
    const numberedIds = new Set(updatedWidgets.map(w => w.id));
    const newWidgetIds = Array.from(currentIds).filter(id => !numberedIds.has(id));
    
    // If we have new widgets, assign them the next available numbers
    if (newWidgetIds.length > 0) {
      const nextNumber = updatedWidgets.length > 0
        ? Math.max(...updatedWidgets.map(w => w.number)) + 1
        : 1;
        
      newWidgetIds.forEach((id, index) => {
        updatedWidgets.push({
          id,
          number: nextNumber + index
        });
      });
    }
    
    console.log('Updated widgets:', updatedWidgets);
    setOrderedWidgets(updatedWidgets);
    
    // Update each widget's displayed number
    widgetNodes.forEach(node => {
      const widget = updatedWidgets.find(w => w.id === node.id);
      if (widget) {
        node.setWidgetSyncedState({ count: widget.number });
      }
    });
  };

  // Set up the property menu
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'findWidgets',
        tooltip: 'Update dotsss'
      }
    ],
    async ({ propertyName }) => {
      if (propertyName === 'findWidgets') {
        await findWidgetsAsync();
      }
    }
  );

  // Widget UI remains the same
  return (
    <AutoLayout
      minHeight={32}
      minWidth={32}
      padding={6}
      fill={'#FFF'}
      cornerRadius={50}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <Text fontSize={16} horizontalAlignText="center" fontWeight={500}>
        {count}
      </Text>
    </AutoLayout>
  );
}

widget.register(DotWidget);