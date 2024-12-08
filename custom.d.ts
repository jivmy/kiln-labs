// This file allows TypeScript to recognize imports for custom file types, such as .mp3 files.
// By default, TypeScript only recognizes standard file types like .ts, .tsx, and .js. 
// This declaration tells TypeScript how to handle .mp3 imports in the project.

declare module '*.mp3' {
    const src: string;
    export default src;
  }
  
  // If you want to add support for other file types (like .png, .svg, .jpg), you can do so like this:
  // declare module '*.png' {
  //   const src: string;
  //   export default src;
  // }
  