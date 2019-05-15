import { findColorInstancesInPage } from "../src/color-search";

const page = {
    name: 'Page 1',
    layers: [
        {
            name: 'My artboard',
            type: 'Artboard',
            layers: [
                {
                    name: "first sub layer",
                    style: {
                      fills: [{color: 'NOT THE COLOR'}]
                    },
                    layers: [
                        {
                            name: 'second sub layer',
                            parent: {name: 'first sub layer'},
                            style: {
                                fills: [{color: 'COLOR'}]
                            }
                        },
                        {
                            name: 'sibling layer',
                            style: {
                                fills: [{color: 'NOT THE COLOR'}]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

describe('when searching on a page', () => {
    let results;
    beforeAll(() => {
        results = findColorInstancesInPage('COLOR', page);
    });

    it('finds the color by page, artboard and layer', () => {
        expect(results[0].page.name).toEqual('Page 1');
        expect(results[0].artboard.name).toEqual('My artboard');
        expect(results[0].layer.name).toEqual('second sub layer');
    });

    it("only returns relevant results, ignoring colors that don't match", () => {
        expect(results.length).toBe(1);
    });
});


