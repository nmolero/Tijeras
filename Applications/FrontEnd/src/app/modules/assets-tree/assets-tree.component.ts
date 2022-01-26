import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Renderer2, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TreeNode } from 'primeng/api';

//Services

import { ReportSnackBar } from '../../shared/components/report-snack-bar/report-snack-bar';
import { UserConfigurationData } from '../../services/user-configuration';
import { HttpService } from '../../services/http-general-service';
import { HttpCrudService } from '../../services/http-crud-service';
import { Table } from 'primeng/table';
import { DateErrorStateMatcher } from '../../services/error-state-matcher';
import { DateFormatter } from '../../services/date-formatter';
import { DatePickersValidation } from '../../services/datepickers-validation';
import { DateCalculations } from '../../services/date-calculations';
import { templateJitUrl } from '@angular/compiler';



@Component({
  selector: 'app-assets-tree',
  templateUrl: './assets-tree.component.html',
  styleUrls: ['./assets-tree.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MessageService,
    ReportSnackBar,
    UserConfigurationData,
    HttpService,
    HttpCrudService,
    DateErrorStateMatcher,
    DatePickersValidation,
    DateFormatter,
    DateCalculations
  ]
})
export class AssetsTreeComponent implements OnInit {

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService, private dateFormatter: DateFormatter,
    private messageService: MessageService, private httpService: HttpService,
    private httpCrudService: HttpCrudService, private formBuilder: FormBuilder,
    private reportSnackBar: ReportSnackBar, private userDataService: UserConfigurationData,
    private datePickersValidation: DatePickersValidation, private dateCalculations: DateCalculations
  ) { }

  //BlockUI

  isLoadingResults = false;

  //Panel

  headerTitleLabel: string = "Árbol de Activos";

  //TreeNode

  selectedNode: TreeNode = null;
  treeNodeDataValues: TreeNode[] = [
    // {
    //   "key": 'document',
    //   "label": "Documents",
    //   "data": "Documents Folder",
    //   "expandedIcon": "pi pi-folder-open",
    //   "collapsedIcon": "pi pi-folder",
    //   "children": [{
    //     "key": 'd-work',
    //     "label": "Work",
    //     "data": "Work Folder",
    //     "expandedIcon": "pi pi-folder-open",
    //     "collapsedIcon": "pi pi-folder",
    //     "children": [{ "key": 'd-w-expenses', "label": "Expenses.doc", "icon": "pi pi-file", "data": "Expenses Document" }, { "key": 'd-w-resume', "label": "Resume.doc", "icon": "pi pi-file", "data": "Resume Document" }]
    //   },
    //   {
    //     "key": 'd-home',
    //     "label": "Home",
    //     "data": "Home Folder",
    //     "expandedIcon": "pi pi-folder-open",
    //     "collapsedIcon": "pi pi-folder",
    //     "children": [{ "key": 'd-h-invoices', "label": "Invoices.txt", "icon": "pi pi-file", "data": "Invoices for this month" }]
    //   }]
    // },
    // {
    //   "key": 'pictures',
    //   "label": "Pictures",
    //   "data": "Pictures Folder",
    //   "expandedIcon": "pi pi-folder-open",
    //   "collapsedIcon": "pi pi-folder",
    //   "children": [
    //     { "key": 'p-barcelona', "label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo" },
    //     { "key": 'p-logo', "label": "logo.jpg", "icon": "pi pi-file", "data": "PrimeFaces Logo" },
    //     { "key": 'p-primeui', "label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo" }]
    // },
    // {
    //   "key": 'movies',
    //   "label": "Movies",
    //   "data": "Movies Folder",
    //   "expandedIcon": "pi pi-folder-open",
    //   "collapsedIcon": "pi pi-folder",
    //   "children": [{
    //     "key": 'm-alpacino',
    //     "label": "Al Pacino",
    //     "data": "Pacino Movies",
    //     "children": [{ "key": 'm-a-scarface', "label": "Scarface", "icon": "pi pi-video", "data": "Scarface Movie" }, { "key": 'm-a-serpico', "label": "Serpico", "icon": "pi pi-file-video", "data": "Serpico Movie" }]
    //   },
    //   {
    //     "key": 'm-robertdeniro',
    //     "label": "Robert De Niro",
    //     "data": "De Niro Movies",
    //     "children": [{ "key": 'm-r-goodfellas', "label": "Goodfellas", "icon": "pi pi-video", "data": "Goodfellas Movie" }, { "key": 'm-r-untouchables', "label": "Untouchables", "icon": "pi pi-video", "data": "Untouchables Movie" }]
    //   }]
    // }
  ];

  //PiWebApi

  PIWebAPIConfig: any[] = [];
  generalElementsLink: string = "";

  afServerName: string = "------";
  dataBaseName: string = "------";

  async ngOnInit() {

    //Menu Side Bar configuration
    this.storage.set('isPreviousPageLogin', false);

    this.isLoadingResults = true;

    await this.httpService.getSystemParameter("PIWebAPI").then(
      async data => {
        console.log(data);
        if ((data !== null) && (data.error == null)) {
          this.PIWebAPIConfig = data;

          this.generalElementsLink = this.GetItemValue('ElementsLink');
          this.afServerName = this.GetItemValue('AssetServersName');
          this.dataBaseName = this.GetItemValue('DataBasesName');

          let treeNodeData: any = null;


          await this.httpService.getQueryPIWebAPI(this.generalElementsLink).then(
            data => {
              if ((data !== null) && (data.error == null)) {
                treeNodeData = data;
              } else {
                this.ShowUnAuthorizeToast(data);
              }

            }
          );
          //console.log(treeNodeData);
          let treeNodeDataValues: any[] = [];

          if ((treeNodeData !== null) && (treeNodeData !== [])) {



            treeNodeData.items.forEach(async (treeNodeitem, i, data) => {

              let childrenData: any = null;

              //

              await this.httpService.getQueryPIWebAPI(treeNodeitem.links.elements).then(
                data => {

                  if ((data !== null) && (data.error == null)) {
                    childrenData = data;
                    console.log(childrenData);
                  } else {
                    this.ShowUnAuthorizeToast(data);
                  }
                }
              );
              let childrenNodesDataValues: any[] = [];
              if ((childrenData !== null) && (childrenData !== [])) {

                childrenNodesDataValues = childrenData.items.map(item => {
                  return {
                    key: item.id,
                    label: item.name,
                    collapsedIcon: 'pi pi-circle-off',
                    expandedIcon: 'pi pi-circle-on',
                    children: [],
                    data: {
                      elementsLink: item.links.elements,
                      attributesLink: item.links.attributes,
                      description: item.description,
                      path: item.path,
                      webId: item.webId,
                      templateName: item.templateName
                    }
                  }
                });
                //console.log(childrenNodesDataValues);



              }

              treeNodeDataValues = [
                ...treeNodeDataValues,
                {
                  key: treeNodeitem.id,
                  label: treeNodeitem.name,
                  collapsedIcon: 'pi pi-circle-off',
                  expandedIcon: 'pi pi-circle-on',
                  children: childrenNodesDataValues,
                  data: {
                    elementsLink: treeNodeitem.links.elements,
                    attributesLink: treeNodeitem.links.attributes,
                    description: treeNodeitem.description,
                    path: treeNodeitem.path,
                    webId: treeNodeitem.webId,
                    templateName: treeNodeitem.templateName
                  }
                }
              ];

              //console.log(treeNodeDataValues);


              if (i === (data.length - 1)) {
                this.treeNodeDataValues = [...treeNodeDataValues];

              }

            });

          }
        }
        else {

          this.ShowUnAuthorizeToast(data);
        }
      }
    );

    //console.log(this.treeNodeDataValues);
    this.isLoadingResults = false;

  }

  //////////////////////////////////////////////////////////

  GetItemValue(itemKey: string): string {

    return this.PIWebAPIConfig.find(item => {
      return item.systemParameterKey === itemKey;
    }).systemParameterValue;
  }

  ///////////////////////////////////////////////////////7

  ShowUnAuthorizeToast(data: any) {

    if (data !== null) {
      if ((data.error !== undefined) && (data.error !== null)) {
        if (data.status === 401) {
          this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Operación Denegada. Consulte por los permisos adecuados para realizar la siguiente acción.' });
        }
      }
    } else {
      this.messageService.add({ life: 6000, key: 'operationStatusInfo', severity: 'error', summary: 'Error', detail: 'Se ha producido un error en la comunicación con el servidor.' });
    }


  }

  ///////////////////////////////////////////////

  async HandleExpandNode({ node }) {

    console.log(node);
    // if (node.children === []) {
    //   await this.httpService.getQueryPIWebAPI(node.data.elementsLink).then(
    //     data => {
    //       if ((data !== null) && (data.error == null)) {

    //         let childrenNodes: any[] = [];

    //         childrenNodes = data.items.map(async item => {
    //           const node: any = {
    //             key: item.id,
    //             label: item.name,
    //             collapsedIcon: 'pi pi-circle-off',
    //             expandedIcon: 'pi pi-circle-on',
    //             children: [],
    //             data: {
    //               elementsLink: item.links.elements,
    //               attributesLink: item.links.attributes,
    //               description: item.description,
    //               path: item.path,
    //               webId: item.webId,
    //               templateName: item.templateName
    //             }
    //           };
    //           return node;
    //         });
    //       }
    //     }
    //   );






    // }

    const getSubMenuItem = function (subMenuItems, id) {
      if (subMenuItems) {
        for (var i = 0; i < subMenuItems.length; i++) {
          if (subMenuItems[i].key === id) {
            subMenuItems = [...subMenuItems, {
              key: 'hola',
              label: 'Nuevo Item'
            }]
            return subMenuItems[i];
          }
          var found = getSubMenuItem(subMenuItems[i].children, id);
          if (found) return found;
        }
      }
    };

    console.log(getSubMenuItem(this.treeNodeDataValues, 'm-r-goodfellas'));


  }

  ///////////////////////////////////////////////////////////

  async getTreeNodeByElementsLink(elementsLink: string): Promise<any> {

    let nodeData: any = null;

    await this.httpService.getQueryPIWebAPI(this.generalElementsLink).then(
      data => {
        if ((data !== null) && (data.error == null)) {

          nodeData = data;
        }
      });





    console.log(nodeData);
    return nodeData;
  }

  //////////////////////////////////////////////////////////////////////////


}
