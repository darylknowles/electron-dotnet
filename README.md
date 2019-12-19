# electron-dotnet

## Initially adapted from article [here](https://itnext.io/create-desktop-with-electron-react-and-c-86f9765809b7)

The initial version of this demo has several shortcomings which, in my opinion, distract from the core concept of using C# with Electron.  I plan to deconstruct the demo to get it to the minimal required example for the concept. 

### Todo...
1. Remove Typescript and React inclusion.  These are very much separate topics and by including them in this demo it takes away from the main subject.  

2. Also in the interest of removing non-essential boilerplate, remove linting and webpack options. A very simple vanilla js / html example should suffice. 

3. The native exe build step neglects to include the dotnet project.  As written, it requires the C# source project to be copied to the release folder manually in a very specific subfolder.  This should be simplified to a single dotnet DLL / EXE for distribution. 

Stay tuned...

