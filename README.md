# SkeletonElementsWidget

This skeleton project can be used to generate angular elements widget that can run standalone or inject in other projects (Angular, HTML, Vue, etc).
The following guide was used to build this: [Angular Elements: Create a Component Library for Angular and the Web](https://medium.com/swlh/angular-elements-create-a-component-library-for-angular-and-the-web-8f7986a82999)

## Done Steps (not needed anymore but written for references)

* `ng g library widget` generates the library from where the widget can be build from
* `ng build widget --prod` for initial library build (sometimes this command must be executed 2x times to work perfectly)
* `ng g application widget-elements` to generate application that will be used for injection (Angular Elements at moment supports only projects from type *application*)
* `ng add @angular/elements --project widget-elements` this is needed to add Angular Elements functionality (installs dependecies & updates polyfills)
* Following steps are needed to publish as custom element
    * `cd projects/widget-elements`
    * `npm init`
    * Add the following line to the **package.json**:<br>
    ```typescript
    "files": ["widget.js", "styles.css"],
    ```
* Delete all files in directory `projects/widget-elements/src/app` except `app.module.ts`
* Change the following lines in `projects/widget-elements/src/app/app.module.ts`
    * Remove the bootstrap array from `NgModule` declaration.
    * Import `WidgetModule` and `WidgetComponent` from the components library.
    * Add `ngDoBootstrap` hook.
    * For every component create an element using the `createCustomElement` function from `@angular/elements`. Then define the element using web's native `customElemments.define` function, specifying a selector. 
    The module should now looking like this:
        ```typescript
        import { BrowserModule } from '@angular/platform-browser';
        import { NgModule, Injector } from '@angular/core';
        import { createCustomElement } from '@angular/elements';

        import { WidgetModule, WidgetComponent } from 'widget';

        @NgModule({
            imports: [
                BrowserModule,
                WidgetModule
            ],
            providers: []
        })
        export class AppModule {
            constructor(private readonly injector: Injector){}

            ngDoBootstrap(){
                const widget = createCustomElement(WidgetComponent, { injector: this.injector });
                customElements.define("lts-widget", widget);
            }
        } 
        ```
    * Following script commands are added to the root **package.json** (this windows only):
    (Please install the following npm packages for jscat: npm i -g jscat)
        ```json
        {
            "scripts": {
                ...
                "build:elements": "ng build --prod --project widget-elements --output-hashing none && npm run pack:elements && copy /Y projects\\widget-elements\\package.json dist\\widget-elements",
                "pack:elements": "jscat dist\\widget-elements\\runtime-es5.js dist\\widget-elements\\polyfills-es5.js dist\\widget-elements\\main-es5.js > dist\\widget-elements\\widget.js",
                "build:widget": "ng build --prod --project widget",
                ...
            }
            ...
        }
        ```
    * now run the following commands in command line:
        * `npm run build:elements`

After these steps it is now possible to use the widget: 
For testing purpose you can implement the widget component in root module:
* import `WidgetModule`
* add schema `CUSTOM_ELEMENTS_SCHEMA` to `NgModule`.
* add the following line to app.component.html: `<lts-widget></lts-widget>`

The module should now look like this
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { WidgetModule } from 'widget';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WidgetModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```
now run this command `ng s` in command line to start server.

To implement the widget in HTML page is simple:
* copy the `widget.js` & `style.css` from `dist/widget-elements` to your directory where you have you create your simple HTML file
* Write the following line code in your HTML file:
    ```html
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>LTS Angular Elements</title>
            <link rel="stylesheet" href="styles.css">
            <script src="widget.js"></script>
        </head>
        <body>

            <h1>Web Component (Costum Elements)</h1>
            <lts-widget></lts-widget>
        </body>
    </html>
    ```
* now open the file directly with you preferred browser

You should see the same as previously seen.

### ATTENTION
After every change of widget library you must run `ng build widget` to see the modifications you have done.

### Communication
When trying to communicate with widget, the following rules are to be followed:
* When using the widget as simple library: no need to differentiate between normal angular apps
* When using the widget as Angular Elements:
    * `@Input` properties of component can be used on the custom element be writing the name of the property from **camelCase** to **kebab-case**.
    Example: 
    `@Input() isHighlighted` can be used externally as `is-highlighted`-attribute
        ```html
        <lts-widget is-highlighted="1"></lts-widget> 
        ```
    * `@Input` properties can only passed normally as string. To pass more complex types to the angular element, you must use javascript.
    **Useful Information:** when using the javascript way you can use the same input name as defined in component. (see the javascript example)
    Example: 
        this way data can only passed as string:
        ```html
        <lts-widget complex-object="DataAsString"></lts-widget> 
        ```
        To pass more complex types use this way:
        ```js
        var ltsWidget = document.querySelector('lts-widget');
        ltsWidget.complexObject = SomeComplexData;
        ```
    * `@Output` events naming convention remains as defined
    * To catch `@Output` events you must add an eventListener. The passed of the event can be of any type possible. The passed data will be saved in `event.detail` of the costum element.
    Example:
        ```js
        var ltsWidget = document.querySelector('lts-widget');
        ltsWidget.addEventListener('customEventName',function(event){
            console.log('Custom event passed data:',event.detail);
        });
        ```

### Code scaffolding in widget
It's similar as descripted down, you only must add to every command the following string snippet: `--project=widget`
example: `ng g c component-name --project=widget`
With this the component will be generate in the widget library