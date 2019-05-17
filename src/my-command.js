import UI from 'sketch/ui'
import {displaySearchResultsAndColor} from "./results-renderer";
import {findColorInstancesInPage} from "./color-search";

const document = require('sketch/dom').getSelectedDocument();

// documentation: https://developer.sketchapp.com/reference/api/

export default function () {
    try {
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

        displaySearchResultsAndColor(document, color, searchResults);
    } catch (err) {
        UI.message("Oops... something went wrong 🥺");
        throw err;
    }
}

const formatInputColor = colorInput => {
    const colorWithHash = colorInput.startsWith('#') ? colorInput : `#${colorInput}`;
    return colorWithHash.length === 9 ? colorWithHash : `${colorWithHash}FF`;
};

const getColorInputFromUser = () => {
    let colorInput = null;
    UI.getInputFromUser("Enter the HEX color you want to find in the page you selected", {
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
