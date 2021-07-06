import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';

//import 'blazor';


export interface IHelloWorldWebPartProps {
  description: string;
  test: string;
  test1: boolean;
  test2: string;
  test3: boolean;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  private onInitialize() {
    const blazor = (window as any).Blazor;
    console.log(blazor);
    //blazor._internal.navigationManager.getBaseURI = () => '/lib/webparts/helloWorld/';

    const originalFetch = window.fetch;
    window.fetch = function(requestInfo, options) {
        if (requestInfo === '_framework/blazor.boot.json') {
            return originalFetch('/lib/webparts/helloWorld/_framework/blazor.boot.json', options);
        } else {
            // Use default logic
            return originalFetch.apply(this, arguments);
        }
    };

    blazor.start({
      loadBootResource: (
        type: string,
        name: string,
        defaultUri: string,
        integrity: string
      ) => {

        console.log(`loading ${name} (${type}) from ${defaultUri}`);
        if (type === 'dotnetjs') {
          return `/lib/webparts/helloWorld/_framework/${defaultUri.slice(defaultUri.indexOf('dotnet'))}`;
        } else {
          defaultUri = `/lib/webparts/helloWorld/${defaultUri}`;
        }

        return fetch(defaultUri, { 
          headers: { 'content-type': type === 'dotnetwasm' ? 'application/wasm' : 'application/octet-stream' }
        });
      },
    });
  }

  public render(): void {

    const existingScript = document.getElementById('helloWorldWA');
    if (existingScript == null) {
      const script = document.createElement('script');
      script.id = 'helloWorldWA';
      script.src = '/lib/webparts/helloWorld/_framework/blazor.webassembly.js';
      script.setAttribute('autostart', 'false');

      script.addEventListener('load', this.onInitialize.bind(this));

      this.domElement.appendChild(script);
    }

    this.domElement.innerHTML = `
        <div class="${styles.helloWorld}">
          <div class="${styles.container}">
            <div class="${styles.row}">
              <div class="${styles.column}">
                <span class="${styles.title}">Welcome to SharePoint!</span>
                <app>Loading...</app>
              </div>
            </div>
          </div>
        </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                }),
                PropertyPaneTextField('test', {
                  label: 'Multi-line Text Field',
                  multiline: true
                }),
                PropertyPaneCheckbox('test1', {
                  text: 'Checkbox'
                }),
                PropertyPaneDropdown('test2', {
                  label: 'Dropdown',
                  options: [
                    { key: '1', text: 'One' },
                    { key: '2', text: 'Two' },
                    { key: '3', text: 'Three' },
                    { key: '4', text: 'Four' }
                  ]
                }),
                PropertyPaneToggle('test3', {
                  label: 'Toggle',
                  onText: 'On',
                  offText: 'Off'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
