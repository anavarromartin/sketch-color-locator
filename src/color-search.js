export const findColorInstancesInPage = (colorToFind, page) => {
    return findColorInLayers(colorToFind, page.layers, {page: page});
};

const findColorInstancesAcrossAllPages = colorToFind => {
    return document.pages.flatMap(page => findColorInstancesInPage(colorToFind, page));
};

const findColorInLayers = (colorToFind, layers, result) => {
    return layers
        .flatMap(layer => {
            if (layer.style
                && (
                    (layer.style.fills
                        && layer.style.fills.length > 0
                        && layer.style.fills[0].color.toUpperCase() === colorToFind.toUpperCase())
                    || (layer.style.borders
                        && layer.style.borders.length > 0
                        && layer.style.borders[0].color.toUpperCase() === colorToFind.toUpperCase())
                )
            ) {
                return {
                    layer: layer,
                    ...result
                };
            }

            if (layer.layers && layer.layers.length > 0) {
                return findColorInLayers(
                    colorToFind,
                    layer.layers,
                    layer.type === 'Artboard'
                        ? {artboard: layer, ...result}
                        : result);
            }
        })
        .filter(result => result);
};