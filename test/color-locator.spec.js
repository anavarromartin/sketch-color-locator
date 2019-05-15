import {findColorInstancesInPage} from "../src/color-search";

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
                                fills: [{color: 'COLOR'}],
                                borders: [{color: 'COLOR'}]
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

const pageWithBorderColor = {
    name: 'page',
    layers: [
        {
            name: 'artboard',
            type: 'Artboard',
            layers: [{
                name: 'layer with border',
                style: {
                    borders: [{color: 'COLOR'}],
                    fills: [{color: 'COLOR'}]
                }
            }]
        }
    ]
};

describe('color locator', () => {
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

    it("finds the color on borders", () => {
        const results = findColorInstancesInPage('COLOR', pageWithBorderColor);

        expect(results.length).toBe(1);
        expect(results[0].page.name).toEqual('page');
        expect(results[0].artboard.name).toEqual('artboard');
        expect(results[0].layer.name).toEqual('layer with border');
    });
});



