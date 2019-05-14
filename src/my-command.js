import sketch from 'sketch'
import UI from 'sketch/ui'
import {displaySearchResultsAndColor} from "./results-renderer";

const document = require('sketch/dom').getSelectedDocument();

// documentation: https://developer.sketchapp.com/reference/api/

export default function () {
    const colorInput = getColorInputFromUser();

    if (!colorInput) {
        UI.message("Sorry, can't find a color if you don't give me a color... 🙁");
        return false;
    }

    const color = formatInputColor(colorInput);
    const searchResults = findColorInstancesInPage(color, document.selectedPage);

    if (searchResults.length === 0) {
        UI.message("I've looked really hard, and I can't find that color 😰");
        return false;
    }

    displaySearchResultsAndColor(color, searchResults);
}

const formatInputColor = colorInput => {
    const colorWithHash = colorInput.startsWith('#') ? colorInput : `#${colorInput}`;
    return colorWithHash.length === 9 ? colorWithHash : `${colorWithHash}FF`;
};

const findColorInstancesInPage = (colorToFind, page) => {
    const searchResults = [];
    try {
        findColorInLayers(colorToFind, page.layers, result => {
            const resultWithPage = {
                page: page,
                ...result
            };
            searchResults.push(resultWithPage);
        });
    } catch (err) {
        UI.message("Oops... something went wrong 🥺");
        throw err;
    }
    return searchResults;
};

const findColorInstancesAcrossAllPages = colorToFind => {
    return document.pages.flatMap(page => findColorInstancesInPage(colorToFind, page));
};

const findColorInLayers = (colorToFind, layers, addSearchResult) => {
    layers.forEach(layer => {
        if (layer.style && layer.style.fills.length > 0) {
            layer.style.fills.forEach(fill => {
                const color = fill.color;
                if (color.toUpperCase() === colorToFind.toUpperCase()) {
                    addSearchResult({
                        artboard: layer.parent,
                        layer: layer,
                    })
                }
            })
        }
        if (layer.layers && layer.layers.length > 0) {
            findColorInLayers(colorToFind, layer.layers, addSearchResult);
        }
    });
};

const getColorInputFromUser = () => {
    let colorInput = null;
    UI.getInputFromUser("Enter the HEX color you want to find (it might take a minute)", {
        type: UI.INPUT_TYPE.string
    }, (err, value) => {
        if (err) {
            // most likely the user canceled the input
            return
        }
        colorInput = value;
        log('I want to find this color: ' + colorInput)
    });
    return colorInput;
};
