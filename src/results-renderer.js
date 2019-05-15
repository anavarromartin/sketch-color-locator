import sketch from "sketch";

const pluginName = __command.pluginBundle().name();
const panelHeader = 44;
const panelFooter = 0;
const panelHeight = panelHeader + 448 + panelFooter;
const panelWidth = 350;
const panelGutter = 15;

export const displaySearchResultsAndColor = (color, searchResults) => {
    const fiber = sketch.Async.createFiber();

    const panel = createFloatingPanel(pluginName, NSMakeRect(0, 0, panelWidth, panelHeight));

    const panelClose = panel.standardWindowButton(NSWindowCloseButton);

    panelClose.setCOSJSTargetFunction(() => {
        panel.close();
        fiber.cleanup();
    });

    const panelContent = createView(NSMakeRect(0, 0, panelWidth, panelHeight - panelHeader));

    const colorText = createTextLabel(`Instances of ${color}`, NSMakeRect(46, 10, panelWidth, panelHeader), 18);
    const colorLabel = createColorLabel(color, NSMakeRect(5, 5, 34, 34));

    const instanceList = createScrollView(1, NSMakeRect(0, panelHeader, panelWidth, 384));
    [colorLabel, colorText, instanceList].forEach(view => panelContent.addSubview(view));

    displayColorInstances(instanceList, searchResults);

    panel.contentView().addSubview(panelContent);
};

const createFloatingPanel = (title, frame) => {
    const panel = NSPanel.alloc().init();

    panel.setTitle(title);
    panel.setFrame_display(frame, true);
    panel.setStyleMask(NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask);
    panel.setBackgroundColor(NSColor.whiteColor());
    panel.setLevel(NSFloatingWindowLevel);
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
    panel.makeKeyAndOrderFront(null);
    panel.center();

    return panel;
};

const displayColorInstances = (parent, instances) => {
    const instanceHeight = 96;
    const instanceWidth = panelWidth - panelGutter;
    const instanceContent = createView(NSMakeRect(0, 0, instanceWidth, instanceHeight * instances.length));
    const leftColWidth = 140;
    const rightColPad = 8
    const rightColWidth = instanceWidth - leftColWidth - rightColPad;
    const rightColX = 5;
    let count = 0;

    instances.forEach(instance => {
        const listItem = createView(NSMakeRect(0, instanceHeight * count, instanceWidth, instanceHeight));

        const instanceLabel = createTextLabel('Page', NSMakeRect(rightColX, 6, rightColWidth, 14));
        const instanceField = createTextField(instance.page.name, NSMakeRect(rightColX, 18, rightColWidth, 18));
        const artboardLabel = createTextLabel('Artboard', NSMakeRect(rightColX, 34, rightColWidth, 14));
        const artboardField = createTextField((instance.artboard) ? instance.artboard.name : 'None', NSMakeRect(rightColX, 46, rightColWidth, 18));
        const layerLabel = createTextLabel('Layer', NSMakeRect(rightColX, 62, rightColWidth, 14));
        const layerField = createTextField(instance.layer.name, NSMakeRect(rightColX, 74, rightColWidth, 18));
        const divider = createDivider(NSMakeRect(0, instanceHeight - 1, instanceWidth, 1));

        [artboardLabel, artboardField, instanceLabel, instanceField, layerLabel, layerField, divider].forEach(i => listItem.addSubview(i));

        instanceContent.addSubview(listItem);

        count++;
    });

    parent.setDocumentView(instanceContent);
};

const createDivider = frame => {
    const divider = NSView.alloc().initWithFrame(frame);

    divider.setWantsLayer(1);
    divider.layer().setBackgroundColor(CGColorCreateGenericRGB(204 / 255, 204 / 255, 204 / 255, 1.0));

    return divider;
};

const createTextField = (string, frame) => {
    const field = NSTextField.alloc().initWithFrame(frame);

    field.setStringValue(string);
    field.setFont(NSFont.systemFontOfSize(11));
    field.setTextColor(NSColor.colorWithCalibratedRed_green_blue_alpha(0.2, 0.2, 0.2, 1));
    field.setBezeled(0);
    field.setBackgroundColor(NSColor.whiteColor())
    field.setEditable(0);
    field.setLineBreakMode(NSLineBreakByTruncatingTail);

    return field;
};

const createScrollView = (border, frame) => {
    const view = NSScrollView.alloc().initWithFrame(frame);

    view.setHasVerticalScroller(1);
    view.setBackgroundColor(NSColor.whiteColor())

    if (border) {
        view.addSubview(createDivider(NSMakeRect(0, 0, frame.size.width, 1)));
        view.addSubview(createDivider(NSMakeRect(0, frame.size.height - 1, frame.size.width, 1)));
    }

    return view;
};

const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const createColorLabel = (hex, frame) => {
    const color = NSView.alloc().initWithFrame(frame);

    color.setWantsLayer(1);
    const rgb = hexToRgb(hex);
    log(JSON.stringify(rgb));
    color.layer().setBackgroundColor(CGColorCreateGenericRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0));

    return color;
};

const createTextLabel = (string, frame, fontSize = 9) => {
    const field = NSTextField.alloc().initWithFrame(frame);

    field.setStringValue(string);
    field.setFont(NSFont.systemFontOfSize(fontSize));
    field.setTextColor(NSColor.colorWithCalibratedRed_green_blue_alpha(0, 0, 0, 0.4));
    field.setBackgroundColor(NSColor.whiteColor());
    field.setBezeled(0);
    field.setEditable(0);

    return field;
};

const createView = frame => {
    const view = NSView.alloc().initWithFrame(frame);

    view.setFlipped(1);
    return view;
};