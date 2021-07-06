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

  public render(): void {

    //const shadowRoot = this.domElement.attachShadow({ mode: 'closed' });
    
    const script = document.createElement('script');
    script.src = 'lib/webparts/helloWorld/_framework/blazor.webassembly.js';
    script.setAttribute('autostart', 'false');

    const container = document.createElement('div');
    container.appendChild(document.createElement('app'));

    container.appendChild(script);

    this.domElement.appendChild(container);

    script.addEventListener('load', () => {
      const blazor = (window as any).Blazor;
      console.log(blazor);
      blazor._internal.navigationManager.getBaseURI = () => 'lib/webparts/helloWorld/';
    })

    /*this.domElement.innerHTML = `
        <div class="${styles.helloWorld}">
          <div class="${styles.container}">
            <div class="${styles.row}">
              <div class="${styles.column}">
                <span class="${styles.title}">Welcome to SharePoint!</span>
                <app>Loading...</app>
              </div>
            </div>
          </div>
        </div>`;*/
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
