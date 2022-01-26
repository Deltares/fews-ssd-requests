/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface SchematicStatusDisplay {
        /**
          * The last name
         */
        "height": number;
        /**
          * The first name
         */
        "src": string;
        /**
          * The middle name
         */
        "width": number;
    }
}
declare global {
    interface HTMLSchematicStatusDisplayElement extends Components.SchematicStatusDisplay, HTMLStencilElement {
    }
    var HTMLSchematicStatusDisplayElement: {
        prototype: HTMLSchematicStatusDisplayElement;
        new (): HTMLSchematicStatusDisplayElement;
    };
    interface HTMLElementTagNameMap {
        "schematic-status-display": HTMLSchematicStatusDisplayElement;
    }
}
declare namespace LocalJSX {
    interface SchematicStatusDisplay {
        /**
          * The last name
         */
        "height"?: number;
        /**
          * The first name
         */
        "src"?: string;
        /**
          * The middle name
         */
        "width"?: number;
    }
    interface IntrinsicElements {
        "schematic-status-display": SchematicStatusDisplay;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "schematic-status-display": LocalJSX.SchematicStatusDisplay & JSXBase.HTMLAttributes<HTMLSchematicStatusDisplayElement>;
        }
    }
}