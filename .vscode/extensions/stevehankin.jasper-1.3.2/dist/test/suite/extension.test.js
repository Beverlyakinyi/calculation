"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const mocha_1 = require("mocha");
const vscode = require("vscode");
const extension_1 = require("../../extension");
const chai_1 = require("chai");
const SAMPLES = [
    {
        id: "flatObject",
        content: {
            sample: "hello",
        },
        isJson: true,
    },
    {
        id: "threeLevels",
        content: {
            sample: "hello",
            level2: {
                description: "nested attrib",
                level3: {
                    targetAttrib: "hoverOnThis",
                },
            },
        },
        isJson: true,
    },
    {
        id: "arrayExample",
        content: {
            sample: "hello",
            level2: {
                anArray: [{ thisCode: 0 }, { thatCode: 1 }, { anotherCode: 2 }],
            },
        },
        isJson: true,
    },
    {
        id: "functionExample",
        content: "const f = () => { const x = { sample: 1 }}",
        isJson: false,
    },
    {
        id: "functionExampleWithExport",
        content: "export const f = () => { const abc = { test: 123 }}",
        isJson: false,
    },
    {
        id: "attribMappedToArray",
        content: {
            sample: "hello",
            anArray: [{ thisCode: 0 }, { thatCode: 1 }, { anotherCode: 2 }],
        },
        isJson: true,
    },
];
const getPath = (sample) => __dirname + "/" + sample.id + ".js";
suite("Extension Test Suite", () => __awaiter(void 0, void 0, void 0, function* () {
    mocha_1.before(() => {
        /**
         * Create files for all the samples
         */
        SAMPLES.forEach((sample) => {
            try {
                const fileName = getPath(sample);
                console.log(`Writing to ${fileName}..`);
                const contentStr = typeof sample.content === "string"
                    ? sample.content
                    : JSON.stringify(sample.content);
                fs_1.writeFileSync(fileName, contentStr);
                console.log("Written file");
            }
            catch (e) {
                console.error(e);
            }
        });
    });
    vscode.window.showInformationMessage("Start all tests.");
    /**
     * Type guard
     */
    function isHover(hoverHandler) {
        return (hoverHandler !== null &&
            hoverHandler !== undefined &&
            typeof hoverHandler === "object");
    }
    /**
     * Determine offset in document for a specified text
     * so that the hover can be generated on it
     * @param docText
     * @param textToHover
     * @returns
     */
    const getHoverPosition = (docText, textToHover) => {
        const hoverOnPos = docText.indexOf(textToHover);
        if (hoverOnPos === undefined) {
            throw new Error(`Cannot hover on text ${textToHover} - incorrect unit test or sample data?`);
        }
        return hoverOnPos;
    };
    /**
     * Open a sample file (containing either JSON or Module),
     * hover on a piece of text and verify that the
     * expected path strings are returned
     */
    const testHelper = (done, sampleName, textToHover, matches) => {
        const sample = SAMPLES.find((s) => s.id === sampleName);
        if (sample === undefined) {
            throw new Error(`Sample ${sampleName} does not exist`);
        }
        vscode.window
            .showTextDocument(vscode.Uri.file(getPath(sample)))
            .then((onfulfilled) => {
            const docText = onfulfilled.document.getText();
            const hoverOnPos = getHoverPosition(docText, textToHover);
            const hoverResult = extension_1.handleHover(onfulfilled.document, new vscode.Position(0, hoverOnPos), sample.isJson);
            try {
                chai_1.expect(hoverResult).to.not.be.undefined;
                if (isHover(hoverResult)) {
                    vscode.Hover;
                    const { contents } = hoverResult;
                    chai_1.expect(contents).to.be.a("array");
                    chai_1.expect(contents).to.have.length(1);
                    const path = contents[0].value;
                    matches.forEach((m) => {
                        console.log(`Checking ${path} contains ${m}`);
                        chai_1.expect(path).contains(m);
                    });
                }
                done();
            }
            catch (e) {
                done(e);
            }
        });
    };
    /**
     * Test on a vanilla JSON object
     */
    test("Test simple json", (done) => {
        testHelper(done, "flatObject", "sample", ["sample"]);
    });
    /**
     * Test on a nested object
     */
    test("Test nested json", (done) => {
        testHelper(done, "threeLevels", "hoverOnThis", [
            "level2",
            "level3",
            "targetAttrib",
        ]);
    });
    /**
     * Test on an array object
     * to hover on the 3rd element
     */
    test("Test array json within function", (done) => {
        testHelper(done, "arrayExample", "anotherCode", ["level2", "anArray[2]"]);
    });
    /**
     * Test hovering on JSON inside a function
     * where the const is exported
     */
    test("Test javascript function with exported const", (done) => {
        testHelper(done, "functionExampleWithExport", "123", ["abc", "test"]);
    });
    /**
     * Test hovering on an array within an object
     */
    test("Test hovering on an array within an object", (done) => {
        testHelper(done, "attribMappedToArray", "thatCode", ["anArray[1]"]);
    });
}));
//# sourceMappingURL=extension.test.js.map