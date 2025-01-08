sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "com/airbus/zcfe2meautorc/model/formatter",
    "sap/m/BusyDialog",
    "sap/ui/core/message/Message",
    "sap/m/MessageToast",
    "sap/m/Token"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, MessageBox, formatter, BusyDialog, Message, MessageToast, Token) {
        "use strict";

        return Controller.extend("com.airbus.zcfe2meautorc.controller.CreateRouting", {
            formatter: formatter,
            onInit: function () {
                //Populate Groupcounters
                var aGroupcounters = [],
                    sCounterObj;
                var counterObj = {
                    Template_GC: ""
                };
                for (var counter = 1; counter < 100; counter++) {
                    if (counter < 10) {
                        counterObj.Template_GC = "0" + counter;
                    } else {
                        counterObj.Template_GC = counter;
                    }
                    sCounterObj = JSON.stringify(counterObj);
                    aGroupcounters.push(JSON.parse(sCounterObj));
                }
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                oRoutingModel.setProperty("/aInitGroupcounters", aGroupcounters);
                var oVisibilityModel = this.getOwnerComponent().getModel("oVisibilityModel");
                oVisibilityModel.setProperty("/bSaveVisible", true);
                oRoutingModel.setProperty("/keyUser", "");
                oVisibilityModel.setProperty("/bEndUserVisible", true);
                oVisibilityModel.setProperty("/bKeyUserVisible", false);
                oVisibilityModel.setProperty("/bExpandRoutingHeaderVisible", false); // Additional fields
                oVisibilityModel.setProperty("/bExpandOperationHeaderVisible", false); // Additional fields
                oVisibilityModel.setProperty("/span", "XL7 L7 M7 S12");
                var oMessageManager = sap.ui.getCore().getMessageManager();
                this.getView().setModel(oMessageManager.getMessageModel(), "message");
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onPatternMatched, this);
                // This property is used to show hide Change routing
                oVisibilityModel.setProperty("/bCreateSelectedEndUser", true);
                oVisibilityModel.setProperty("/bChangeSelectedSimpleForm", false);
                this.getOwnerComponent().getModel("oRoutingModel").setProperty("/iChangeTemplateDetailsLength", 0);
                this.getOwnerComponent().getModel("oRoutingModel").setProperty("/sCreateChangeIndex", 0);
                // Setting the property to check the Group counter error in fnCreate method 
                // if error is due to Group counter validation or duplicate group counter.
                oRoutingModel.setProperty("/bErrorForGcounterValidation", false);
                oRoutingModel.setProperty("/loggedin", "");
                /**Adding Tokens for filter Items*/
                //Token for RoutingStatus
                var oRoutingStatus = this.getView().byId("RoutingStatus");
                if (oRoutingStatus || oRoutingStatus !== undefined) {
                    oRoutingStatus.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Token for Template Status
                var oTemplateStatus = this.getView().byId("TemplateStatus");
                if (oTemplateStatus || oTemplateStatus !== undefined) {
                    oTemplateStatus.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Token for Group Counter.
                var oGroupCounterInput = this.getView().byId("idGroupGounterID");
                if (oGroupCounterInput || oGroupCounterInput !== undefined) {
                    oGroupCounterInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for Group.
                var oGroupInput = this.getView().byId("changeGroupID");
                if (oGroupInput || oGroupInput !== undefined) {
                    oGroupInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for Plant.
                var oPlantInput = this.getView().byId("changePlantID");
                if (oPlantInput || oPlantInput != - undefined) {
                    oPlantInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                //Token for Material Desc
                var oMaterialDesc = this.getView().byId("idMaterialDescInput");
                if (oMaterialDesc || oMaterialDesc !== undefined) {
                    oMaterialDesc.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                //Token for Material
                var oMaterial = this.getView().byId("idMaterialInput");
                if (oMaterial || oMaterial !== undefined) {
                    oMaterial.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                //Token for AOCI End User
                var oAOCIEndUser = this.getView().byId("idAOCIInputEndUser");
                if (oAOCIEndUser || oAOCIEndUser !== undefined) {
                    oAOCIEndUser.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                //Token for AOCI Description
                var oAOCIDescInput = this.getView().byId("idAOCIDescInput");
                if (oAOCIDescInput || oAOCIDescInput !== undefined) {
                    oAOCIDescInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                //Token for AOCI Input Key User only
                var oAOCIInput = this.getView().byId("idAOCIInputKeyUser");
                if (oAOCIInput || oAOCIInput !== undefined) {
                    oAOCIInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for Created By.
                var oCreatedByInput = this.getView().byId("CreatedByID");
                if (oCreatedByInput || oCreatedByInput !== undefined) {
                    oCreatedByInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for MRP Controller.
                var oMRPControllerInput = this.getView().byId("MRPControllerID");
                if (oMRPControllerInput || oMRPControllerInput !== undefined) {
                    oMRPControllerInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for MER Code.
                var oMERCodeInput = this.getView().byId("MERCodeID");
                if (oMERCodeInput || oMERCodeInput !== undefined) {
                    oMERCodeInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for Planner Group.
                var oPlannerGroupInput = this.getView().byId("PlannerGroupID");
                if (oPlannerGroupInput || oPlannerGroupInput !== undefined) {
                    oPlannerGroupInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
                // Tokens for End User Source.
                var oSourceInput = this.getView().byId("SourceID");
                if (oSourceInput || oSourceInput !== undefined) {
                    oSourceInput.addValidator(function (args) {
                        var text = args.text;
                        return new Token({ key: text, text: text });
                    });
                }
            },
            onBeforeRendering: function () {
                this.getOwnerComponent().getModel("oRoutingModel").setProperty("/keyUser", "");
            },
            onPatternMatched: function (oEvent) {
                //show pop over to users on click of close tab and back button  
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var oVisibilityModel = this.getOwnerComponent().getModel("oVisibilityModel");
                oRoutingModel.setProperty("/sSelectedTemplateStatus", []);
                var sParameters = this.getOwnerComponent().getComponentData().startupParameters;
                if (sParameters.User !== undefined) {
                    if (oRoutingModel.getProperty("/loggedin") === "") {
                        oRoutingModel.setProperty("/loggedin", "X");
                        var sMaterial = sParameters.M[0];
                        var sPlant = sParameters.P[0];
                        var sGroup = sParameters.G[0];
                        var sGrpCounter = sParameters.GC[0];
                        oRoutingModel.setProperty("/urlMaterial", sMaterial);
                        oRoutingModel.setProperty("/urlPlant", sPlant);
                        oRoutingModel.setProperty("/urlGroup", sGroup);
                        oRoutingModel.setProperty("/urlGroupCounter", sGrpCounter);
                        if (sParameters.mode[0] === "Create") {
                            var sSelectTemplate = sParameters.TS[0];
                            oRoutingModel.setProperty("/urlselectedTemplate", sSelectTemplate);
                            oRoutingModel.setProperty("/sCreateChangeIndex", 0);
                            oVisibilityModel.setProperty("/bCreateSelectedEndUser", true);
                            oVisibilityModel.setProperty("/bChangeSelectedSimpleForm", false);
                            this.fnGetMaterialDesc(sMaterial);
                        }
                        else if (sParameters.mode[0] === "Change") {
                            oRoutingModel.setProperty("/sCreateChangeIndex", 1);
                            oVisibilityModel.setProperty("/bCreateSelectedEndUser", false);
                            oVisibilityModel.setProperty("/bChangeSelectedSimpleForm", true);
                            this.fnGetMaterialDesc(sMaterial);
                            this.fnChangeTemplateRouting1(oEvent);
                        }
                    }
                }
                //show pop over to users on click of close tab and back button 
                sap.ushell.Container.setDirtyFlag(true);
                var sRoute = oEvent.getParameter("name");
                if (sRoute === "CreateRouting") {
                    this.fnResetSelScreen(); //Clear selection screen
                }
                this.fnGroupSelectionData();
                this.fnGetUserDefaultData();
            },
            // new routing function 
            fnChangeTemplateRouting1: function (oEvent) {
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var sKeyUser = oRoutingModel.getProperty("/keyUser") || "";
                var sParameters = this.getOwnerComponent().getComponentData().startupParameters;
                //show pop over to users on click of close tab and back button
                sap.ushell.Container.setDirtyFlag(false);
                //View Template check condition
                if (sParameters.nMode === undefined) {
                    sParameters.nMode = [];
                    sParameters.nMode[0] = "";
                }
                if (sParameters.nMode[0] === "ViewTemplate") {
                    var oObj = {
                        "CI": sParameters.AOCI[0],
                        "Plant": sParameters.P[0],
                        "Group_No": sParameters.G[0],
                        "Grp_Cntr": sParameters.GC[0],
                        "Task_type": sParameters.TT[0]
                    };
                    oRoutingModel.setProperty("/oRouteDetailsObj", oObj);
                    this.getView().getModel("oRoutingModel").setProperty("/bNavfromselection", true);
                    oRoutingModel.setProperty("/keyUser", "X");
                    oVisibilityModel.setProperty('/sMassUpdateUser', 'X');
                    //Setting the view template visible property
                    oVisibilityModel.setProperty('/sViewTemplate', 'X');
                    oBusyIndicator.close();
                    this.getRouter().navTo("UpdateTemplate");
                }
                else {
                    //Setting the visible property of view template
                    oVisibilityModel.setProperty('/sViewTemplate', '');
                    if (sParameters.nMode[0] === "ChangeTemp") {
                        var oObj = {
                            "CI": sParameters.AOCI[0],
                            "Plant": sParameters.P[0],
                            "Group_No": sParameters.G[0],
                            "Grp_Cntr": sParameters.GC[0],
                            "Task_type": sParameters.TT[0]
                        };
                        oRoutingModel.setProperty("/oRouteDetailsObj", oObj);
                        this.getView().getModel("oRoutingModel").setProperty("/bNavfromselection", true);
                        oBusyIndicator.close();
                        if (sKeyUser === "X") { //Keyuser
                            this.getOwnerComponent().getRouter().navTo("UpdateTemplate");//ME AUTO - Update Routing 
                        }
                    }
                    if (sParameters.nMode[0] === "ChangeRouting") {
                        var oObj = {
                            "Material": sParameters.M[0],
                            "Plant": sParameters.P[0],
                            "Group_No": sParameters.G[0],
                            "Grp_Cntr": sParameters.GC[0],
                            "Task_type": sParameters.TT[0]
                        };
                        oRoutingModel.setProperty("/oRouteDetailsObj", oObj);
                        //EndUser
                        this.getView().getModel("oRoutingModel").setProperty("/bNavfromselection", true);
                        oBusyIndicator.close();
                        this.getOwnerComponent().getRouter().navTo("UpdateRouting");
                    }
                }
                oBusyIndicator.close();
            },
            /* Params : N/A testing * This method is used to show busy indicator */
            fnOpenBusyDialog: function () {
                sap.ui.core.BusyIndicator.show(0);
            },
            fnResetSelScreen: function () {
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                //Clear Change template fields
                oRoutingModel.setProperty("/selectedCI", "");
                oRoutingModel.setProperty("/selectedCIDesc", "");
                oRoutingModel.setProperty("/selectedChangePlant", "");
                oRoutingModel.setProperty("/selectedChangeGroup", "");
                oRoutingModel.setProperty("/groupCounter", "");

                // Clear Change fragment table data and results length on back navigation.
                oRoutingModel.setProperty("/aChangeTemplateDetails", []);
                oRoutingModel.setProperty("/iChangeTemplateDetailsLength", 0);

                //Remove previously selected selection from table.
                var idChngTable = this.getView().byId("idChangeTemplateTable");
                var rowid = idChngTable.getSelectedIndices();
                if (rowid.length > 0) {
                    idChngTable.removeSelectionInterval(rowid[0], rowid[0]);
                }
                // Template or Routing selection
                oRoutingModel.setProperty("/selectedMaterial", "");
                oRoutingModel.setProperty("/selectedMaterialDesc", "");
                oRoutingModel.setProperty("/selectedPlant", "");
                oRoutingModel.setProperty("/selectedGroup", "");
                oRoutingModel.setProperty("/selectedGroupCounter", "");
                oRoutingModel.setProperty("/selectedTemplate", "");
                oRoutingModel.setProperty("/selectedTemplatenumber", "");
                oRoutingModel.setProperty("/TemplateGroup", "");
                oRoutingModel.setProperty("/TemplateGroupCounter", "");
                oRoutingModel.setProperty("/aPlants", []);
                oRoutingModel.setProperty("/aGroups", []);
                oRoutingModel.setProperty("/oTemplate", []);
                oRoutingModel.setProperty("/aGroupCounters", []);
            },
            /*Description: This method is used to Validate the Material and get the Material Desc.*/
            fnGetMaterialDesc: function (sMaterial) {
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var sMaterialData = sMaterial;
                var aFilter = [];
                aFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                aFilter.push(new Filter("Text", FilterOperator.EQ, sMaterialData));
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                oDataModel.read("/ET_MaterialSet", {
                    filters: aFilter,
                    success: function (oData) {
                        if (oData.results[0].MsgType === "E") {
                            oRoutingModel.setProperty("/selectedMaterialDesc", "");
                            oRoutingModel.setProperty("/selectedMaterial", "");
                            oRoutingModel.setProperty("/selectedPlant", "");
                            oRoutingModel.setProperty("/selectedChangePlant", "");
                            oRoutingModel.setProperty("/aPlants", []);
                            oRoutingModel.setProperty("/selectedGroup", "");
                            oRoutingModel.setProperty("/selectedChangeGroup", "");
                            oRoutingModel.setProperty("/aGroups", []);
                            oRoutingModel.setProperty("/aGroupCountersTarget", []);
                            oRoutingModel.setProperty("/groupCounter", "");
                            oRoutingModel.setProperty("/selectedGroupCounter", "");
                            oRoutingModel.setProperty("/oTemplate", []);
                            oRoutingModel.setProperty("/selectedTemplate", "");
                            MessageBox.show(oData.results[0].Msg, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                styleClass: "sapUiSizeCompact"
                            });
                        } else {
                            oRoutingModel.setProperty("/selectedMaterialDesc", oData.results[0].Text);
                            oRoutingModel.setProperty("/selectedMaterial", oData.results[0].Material);
                            this.fnGetDroupDownlistWithValidation();
                        }
                    }.bind(this),
                    error: function (error) {
                        this.fnCheckError(error);
                    }.bind(this)
                });
            },
            fnGetDroupDownlistWithValidation: function () {
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var sMaterialData = oRoutingModel.getProperty("/selectedMaterial");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sMsgPlant = oBundle.getText("sPlantValidation");
                var sMsgGroup = oBundle.getText("sGroupValidation");
                var aFilter = [];
                aFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                aFilter.push(new Filter("Material", FilterOperator.EQ, sMaterialData));
                oDataModel.read("/ET_MaterialSet", {
                    async: true,
                    urlParameters: {
                        "$expand": ["Plant/Group/Available_GC", "Plant/CI"]
                    },
                    filters: aFilter,
                    success: function (oData) {
                        var aMessage = [];
                        var oMessageManager = sap.ui.getCore().getMessageManager();
                        oMessageManager.removeAllMessages();
                        var sGroupData = oRoutingModel.getProperty("/urlGroup");
                        var sPlantData = oRoutingModel.getProperty("/urlPlant");
                        if (oData.results.length > 0) {
                            oRoutingModel.setProperty("/aCIDynFilterDropDowns", oData.results);
                            oRoutingModel.setProperty("/aPlants", oData.results[0].Plant.results);
                            var PlantValidation = false;
                            for (var i = 0; i < oData.results[0].Plant.results.length; i++) {
                                var ODataPlant = oData.results[0].Plant.results[i].Plant;
                                if (ODataPlant === sPlantData) {
                                    PlantValidation = true;
                                    oRoutingModel.setProperty("/selectedPlant", sPlantData);
                                    oRoutingModel.setProperty("/selectedChangePlant", sPlantData);
                                    break;
                                }
                            }
                            if (!PlantValidation) {
                                oRoutingModel.setProperty("/selectedChangePlant", "");
                                oRoutingModel.setProperty("/selectedGroup", "");
                                oRoutingModel.setProperty("/selectedChangeGroup", "");
                                oRoutingModel.setProperty("/aGroups", []);
                                oRoutingModel.setProperty("/aGroupCountersTarget", []);
                                oRoutingModel.setProperty("/groupCounter", "");
                                oRoutingModel.setProperty("/selectedGroupCounter", "");
                                oRoutingModel.setProperty("/oTemplate", []);
                                oRoutingModel.setProperty("/selectedTemplate", "");
                                aMessage.push(sMsgPlant + " " + sPlantData);
                                MessageToast.show(aMessage);
                                oMessageManager.addMessages(new Message({
                                    message: sMsgPlant + " " + sPlantData
                                }));
                            }
                            if (PlantValidation) {
                                var aGrpSet = oData.results[0].Plant.results;
                                var aSelectedGrpList = aGrpSet.filter(function (oEle) {
                                    return (oEle["Plant"] === sPlantData);
                                });
                                oRoutingModel.setProperty("/aGroups", aSelectedGrpList[0].Group.results);
                                var GroupValidation = false;
                                for (var i = 0; i < aSelectedGrpList[0].Group.results.length; i++) {
                                    var ODataGroup = aSelectedGrpList[0].Group.results[i].Group_No;
                                    if (ODataGroup === sGroupData) {
                                        GroupValidation = true;
                                        oRoutingModel.setProperty("/selectedChangeGroup", sGroupData);
                                        oRoutingModel.setProperty("/selectedGroup", sGroupData);
                                        this.fnGetGroupCounterData();
                                        break;
                                    }
                                } if (!GroupValidation) {
                                    oRoutingModel.setProperty("/selectedGroup", "");
                                    oRoutingModel.setProperty("/aGroupCountersTarget", []);
                                    oRoutingModel.setProperty("/selectedChangeGroup", "");
                                    aMessage.push(sMsgGroup + " " + sGroupData);
                                    MessageToast.show(aMessage);
                                    oMessageManager.addMessages(new Message({
                                        message: sMsgGroup + " " + sGroupData
                                    }));
                                    this.fnGetGroupCounterData();
                                }
                                if (oRoutingModel.getProperty("/sCreateChangeIndex") === 0) {
                                    this.fnFetchTemplateData();
                                }
                            }
                        }
                    }.bind(this),
                    error: function (error) {
                        this.fnCheckError(error);
                    }.bind(this)
                });
            },
            fnGetGroupCounterData: function () {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var sGroupCounterData = oRoutingModel.getProperty("/urlGroupCounter");
                if (oRoutingModel.getProperty("/sCreateChangeIndex") === 0) {
                    var sGroup = oRoutingModel.getProperty("/selectedGroup");
                } else {
                    var sGroup = oRoutingModel.getProperty("/selectedChangeGroup");
                }
                if (sGroup !== "") {
                    var aGCounters = [];
                    oDataModel.read("/ET_Used_GCSet", {
                        filters: [new Filter("Plnnr", FilterOperator.EQ, sGroup)],
                        success: function (oData) {
                            var sGroupCounterData = oRoutingModel.getProperty("/urlGroupCounter");
                            if (oData.results.length > 0) {
                                var aGroupCountersArray = oData.results;
                                aGroupCountersArray.filter(function (c) {
                                    aGCounters.push({
                                        "Available_GC": c.Plnal
                                    });
                                });
                                oRoutingModel.setProperty("/aGroupCountersTarget", aGCounters);
                                var GroupCounterValidation = false;
                                for (var i = 0; i < oData.results.length; i++) {
                                    var ODataGroupCounter = oData.results[i].Plnal;
                                    if (ODataGroupCounter === sGroupCounterData) {
                                        GroupCounterValidation = true;
                                        oRoutingModel.setProperty("/selectedGroupCounter", sGroupCounterData);
                                        oRoutingModel.setProperty("/groupCounter", sGroupCounterData);
                                        this.getView().byId("groupcounterId").fireChange();
                                        break;
                                    }
                                }
                                if (!GroupCounterValidation) {
                                    oRoutingModel.setProperty("/groupCounter", sGroupCounterData);
                                    oRoutingModel.setProperty("/selectedGroupCounter", sGroupCounterData);
                                }
                            }
                            this.fnChangeModeSearch();
                        }.bind(this),
                        error: function (error) {
                            oBusyIndicator.close();
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
                else {
                    oRoutingModel.setProperty("/selectedGroupCounter", sGroupCounterData);
                }
            },
            fnChangeModeSearch: function () {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var iAOCI = oRoutingModel.getProperty("/selectedMaterial") || "";
                var sPlant = oRoutingModel.getProperty("/selectedChangePlant") || "";
                var iGroup = oRoutingModel.getProperty("/selectedChangeGroup") || "";
                var iCounter = oRoutingModel.getProperty("/groupCounter") || "";
                var sTaskListDesc = oRoutingModel.getProperty("/TaskListDesc") || "";
                var aFilters = [new sap.ui.model.Filter("Material", FilterOperator.EQ, iAOCI),
                new sap.ui.model.Filter("Plant", FilterOperator.EQ, sPlant),
                new sap.ui.model.Filter("Group_No", FilterOperator.EQ, iGroup),
                new sap.ui.model.Filter("Grp_Cntr", FilterOperator.EQ, iCounter),
                new sap.ui.model.Filter("Task_List_Desc", FilterOperator.EQ, sTaskListDesc),
                new sap.ui.model.Filter("End_User", FilterOperator.EQ, "X"),
                new sap.ui.model.Filter("Key_User", FilterOperator.EQ, "")
                ];
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                oDataModel.read("/ET_CEWB_LISTSet", {
                    filters: aFilters,
                    async: true,
                    success: function (oData) {
                        oBusyIndicator.close();
                        if (oData.results.length > 0) {
                            this.getView().getModel("oRoutingModel").setProperty("/aChangeTemplateDetails", oData.results);
                            this.getView().getModel("oRoutingModel").setProperty("/iChangeTemplateDetailsLength", oData.results.length);
                        }
                    }.bind(this),
                    error: function (error) {
                        oBusyIndicator.close();
                        this.fnCheckError(error);
                        // In case of error, clear previously fetched data also.
                        this.getView().getModel("oRoutingModel").setProperty("/aChangeTemplateDetails", []);
                        this.getView().getModel("oRoutingModel").setProperty("/iChangeTemplateDetailsLength", 0);
                    }.bind(this)
                });
            },
            fnFetchTemplateData: function () {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sMaterial = this.getView().getModel("oRoutingModel").getProperty("/selectedMaterial");
                var sPlant = this.getView().getModel("oRoutingModel").getProperty("/selectedPlant");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sMsgTemplate = oBundle.getText("sTemplateValidation");
                if (sMaterial && sPlant) {
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    var aFilter = [new sap.ui.model.Filter("Material", FilterOperator.EQ, sMaterial),
                    new sap.ui.model.Filter("Plant", FilterOperator.EQ, sPlant)
                    ];
                    oDataModel.read("/ET_TemplateSet", {
                        filters: aFilter,
                        success: function (oData) {
                            var aMessage = [];
                            var oMessageManager = sap.ui.getCore().getMessageManager();
                            var sSelecctTemplateData = oRoutingModel.getProperty("/urlselectedTemplate");
                            if (oData.results.length > 0) {
                                this.getView().getModel("oRoutingModel").setProperty("/oTemplate", oData.results);
                                var TemplateValidation = false;
                                for (var i = 0; i < oData.results.length; i++) {
                                    var ODataTemplate = oData.results[i].Template;
                                    if (ODataTemplate === sSelecctTemplateData) {
                                        TemplateValidation = true;
                                        oRoutingModel.setProperty("/selectedTemplate", oData.results[i].Template_no);
                                        oRoutingModel.setProperty("/selectedTemplatenumber", oData.results[i].Template_no);
                                        oRoutingModel.setProperty("/TemplateGroup", oData.results[i].Plnnr);
                                        oRoutingModel.setProperty("/TemplateGroupCounter", oData.results[i].Plnal);
                                        oRoutingModel.updateBindings(true);
                                        break;
                                    }
                                }
                                if (!TemplateValidation) {
                                    aMessage.push(sMsgTemplate + " " + sSelecctTemplateData);
                                    MessageToast.show(aMessage);
                                    oMessageManager.addMessages(new Message({
                                        message: sMsgTemplate + " " + sSelecctTemplateData
                                    }));
                                }
                            }
                        }.bind(this),
                        error: function (error) {
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
            },
            fnGroupSelectionData: function () {
                var that = this;
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oParameters = {
                    async: true,
                    success: function (oData, oResponse) {
                        var aReqData = oData.results;
                        aReqData.unshift({
                            ZPROFILE: "",
                            SELECT: ""
                        });
                        oRoutingModel.setProperty("/aUserGroupSelectionData", aReqData);
                        var aSelectedGrp = aReqData.filter(function (oEle) {
                            return (oEle["SELECT"] === "X");
                        });
                        oRoutingModel.setProperty("/sUserGroupSelection", aSelectedGrp[0].ZPROFILE);
                    },
                    error: function (error) {
                        that.fnCheckError(error);
                    }
                };
                oDataModel.read("/ET_PROFILESSet", oParameters);
            },
            fnGetUserDefaultData: function () {
                var that = this;
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var oVisibilityModel = this.getOwnerComponent().getModel("oVisibilityModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                oDataModel.read("/ET_User_DefaultsSet", {
                    success: function (oData, oResponse) {
                        if (oData.results[0].SYSID.substr(0, 1) === "D") {
                            oVisibilityModel.setProperty("/sMM01BtnName", oBundle.getText("DEMMM01"));
                        } else if (oData.results[0].SYSID.substr(0, 1) === "Q") {
                            oVisibilityModel.setProperty("/sMM01BtnName", oBundle.getText("QEMMM01"));
                        } else if (oData.results[0].SYSID.substr(0, 1) === "P") {
                            oVisibilityModel.setProperty("/sMM01BtnName", oBundle.getText("PEMMM01"));
                        } else {
                            oVisibilityModel.setProperty("/sMM01BtnName", "MM01");
                        }
                    }.bind(this),
                    error: function (error) {
                        this.fnCheckError(error);
                    }.bind(this),
                });
            },
            fnChangeRadioSelectionEndUser: function (oEvent) {
                var oSelection = oEvent.getSource().getSelectedIndex();
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                oRoutingModel.setProperty("/sCreateChangeIndex", oSelection);
                // Initially it should be visible and disappear when Change routing is selected.
                oVisibilityModel.setProperty("/bCreateSelectedEndUser", true);
                oVisibilityModel.setProperty("/bChangeSelectedSimpleForm", false);
                if (oSelection === 1) {
                    oVisibilityModel.setProperty("/bCreateSelectedEndUser", false);
                    oVisibilityModel.setProperty("/bChangeSelectedSimpleForm", true);
                    //clear fields 08/12/2022
                    oRoutingModel.setProperty("/selectedChangePlant", "");
                    oRoutingModel.setProperty("/selectedChangeGroup", "");
                    oRoutingModel.setProperty("/groupCounter", "");
                    oRoutingModel.setProperty("/TaskListDesc", "");
                }
            },
            fnChangeMaterial: function (oEvent, sDStype) {
                var aFilter = [],
                    sMaterial = oEvent.getParameter("value"),
                    sAOCIPath = "";
                var oMaterial = oEvent.getSource();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                oRoutingModel.setProperty("/sDSType", sDStype);
                if (sDStype === "MAOCI") {
                    sAOCIPath = oEvent.getSource().getBindingContext("oRoutingModel").getPath();
                    oRoutingModel.setProperty("/sAOCIPath", sAOCIPath);
                }
                // clear other fields
                this.fnClearfields(sDStype, sAOCIPath);
                // Added extra filters (Key user & End user) in ET_MaterialSet - New requirement from backend to 
                // differentiate between Key user & End user.
                var sKeyUser = oRoutingModel.getProperty("/keyUser");
                if (sKeyUser === "X") {
                    aFilter.push(new Filter("End_User", FilterOperator.EQ, ""));
                    aFilter.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                } else {
                    aFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                    aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                }
                // End

                if (sMaterial) {
                    if (sDStype === "CI" || sDStype === "MAOCI" || sDStype === "targetCI") {
                        aFilter.push(new Filter("Text", FilterOperator.EQ, sMaterial));
                        aFilter.push(new Filter("CI", FilterOperator.EQ, "X"));
                    } else {
                        aFilter.push(new Filter("Text", FilterOperator.EQ, sMaterial));
                    }
                    oDataModel.read("/ET_MaterialSet", {
                        filters: aFilter,
                        success: function (oData) {
                            oMaterial.setValueState("None");
                            oMaterial.setValueStateText("");
                            if (oData.results[0].MsgType !== "E") {
                                if (sDStype === "targetCI") {
                                    oRoutingModel.setProperty("/selectedTargetCIDesc", oData.results[0].Text);
                                } else if (sDStype === "CI") {
                                    oRoutingModel.setProperty("/selectedCIDesc", oData.results[0].Text);
                                } else if (sDStype === "MAOCI") {
                                    oRoutingModel.setProperty(sAOCIPath + "/MaterialDesc", oData.results[0].Text);
                                } else {
                                    oRoutingModel.setProperty("/selectedMaterialDesc", oData.results[0].Text);
                                }
                            } else if (oData.results[0].MsgType === "E") {
                                // Commented below line to make Material field not to highlight in red when empty
                                //oMaterial.setValueState("Error");
                                oMaterial.setValueStateText(oData.results[0].Msg);
                                oMaterial.setValue("");
                                MessageBox.show(oData.results[0].Msg, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: "Error",
                                    actions: [sap.m.MessageBox.Action.OK],
                                    styleClass: "sapUiSizeCompact"
                                });
                            } else {
                                if (sDStype === "targetCI") {
                                    oRoutingModel.setProperty("/selectedTargetCIDesc", "");
                                } else if (sDStype === "CI") {
                                    oRoutingModel.setProperty("/selectedCIDesc", "");
                                } else if (sDStype === "MAOCI") {
                                    oRoutingModel.setProperty(sAOCIPath + "/MaterialDesc", "");
                                } else {
                                    oRoutingModel.setProperty("/selectedMaterialDesc", "");
                                }
                            }
                            this.fnGetDropDownslist(sDStype, sAOCIPath); //Get dropdown list for Plant, Group and Groupcounter
                            //save the value in local storage
                            var sField = oMaterial.getBindingPath("suggestionItems").split("/")[1];
                            if (sField) {
                                this.fnUpdateLclStorage(sField, " " + sMaterial.trim(), "Material");
                            }
                        }.bind(this),
                        error: function (error) {
                            oMaterial.setValueState("Error");
                            var sMsg = oBundle.getText("materialvaluestatemsg", sMaterial);
                            oMaterial.setValueStateText(sMsg);
                            oMaterial.setValue("");
                            this.fnCheckError(error);
                        }.bind(this)
                    });

                } else {
                    oMaterial.setValueState("None");
                    oMaterial.setValueStateText("");
                }
            },
            fnClearfields: function (sDStype, sAOCIPath) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");

                if (sDStype === "targetCI") {
                    oRoutingModel.setProperty("/selectedTargetCIDesc", "");
                    oRoutingModel.setProperty("/aPlants", []);
                    oRoutingModel.setProperty("/selectedPlant", "");
                    oRoutingModel.setProperty("/aGroups", []);
                    oRoutingModel.setProperty("/selectedGroup", "");
                    oRoutingModel.setProperty("/aGroupCountersTarget", []);
                    oRoutingModel.setProperty("/selectedGroupCounter", "");
                    this.getView().byId("plantId").fireChange();
                    this.getView().byId("groupId").fireChange();
                } else if (sDStype === "CI") {
                    oRoutingModel.setProperty("/selectedCIDesc", "");
                    oRoutingModel.setProperty("/aCIPlants", []);
                    oRoutingModel.setProperty("/selectedCIPlant", "");
                    oRoutingModel.setProperty("/aCIGroups", []);
                    oRoutingModel.setProperty("/selectedCIGroup", "");
                    oRoutingModel.setProperty("/aCIGroupCounters", []);
                    oRoutingModel.setProperty("/selectedCIGroupCounter", "");
                    this.getView().byId("plantCIId").fireChange();
                    this.getView().byId("cigroupid").fireChange();
                } else if (sDStype === "MAOCI") {
                    oRoutingModel.setProperty(sAOCIPath + "/MaterialDesc", "");
                    oRoutingModel.setProperty(sAOCIPath + "/aMAOCIPlants", []);
                    oRoutingModel.setProperty(sAOCIPath + "/Plant", "");
                    oRoutingModel.setProperty(sAOCIPath + "/Plant_valueState", "None");
                    oRoutingModel.setProperty(sAOCIPath + "/Plant_valueStateText", "");
                } else {
                    oRoutingModel.setProperty("/selectedMaterialDesc", "");
                    oRoutingModel.setProperty("/aPlants", []);
                    oRoutingModel.setProperty("/selectedPlant", "");
                    oRoutingModel.setProperty("/aGroups", []);
                    oRoutingModel.setProperty("/selectedGroup", "");
                    oRoutingModel.setProperty("/selectedGroupCounter", "");
                    this.getView().byId("plantId").fireChange();
                    this.getView().byId("groupId").fireChange();
                    if (oRoutingModel.getProperty("/keyUser") !== "X") {
                        oRoutingModel.setProperty("/aGroupCounters", []);
                        oRoutingModel.setProperty("/oTemplate", []);
                        oRoutingModel.setProperty("/selectedTemplate", "");
                        oRoutingModel.setProperty("/selectedTemplatenumber", "");
                        oRoutingModel.setProperty("/TemplateGroup", "");
                        oRoutingModel.setProperty("/TemplateGroupCounter", "");
                    } else {
                        oRoutingModel.setProperty("/aGroupCountersTarget", []);
                        oRoutingModel.setProperty("/selectedAOCI", "");
                        oRoutingModel.setProperty("/selectedAOCIDesc", "");
                    }
                }
            },
            fnGetDropDownslist: function (sDStype, sAOCIPath) {
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                oDataModel.setSizeLimit(500);
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setSizeLimit(500);
                var sKeyUser = oRoutingModel.getProperty("/keyUser");
                var oSelIndex = oRoutingModel.getProperty("/sRoutingIndex");
                var sMaterial,
                    aFilter,
                    aFilters = [];
                if (sDStype === "CI") {
                    sMaterial = oRoutingModel.getProperty("/selectedCI");
                } else if (sDStype === "MAOCI") {
                    sMaterial = oRoutingModel.getProperty(sAOCIPath + "/Material") || "";
                } else {
                    sMaterial = (sDStype === "targetCI") ? oRoutingModel.getProperty("/selectedTargetCI") : oRoutingModel.getProperty(
                        "/selectedMaterial");
                }

                // Added extra filters (Key user & End user) in ET_MaterialSet - New requirement from backend to 
                // differentiate between Key user & End user.
                if (sKeyUser === "X") {
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                } else {
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, ""));
                }
                //End

                if (sKeyUser === "X" && (sDStype !== "CI" || sDStype === "targetCI") && (sDStype !== "MAOCI" || sDStype === "targetCI")) {
                    if (oSelIndex === 1) {
                        aFilter = new Filter("Create_From", FilterOperator.EQ, "N");
                        aFilters.push(aFilter);
                    } else if (oSelIndex === 2) {
                        aFilter = new Filter("Create_From", FilterOperator.EQ, "S");
                        aFilters.push(aFilter);
                    }
                }
                //Material filter default
                aFilters.push(new Filter("Material", FilterOperator.EQ, sMaterial));

                var oParameters = {
                    async: true,
                    urlParameters: {
                        "$expand": ["Plant/Group/Available_GC", "Plant/CI"]
                    },
                    filters: aFilters,
                    success: function (oData, oResponse) {
                        if (sDStype === "CI") {
                            if (oData.results.length > 0) {
                                oRoutingModel.setProperty("/aCIPlants", oData.results[0].Plant.results);
                                oRoutingModel.setProperty("/aCIDynFilterDropDowns", oData.results);

                                // Auto populating plant when there is only one value in Key user
                                if (oData.results[0].Plant.results.length === 1) {
                                    oRoutingModel.setProperty("/selectedCIPlant", oData.results[0].Plant.results[0].Plant);
                                    this.getView().byId("plantCIId").fireChange();
                                    // Set single plant in case of Change template radio button selection.
                                    if (oVisibilityModel.getProperty("/bChangeSelectedSimpleForm")) {
                                        oRoutingModel.setProperty("/selectedChangePlant", oData.results[0].Plant.results[0].Plant);
                                        this.getView().byId("changePlantID").fireChange();
                                    }
                                }
                                //End

                            } else {
                                oRoutingModel.setProperty("/aCIPlants", []);
                                oRoutingModel.setProperty("/aCIDynFilterDropDowns", oData.results);
                            }
                        } else if (sDStype === "MAOCI") {
                            if (oData.results.length > 0) {
                                oRoutingModel.setProperty(sAOCIPath + "/aMAOCIPlants", oData.results[0].Plant.results);
                            } else {
                                oRoutingModel.setProperty(sAOCIPath + "/aMAOCIPlants", []);
                            }
                        } else {
                            if (oData.results.length > 0) {
                                oRoutingModel.setProperty("/aDynFilterDropDowns", oData.results);
                                oRoutingModel.setProperty("/aPlants", oData.results[0].Plant.results);

                                // Auto populating plant when there is only one value in End user
                                if (oData.results[0].Plant.results.length === 1) {
                                    oRoutingModel.setProperty("/selectedPlant", oData.results[0].Plant.results[0].Plant);
                                    this.getView().byId("plantId").fireChange();

                                    // Set single plant in case of Change template radio button selection.
                                    if (oVisibilityModel.getProperty("/bChangeSelectedSimpleForm")) {
                                        oRoutingModel.setProperty("/selectedChangePlant", oData.results[0].Plant.results[0].Plant);
                                        this.getView().byId("changePlantID").fireChange();
                                    }
                                }
                                //End
                            } else {
                                oRoutingModel.setProperty("/aDynFilterDropDowns", []);
                                oRoutingModel.setProperty("/aPlants", []);
                            }
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.fnCheckError(oError);
                    }.bind(this)
                };
                //Fetches dropdown values via expand
                oDataModel.read("/ET_MaterialSet", oParameters);
            },
            fnUpdateLclStorage: function (sFieldName, sSelVal, sElmntName) {
                if (sSelVal !== " ") {
                    sap.ui.require(["sap/ui/util/Storage"], function (Storage) {
                        var oStorage = new Storage(Storage.Type.local),
                            aStorageData = JSON.parse(oStorage.get("localSugData"));
                        if (aStorageData && aStorageData[sFieldName]) {
                            var oTemObj = {};
                            oTemObj[sElmntName] = sSelVal;
                            aStorageData[sFieldName].splice(0, 0, oTemObj);
                            //remove duplicates
                            aStorageData[sFieldName] = aStorageData[sFieldName].filter(function (oValue, iIndex, oSelf) {
                                return iIndex === oSelf.findIndex(function (t) {
                                    return t[sElmntName] === oValue[sElmntName];
                                });
                            });
                            aStorageData[sFieldName] = aStorageData[sFieldName].slice(0, 20);

                        } else {
                            //if there is no storage data then create a new one
                            if (!aStorageData) {
                                aStorageData = {};
                            }
                            var oTemElmntObj = {};
                            oTemElmntObj[sElmntName] = sSelVal;
                            aStorageData[sFieldName] = [oTemElmntObj];

                        }
                        //put the updated data on storage
                        oStorage.put("localSugData", JSON.stringify(aStorageData));
                    });
                }
            },
            fnCheckError: function (error) {
                var msgText;
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                if (error.statusCode === 500) {
                    msgText = error.message;
                } else {
                    msgText = (JSON.parse(error.responseText)).error.message.value;
                }
                MessageBox.show(msgText, {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: oBundle.getText("globalError"),
                    actions: [sap.m.MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact"
                });
            },
            fnUserGroupSelectionChange: function () {
                var that = this;
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sSelGroup = oRoutingModel.getProperty("/sUserGroupSelection");
                var oPayload = {
                    "PARVA": sSelGroup
                };
                var oParameters = {
                    success: function (oData, oResponse) {
                        sap.m.MessageToast.show(oBundle.getText("changeTemplate.GroupSelChange"), {
                            duration: 2000,
                            width: "25em"
                        });
                        that.fnGroupSelectionData();
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.create("/ET_UPD_PROFILESSet", oPayload, oParameters);
            },
            fnGroupSelectionData: function () {
                var that = this;
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oParameters = {
                    async: true,
                    success: function (oData, oResponse) {
                        var aReqData = oData.results;
                        aReqData.unshift({
                            ZPROFILE: "",
                            SELECT: ""
                        });
                        oRoutingModel.setProperty("/aUserGroupSelectionData", aReqData);
                        var aSelectedGrp = aReqData.filter(function (oEle) {
                            return (oEle["SELECT"] === "X");
                        });
                        oRoutingModel.setProperty("/sUserGroupSelection", aSelectedGrp[0].ZPROFILE);
                    },
                    error: function (error) {
                        that.fnCheckError(error);
                    }
                };
                oDataModel.read("/ET_PROFILESSet", oParameters);
            },
            fnValuehelpMaterial: function (oEvent, sDSType) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sDSType", sDSType);
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.DSValueHelp", this);
                    this.getView().addDependent(this._oValueHelpDialog);
                    this._oValueHelpDialog.setModel(oRoutingModel, "oRoutingModel");
                    this._oValueHelpDialog.setModel("i18n");
                }
                var oModel = this._oValueHelpDialog.getModel("oSrvModel");
                this.fnBusyforservice(oModel); //To open busy dialog
                //save the suggestion path
                this.sStorageFieldName = oEvent.getSource().getBindingPath("suggestionItems").split("/")[1];
                this._oValueHelpDialog.open();
            },
            fnBusyforservice: function (oModel) {
                if (oModel) {
                    var oBusyIndicator = new BusyDialog();
                    oBusyIndicator.open();
                    oModel.attachRequestCompleted(function (oData) {
                        oBusyIndicator.close();
                    });
                }
            },
            /*This method triggered when user is typing in material input*/
            fnMaterialLivechange: function (oEvent, sDSType) {
                var aFilter = [];
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel"),
                    oSrc = oEvent.getSource();

                if (oSrc.getValue().trim() === "") {
                    this.fnGetLoclStorageData(oEvent, "oRoutingModel");
                } else {

                    // Developer: NG7BBC6  Date: 31-08-2021
                    // Added extra filters (Key user & End user) in ET_MaterialSet - New requirement from backend to 
                    // differentiate between Key user & End user.
                    var sKeyUser = oRoutingModel.getProperty("/keyUser");
                    if (sKeyUser === "X") {
                        aFilter.push(new Filter("End_User", FilterOperator.EQ, ""));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    } else {
                        aFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    }
                    //End

                    if (sDSType === "CI" || sDSType === "MAOCI") {
                        oRoutingModel.setProperty("/aSuggestCIs", []);
                        aFilter.push(new Filter("Text", FilterOperator.Contains, oEvent.getSource().getValue()));
                        aFilter.push(new Filter("CI", FilterOperator.EQ, "X"));
                    } else if (sDSType === "targetCI") {
                        oRoutingModel.setProperty("/aSuggesttargetCIs", []);
                        aFilter.push(new Filter("Text", FilterOperator.Contains, oEvent.getSource().getValue()));
                        aFilter.push(new Filter("CI", FilterOperator.EQ, "X"));
                    } else {
                        oRoutingModel.setProperty("/aSuggestMaterials", []);
                        aFilter.push(new Filter("Text", FilterOperator.Contains, oEvent.getSource().getValue()));
                    }

                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    oDataModel.read("/ET_MaterialSet", {
                        filters: aFilter,
                        success: function (oData) {
                            oRoutingModel.setProperty("/aSuggestMaterials", oData.results);
                            if (sDSType === "CI" || sDSType === "MAOCI") {
                                oRoutingModel.setProperty("/aSuggestCIs", oData.results);
                            } else if (sDSType === "targetCI") {
                                oRoutingModel.setProperty("/aSuggesttargetCIs", oData.results);
                            } else {
                                oRoutingModel.setProperty("/aSuggestMaterials", oData.results);
                            }
                            oRoutingModel.refresh();
                        }.bind(this),
                        error: function (error) {
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
            },
            /*This method used to clear respective fields from key user initial screen*/
            fnClearfields: function (sDStype, sAOCIPath) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");

                if (sDStype === "targetCI") {
                    oRoutingModel.setProperty("/selectedTargetCIDesc", "");
                    oRoutingModel.setProperty("/aPlants", []);
                    oRoutingModel.setProperty("/selectedPlant", "");
                    oRoutingModel.setProperty("/aGroups", []);
                    oRoutingModel.setProperty("/selectedGroup", "");
                    oRoutingModel.setProperty("/aGroupCountersTarget", []);
                    oRoutingModel.setProperty("/selectedGroupCounter", "");
                    this.getView().byId("plantId").fireChange();
                    this.getView().byId("groupId").fireChange();

                } else if (sDStype === "CI") {
                    oRoutingModel.setProperty("/selectedCIDesc", "");
                    oRoutingModel.setProperty("/aCIPlants", []);
                    oRoutingModel.setProperty("/selectedCIPlant", "");
                    oRoutingModel.setProperty("/aCIGroups", []);
                    oRoutingModel.setProperty("/selectedCIGroup", "");
                    oRoutingModel.setProperty("/aCIGroupCounters", []);
                    oRoutingModel.setProperty("/selectedCIGroupCounter", "");
                    this.getView().byId("plantCIId").fireChange();
                    this.getView().byId("cigroupid").fireChange();
                } else if (sDStype === "MAOCI") {
                    oRoutingModel.setProperty(sAOCIPath + "/MaterialDesc", "");
                    oRoutingModel.setProperty(sAOCIPath + "/aMAOCIPlants", []);
                    oRoutingModel.setProperty(sAOCIPath + "/Plant", "");
                    oRoutingModel.setProperty(sAOCIPath + "/Plant_valueState", "None");
                    oRoutingModel.setProperty(sAOCIPath + "/Plant_valueStateText", "");
                } else {
                    oRoutingModel.setProperty("/selectedMaterialDesc", "");
                    oRoutingModel.setProperty("/aPlants", []);
                    oRoutingModel.setProperty("/selectedPlant", "");
                    oRoutingModel.setProperty("/aGroups", []);
                    oRoutingModel.setProperty("/selectedGroup", "");
                    oRoutingModel.setProperty("/selectedGroupCounter", "");
                    this.getView().byId("plantId").fireChange();
                    this.getView().byId("groupId").fireChange();
                    if (oRoutingModel.getProperty("/keyUser") !== "X") {
                        oRoutingModel.setProperty("/aGroupCounters", []);
                        oRoutingModel.setProperty("/oTemplate", []);
                        oRoutingModel.setProperty("/selectedTemplate", "");
                        oRoutingModel.setProperty("/selectedTemplatenumber", "");
                        oRoutingModel.setProperty("/TemplateGroup", "");
                        oRoutingModel.setProperty("/TemplateGroupCounter", "");
                    } else {
                        oRoutingModel.setProperty("/aGroupCountersTarget", []);
                        oRoutingModel.setProperty("/selectedAOCI", "");
                        oRoutingModel.setProperty("/selectedAOCIDesc", "");
                    }
                }
            },
            /*Params : oEvent, sDStype This method triggered when user is typing in material input*/
            fnMaterialLivechange: function (oEvent, sDSType) {
                var aFilter = [];
                var oRoutingModel = this.getOwnerComponent().getModel("oRoutingModel"),
                    oSrc = oEvent.getSource();

                if (oSrc.getValue().trim() === "") {
                    this.fnGetLoclStorageData(oEvent, "oRoutingModel");
                } else {
                    // Added extra filters (Key user & End user) in ET_MaterialSet - New requirement from backend to 
                    // differentiate between Key user & End user.
                    var sKeyUser = oRoutingModel.getProperty("/keyUser");
                    if (sKeyUser === "X") {
                        aFilter.push(new Filter("End_User", FilterOperator.EQ, ""));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    } else {
                        aFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    }

                    if (sDSType === "CI" || sDSType === "MAOCI") {
                        oRoutingModel.setProperty("/aSuggestCIs", []);
                        aFilter.push(new Filter("Text", FilterOperator.Contains, oEvent.getSource().getValue()));
                        aFilter.push(new Filter("CI", FilterOperator.EQ, "X"));
                    } else if (sDSType === "targetCI") {
                        oRoutingModel.setProperty("/aSuggesttargetCIs", []);
                        aFilter.push(new Filter("Text", FilterOperator.Contains, oEvent.getSource().getValue()));
                        aFilter.push(new Filter("CI", FilterOperator.EQ, "X"));
                    } else {
                        oRoutingModel.setProperty("/aSuggestMaterials", []);
                        aFilter.push(new Filter("Text", FilterOperator.Contains, oEvent.getSource().getValue()));
                    }

                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    oDataModel.read("/ET_MaterialSet", {
                        filters: aFilter,
                        success: function (oData) {
                            oRoutingModel.setProperty("/aSuggestMaterials", oData.results);
                            if (sDSType === "CI" || sDSType === "MAOCI") {
                                oRoutingModel.setProperty("/aSuggestCIs", oData.results);
                            } else if (sDSType === "targetCI") {
                                oRoutingModel.setProperty("/aSuggesttargetCIs", oData.results);
                            } else {
                                oRoutingModel.setProperty("/aSuggestMaterials", oData.results);
                            }
                            oRoutingModel.refresh();
                        }.bind(this),
                        error: function (error) {
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
            },
            /* Params : oEvent, sDStype This method triggered when user changes plant.*/
            fnChangePlant: function (oEvent, sDStype) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oPlant = oEvent.getSource();
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var oSelectedItem = oPlant.getSelectedItem();
                var sPlant = "",
                    aAOCI = [],
                    aGroup = [];
                // clear respective filters
                if (sDStype === "CI") {
                    oRoutingModel.setProperty("/aCIGroups", []);
                    oRoutingModel.setProperty("/selectedCIGroup", "");
                    oRoutingModel.setProperty("/aCIGroupCounters", []);
                    oRoutingModel.setProperty("/selectedCIGroupCounter", "");
                    this.getView().byId("cigroupid").fireChange();
                    this.getView().byId("cigroupcounterId").fireChange();
                } else if (sDStype === "targetCI") {
                    oRoutingModel.setProperty("/aGroups", []);
                    oRoutingModel.setProperty("/selectedGroup", "");
                    oRoutingModel.setProperty("/aGroupCountersTarget", []);
                    oRoutingModel.setProperty("/selectedGroupCounter", "");
                    this.getView().byId("groupId").fireChange();
                    this.getView().byId("groupcounterId").fireChange();
                } else {
                    oRoutingModel.setProperty("/aGroups", []);
                    oRoutingModel.setProperty("/selectedGroup", "");
                    oRoutingModel.setProperty("/selectedGroupCounter", "");
                    this.getView().byId("groupId").fireChange();
                    if (oRoutingModel.getProperty("/keyUser") !== "X") {
                        oRoutingModel.setProperty("/aGroupCounters", []);
                        oRoutingModel.setProperty("/oTemplate", []);
                        oRoutingModel.setProperty("/selectedTemplate", "");
                        oRoutingModel.setProperty("/selectedTemplatenumber", "");
                        oRoutingModel.setProperty("/TemplateGroup", "");
                        oRoutingModel.setProperty("/TemplateGroupCounter", "");
                        this.getView().byId("groupcounterId").fireChange();
                    } else {
                        oRoutingModel.setProperty("/aGroupCountersTarget", []);
                        oRoutingModel.setProperty("/selectedAOCI", "");
                        oRoutingModel.setProperty("/selectedAOCIDesc", "");
                        this.getView().byId("cigroupcounterId").fireChange();
                    }
                }
                var sPlantVal = oPlant.getValue();
                if (oSelectedItem) {
                    sPlant = oSelectedItem.getKey();
                    oPlant.setValueState("None");
                    oPlant.setValueStateText("");
                    aGroup = oSelectedItem.getBindingContext("oRoutingModel").getProperty("Group");
                    aAOCI = oSelectedItem.getBindingContext("oRoutingModel").getProperty("CI");
                    if (aAOCI.results.length > 0) {
                        var sSelectedAOCI = aAOCI.results[0].CI;
                        var sSelectedAOCIDesc = aAOCI.results[0].Text;
                    } else {
                        sSelectedAOCI = "";
                        sSelectedAOCIDesc = "";
                    }
                    if (sDStype === "CI") {
                        oRoutingModel.setProperty("/selectedCIPlant", sPlant);
                        oRoutingModel.setProperty("/aCIGroups", aGroup.results);
                        var aPlantList = oRoutingModel.getProperty("/aCIPlants");
                        var aSelectedPlantDataSet = aPlantList.filter(function (oEle) {
                            return (oEle["Plant"] === sPlant);
                        });
                        oRoutingModel.setProperty("/selectedCIPlantSetDate", aSelectedPlantDataSet[0].Alloc_date);
                        oRoutingModel.setProperty("/sDefaultPlantSetDate", aSelectedPlantDataSet[0].Alloc_date);
                    } else {
                        oRoutingModel.setProperty("/selectedPlant", sPlant);
                        oRoutingModel.setProperty("/aGroups", aGroup.results);
                        if (aGroup.results.length === 1) {
                            oRoutingModel.setProperty("/selectedGroup", aGroup.results[0].Group_No);
                            this.getView().byId("groupId").fireChange();
                            // Set single Group in case of Change template radio button selection.
                            if (oVisibilityModel.getProperty("/bChangeSelectedSimpleForm")) {
                                oRoutingModel.setProperty("/selectedChangeGroup", aGroup.results[0].Group_No);
                                this.getView().byId("changeGroupID").fireChange();
                            }
                        }
                        oRoutingModel.setProperty("/selectedAOCI", sSelectedAOCI);
                        oRoutingModel.setProperty("/selectedAOCIDesc", sSelectedAOCIDesc);
                    }
                    if (oRoutingModel.getProperty("/keyUser") === "") {
                        this.fnFetchTemplate(); // To fetch list of templates based on DS and CI logic
                    }
                } else if (sPlantVal.length > 0) {
                    var sMaterial;
                    if (sDStype === "CI") {
                        oRoutingModel.setProperty("/selectedCIPlant", sPlant);
                        sMaterial = oRoutingModel.getProperty("/selectedMaterial");
                        oRoutingModel.setProperty("/aCIGroups", aGroup);
                    } else {
                        oRoutingModel.setProperty("/selectedPlant", sPlant);
                        sMaterial = oRoutingModel.getProperty("/selectedMaterial");
                        oRoutingModel.setProperty("/aGroups", aGroup);
                        oRoutingModel.setProperty("/selectedAOCI", sSelectedAOCI);
                        oRoutingModel.setProperty("/selectedAOCIDesc", sSelectedAOCIDesc);
                    }
                    oPlant.setValueState("Error");
                    var oBundle = this.getView().getModel("i18n").getResourceBundle();
                    var sMsg = oBundle.getText("plantvaluestatemsg", [sMaterial, sPlantVal]);
                    oPlant.setValueStateText(sMsg);

                } else {
                    oPlant.setValueState("None");
                }
            },
            fnFetchTemplate: function () {
                var that = this;
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sMaterial = this.getView().getModel("oRoutingModel").getProperty("/selectedMaterial");
                var sPlant = this.getView().getModel("oRoutingModel").getProperty("/selectedPlant");
                // No template found error is coming even though when the user is in Change Radio button which should not happen
                // That error should be shown only in Create screen.
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var bChangeRadioSel = oVisibilityModel.getProperty("/bChangeSelectedSimpleForm");

                if (sMaterial && sPlant) {
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    var aFilter = [new sap.ui.model.Filter("Material", FilterOperator.EQ, sMaterial),
                    new sap.ui.model.Filter("Plant", FilterOperator.EQ, sPlant)
                    ];
                    oDataModel.read("/ET_TemplateSet", {
                        filters: aFilter,
                        success: function (oData) {
                            if (oData.results.length > 0) {
                                this.getView().getModel("oRoutingModel").setProperty("/oTemplate", oData.results);
                                if (oData.results.length === 1 && oData.results[0].Status === "ME") {
                                    that.fnEndUserSelectTemplate("", oData.results[0].Template_no, oData.results[0].Template);
                                }
                            }
                        }.bind(this),
                        error: function (error) {
                            // No template found error fix
                            if (!bChangeRadioSel) {
                                this.fnCheckError(error);
                            }
                        }.bind(this)
                    });
                }
            },
            fnEndUserSelectTemplate: function (oEvent, sTempNo, sTemp) {
                var that = this;
                var oEvt = oEvent;
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sTemplateNumber = "", sTemplateText = "";
                if (sTempNo && sTemp) {
                    sTemplateNumber = sTempNo;
                    sTemplateText = sTemp;
                } else {
                    sTemplateNumber = oRoutingModel.getProperty(oEvent.getSource().getBindingContext("oRoutingModel").sPath + "/Template_no");
                    sTemplateText = oRoutingModel.getProperty(oEvent.getSource().getBindingContext("oRoutingModel").sPath + "/Template");
                }
                oRoutingModel.setProperty("/selectedTemplate", sTemplateText);
                oRoutingModel.setProperty("/selectedTemplatenumber", sTemplateNumber);
                if (sTemplateNumber.length > 9) {
                    oRoutingModel.setProperty("/TemplateGroup", sTemplateNumber.slice(0, 8));
                    oRoutingModel.setProperty("/TemplateGroupCounter", sTemplateNumber.slice(8));
                    //This change is done to prefill the Source Group Counter with the value same as Source Group counter
                    var sCounter = oRoutingModel.getProperty("/TemplateGroupCounter");
                    this.getView().byId("groupcounterId").setValue(sCounter);
                    // To get rid of validation error
                    oRoutingModel.setProperty("/selectedGroupCounter", sCounter);
                } else {
                    oRoutingModel.setProperty("/TemplateGroup", "");
                    oRoutingModel.setProperty("/TemplateGroupCounter", "");
                }
                if (sTemplateNumber) {
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    var aFilter = [new sap.ui.model.Filter("Template_no", FilterOperator.EQ, sTemplateNumber)];
                    oDataModel.read("/ET_TemplateSet", {
                        filters: aFilter,
                        async: true,
                        urlParameters: {
                            "$expand": ["Template_GC"]
                        },
                        success: function (oData) {
                            if (oData.results.length > 0) {
                                if (oRoutingModel.getProperty("/keyUser") === "") {
                                    oRoutingModel.setProperty("/aGroupCounters", [{
                                        "Template_GC": sTemplateNumber.slice(8)
                                    }]);
                                    oRoutingModel.refresh();
                                    this.getView().byId("groupcounterId").fireChange();
                                } else {
                                    oRoutingModel.setProperty("/aGroupCounters", oData.results[0].Template_GC.results);
                                }
                            }
                            if (oEvt !== "") {
                                that._SelectTemplateHelpDialog.close();
                                that._SelectTemplateHelpDialog.destroy();
                                delete that._SelectTemplateHelpDialog;
                            }
                        }.bind(this),
                        error: function (error) {
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
            },
            fnChangeGroup: function (oEvent, sDStype) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var oGroup = oEvent.getSource();
                var oSelectedItem = oGroup.getSelectedItem();
                var sGroup = "";
                sGroup = oGroup.getValue();
                // clear respective filters 
                if (oSelectedItem) {
                    sGroup = oSelectedItem.getKey();
                    oGroup.setValueState("None");
                    oGroup.setValueStateText("");
                    // OData service call to fetch all the group counters based on selected Group.
                    var oBusyIndicator = new BusyDialog();
                    oBusyIndicator.open();
                    var aGCounters = [];
                    oDataModel.read("/ET_Used_GCSet", {
                        filters: [new Filter("Plnnr", FilterOperator.EQ, sGroup)],
                        success: function (oData) {
                            oBusyIndicator.close();
                            var aGroupCountersArray = oData.results;
                            aGroupCountersArray.filter(function (c) {
                                aGCounters.push({
                                    "Available_GC": c.Plnal
                                });
                            });
                            if (sDStype === "CI") {
                                oRoutingModel.setProperty("/selectedCIGroup", sGroup);
                                oRoutingModel.setProperty("/aCIGroupCounters", aGCounters);
                            } else {
                                oRoutingModel.setProperty("/selectedGroup", sGroup);
                                oRoutingModel.setProperty("/aGroupCountersTarget", aGCounters);
                                // Setting the group counter of Target as per Source
                                // 08-02-2022 Below code is written to resolve the issue of group counters not populating and giving busy indicator when group is selected
                                var sKeyUserIndex = oRoutingModel.getProperty("/sRoutingIndex");
                                if (sKeyUserIndex !== 1 && sKeyUserIndex !== 2) {
                                    this.getView().byId("groupcounterId").fireChange(); //Fire GC change event
                                }
                                this.getView().byId("groupcounterId").setValue(oRoutingModel.getProperty("/TemplateGroupCounter"));
                                oRoutingModel.setProperty("/selectedGroupCounter", oRoutingModel.getProperty("/TemplateGroupCounter"));
                                oRoutingModel.refresh();
                                if (aGCounters.length === 1) {
                                    //Commented below line to stop prefilling on Group Counter on single group counter
                                    // Set single Group counter in case of Change template radio button selection.
                                    if (oVisibilityModel.getProperty("/bChangeSelectedSimpleForm")) {
                                        oRoutingModel.setProperty("/groupCounter", aGCounters[0].Available_GC);
                                    }
                                }
                            }
                        }.bind(this),
                        error: function (error) {
                            oBusyIndicator.close();
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                } else if (sGroup === "") {
                    oGroup.setValueState("None");
                    oGroup.setValueStateText("");
                    if (sDStype === "CI") {
                        oRoutingModel.setProperty("/aCIGroupCounters", []);
                    } else {
                        oRoutingModel.setProperty("/aGroupCountersTarget", []);
                    }
                } else {
                    oGroup.setValueState("Error");
                    oGroup.setValueStateText("Group number not found");
                    if (sDStype === "CI") {
                        oRoutingModel.setProperty("/selectedCIGroup", sGroup);
                        oRoutingModel.setProperty("/aCIGroupCounters", []);
                    } else {
                        oRoutingModel.setProperty("/selectedGroup", sGroup);
                        oRoutingModel.setProperty("/aGroupCountersTarget", []);
                    }
                }
                if (oRoutingModel.getProperty("/keyUser") === "") {
                } else if (sDStype === "CI") {
                    this.getView().byId("cigroupcounterId").fireChange();
                    this.getView().byId("cigroupcounterId").setValue("");
                    this.getView().byId("cigroupcounterId").setSelectedItem("");
                }
            },
            fnChangeGroupCounter: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var oSelectedItem = this.getView().byId("groupcounterId").getSelectedItem();
                var sGroupCounter = "";

                if (oSelectedItem) {
                    //sGroupCounter = oSelectedItem.getKey();
                    sGroupCounter = oEvent.getSource().getSelectedKey();
                } else {
                    sGroupCounter = this.getView().byId("groupcounterId").getValue();
                    if (sGroupCounter !== "") {
                        // Validation for only numbers and max 2 digits
                        // NG7BBC6  Date: 08-10-2021
                        var sRegExp = (/^[0-9]+$/);
                        var bMatched = sRegExp.test(sGroupCounter);
                        var sInvalidMsg = oBundle.getText("counterinvalifvaluestatemsg");

                        if (bMatched === false) {
                            // Empty the field
                            this.getView().byId("groupcounterId").setValue("");
                            oRoutingModel.setProperty("/selectedGroupCounter", "");
                            this.getView().byId("groupcounterId").setValueState("Error");
                            this.getView().byId("groupcounterId").setValueStateText(sInvalidMsg);
                            oRoutingModel.setProperty("/bErrorForGcounterValidation", true);
                            return;
                        } else if (sGroupCounter > 99) {
                            this.getView().byId("groupcounterId").setValueState("Error");
                            this.getView().byId("groupcounterId").setValueStateText(sInvalidMsg);
                            oRoutingModel.setProperty("/bErrorForGcounterValidation", true);
                            return;
                        } else {
                            this.getView().byId("groupcounterId").setValueState("None");
                            this.getView().byId("groupcounterId").setValueStateText("");
                            sGroupCounter = ('0' + sGroupCounter).slice(-2);
                            oRoutingModel.setProperty("/bErrorForGcounterValidation", false);
                        }
                        // End
                    }
                }
                oRoutingModel.setProperty("/selectedGroupCounter", sGroupCounter);
                if (sGroupCounter !== "") {
                    var aTargetGroupCounters = oRoutingModel.getProperty("/aGroupCountersTarget");
                    var aCounter = $.grep(aTargetGroupCounters, function (e) {
                        return e.Available_GC == sGroupCounter;
                    });

                    if (aCounter.length > 0) {
                        this.getView().byId("groupcounterId").setValueState("Error");
                        var sGP = oRoutingModel.getProperty("/selectedGroup");
                        var sMsg = oBundle.getText("countervaluestatemsg", [sGP, sGroupCounter]);
                        this.getView().byId("groupcounterId").setValueStateText(sMsg);
                    } else {
                        this.getView().byId("groupcounterId").setValueState("None");
                        this.getView().byId("groupcounterId").setValueStateText("");
                    }
                } else {
                    this.getView().byId("groupcounterId").setValueState("None");
                    this.getView().byId("groupcounterId").setValueStateText("");
                }
            },
            fnSelectionChangeTemplate: function () {
                var oSelectedItem = this.getView().byId("selecttemplateId").getSelectedItem();
                var sTemplateNumber = oSelectedItem.getKey();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/selectedTemplate", oSelectedItem.getText());
                oRoutingModel.setProperty("/selectedTemplatenumber", sTemplateNumber);
                if (sTemplateNumber.length > 9) {
                    oRoutingModel.setProperty("/TemplateGroup", sTemplateNumber.slice(0, 8));
                    oRoutingModel.setProperty("/TemplateGroupCounter", sTemplateNumber.slice(8));
                    //Date:19th Jan,2022 This change is done to prefill the Source Group Counter with the value same as Source Group counter
                    var sCounter = oRoutingModel.getProperty("/TemplateGroupCounter");
                    this.getView().byId("groupcounterId").setValue(sCounter);

                    // To get rid of validation error
                    oRoutingModel.setProperty("/selectedGroupCounter", sCounter);
                } else {
                    oRoutingModel.setProperty("/TemplateGroup", "");
                    oRoutingModel.setProperty("/TemplateGroupCounter", "");
                }

                if (oSelectedItem) {
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    var aFilter = [new sap.ui.model.Filter("Template_no", FilterOperator.EQ, oSelectedItem.getKey())];
                    oDataModel.read("/ET_TemplateSet", {
                        filters: aFilter,
                        async: true,
                        urlParameters: {
                            "$expand": ["Template_GC"]
                        },
                        success: function (oData) {
                            if (oData.results.length > 0) {
                                if (oRoutingModel.getProperty("/keyUser") === "") {
                                    oRoutingModel.setProperty("/aGroupCounters", [{
                                        "Template_GC": sTemplateNumber.slice(8)
                                    }]);
                                    oRoutingModel.refresh();
                                    this.getView().byId("groupcounterId").fireChange();
                                } else {
                                    oRoutingModel.setProperty("/aGroupCounters", oData.results[0].Template_GC.results);
                                }
                            }
                        }.bind(this),
                        error: function (error) {
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
            },
            /*This method used to create Routing and get Routing details on success.*/
            fnCreate: function () {
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var oSelIndex = oRoutingModel.getProperty("/sRoutingIndex") || -1;
                var sKeyUser = oRoutingModel.getProperty("/keyUser") || "";
                //show pop over to users on click of close tab and back button  
                sap.ushell.Container.setDirtyFlag(false);
                // Getting Group results to compare if Group dropdown contains more than 1 entry and if it is empty, then throw an error.
                var aGroupArrayEndUser = oRoutingModel.getProperty("/aGroups");
                //var aCIGroupArrayKeyUser = oRoutingModel.getProperty("/aCIGroups");
                var sMsg;
                if (oSelIndex === -1 && sKeyUser === "X") {
                    var sMsgindex = oBundle.getText("selectroutingmsg");
                    MessageBox.error(sMsgindex);
                    return;
                }
                var bMandate = false;
                var sMaterial = oRoutingModel.getProperty("/selectedMaterial") || "";
                var sPlant = oRoutingModel.getProperty("/selectedPlant") || "";
                var sTemplateNo = oRoutingModel.getProperty("/selectedTemplatenumber") || "";
                var sGroupNumber = oRoutingModel.getProperty("/selectedGroup") || "";
                var sGroupunter = oRoutingModel.getProperty("/selectedGroupCounter") || "";
                var sCIMaterial = oRoutingModel.getProperty("/selectedCI") || "";
                var sCITarget = oRoutingModel.getProperty("/selectedTargetCI") || "";
                var sCIPlant = oRoutingModel.getProperty("/selectedCIPlant") || "";
                var sCIGroupNumber = oRoutingModel.getProperty("/selectedCIGroup") || "";
                var sCIGroupunter = oRoutingModel.getProperty("/selectedCIGroupCounter") || "";
                var aMultipleAOCI = oRoutingModel.getProperty("/aMAOCI") || [];
                //Check for Mandatory fields
                if (sKeyUser === "X") {
                    // Check mandatory fields for multiple aoci
                    var bMandateMAOCI = this.fnCheckMandatoryforMAOCI(aMultipleAOCI);
                    if (oSelIndex === 1) {
                        if (sMaterial && sPlant && sGroupNumber && sGroupunter && sCIMaterial && sCIPlant && sCIGroupunter && bMandateMAOCI) {
                            bMandate = true;
                        } else {
                            sMsg = oBundle.getText("createmandatoryforCopyrouting");
                        }
                    } else {
                        if (sCITarget && sPlant && sGroupNumber && sGroupunter && sCIMaterial && sCIPlant && sCIGroupunter && bMandateMAOCI) {
                            bMandate = true;
                        } else {
                            sMsg = oBundle.getText("createmandatoryforCopyTemplate");
                        }
                    }
                } else {
                    if (sMaterial && sPlant && sTemplateNo && sGroupunter) {
                        // Validation for mandatory Group value if Group is empty and containing values in dropdown
                        if (aGroupArrayEndUser.length >= 1) {
                            if (sGroupNumber) {
                                bMandate = true;
                            } else {
                                sMsg = oBundle.getText("groupmandatorymsg");
                            }
                        } else {
                            bMandate = true;
                        }
                    } else {
                        sMsg = oBundle.getText("createmandatoryfields");
                    }
                }
                if (sCIGroupNumber) {
                    if (this.getView().byId("cigroupid").getValueState() === "Error") {
                        sMsg = oBundle.getText("correctgroup");
                        bMandate = false;
                    }
                    if (this.getView().byId("cigroupcounterId").getValueState() === "Error") {
                        if (oRoutingModel.getProperty("/bErrorForGcounterValidation") === true) {
                            sMsg = oBundle.getText("groupcountererrormsg");
                            bMandate = false;
                        } else {
                            sMsg = oBundle.getText("groupcouterexists");
                            bMandate = false;
                        }
                    }
                }
                if (sGroupNumber) {
                    if (this.getView().byId("groupId").getValueState() === "Error") {
                        sMsg = oBundle.getText("correctgroup");
                        bMandate = false;
                    }
                    if (this.getView().byId("groupcounterId").getValueState() === "Error") {
                        if (oRoutingModel.getProperty("/bErrorForGcounterValidation") === true) {
                            sMsg = oBundle.getText("groupcountererrormsg");
                            bMandate = false;
                        } else {
                            sMsg = oBundle.getText("groupcouterexists");
                            bMandate = false;
                        }
                    }
                }
                if (bMandate) {
                    if (sKeyUser === "X") {
                        this.getModel("oVisibilityModel").setProperty("/bomSize", "0px");
                        if (oSelIndex !== 0) {
                            //Multiple AOCI's
                            if (aMultipleAOCI.length > 0) {
                                var aNewMAOCI = [];
                                aNewMAOCI.push({
                                    "Material": sCIMaterial,
                                    "Plant": sCIPlant
                                });
                                aMultipleAOCI.map(function (oItem) {
                                    aNewMAOCI.push({
                                        "Material": oItem.Material,
                                        "Plant": oItem.Plant
                                    });
                                });
                            }
                            var oPayload = {
                                "Material": sCIMaterial,
                                "Plant": sCIPlant,
                                "Template_no": sGroupNumber + sGroupunter,
                                "Group_No": sCIGroupNumber,
                                "Grp_Cntr": sCIGroupunter,
                                "Task_type": "S",
                                "Status": "",
                                "Plnr_Grp": "",
                                "Task_List_Desc": "",
                                "Key_User": "X",
                                "Operation": [],
                                "Multiple_AOCIs": aNewMAOCI || [],
                                "Create": "X"
                            };
                        }
                    } else {
                        this.getModel("oVisibilityModel").setProperty("/bEndUserVisible", true);
                        this.getModel("oVisibilityModel").setProperty("/bomSize", "150px");

                        oPayload = {
                            "Material": sMaterial,
                            "Plant": sPlant,
                            "Template_no": sTemplateNo,
                            "Group_No": sGroupNumber,
                            "Grp_Cntr": sGroupunter,
                            "Task_type": sKeyUser === "X" ? "S" : "N",
                            "Key_User": "",
                            "Operation": [],
                            "Create": "X"
                        };
                    }
                    var oBusyIndicator = new BusyDialog();
                    oBusyIndicator.open();

                    oDataModel.create("/ET_Rout_HdrSet", oPayload, {
                        success: function (oData) {
                            oBusyIndicator.close();
                            if (sKeyUser === "X") { //Key user
                                var sMsgsuc = oBundle.getText("createtemplatesuccessmsg");
                            } else { //End user
                                sMsgsuc = oBundle.getText("createroutingsuccessmsg");
                            }
                            var oObj = {
                                "Material": oData.Material,
                                "Plant": oData.Plant,
                                "Group_No": oData.Group_No,
                                "Grp_Cntr": oData.Grp_Cntr,
                                "Task_type": oData.Task_type
                            };
                            sap.m.MessageToast.show(sMsgsuc, {
                                duration: 5000
                            });
                            oRoutingModel.setProperty("/oRouteDetailsObj", oObj);
                            this.getView().getModel("oRoutingModel").setProperty("/bNavfromselection", true); //Navigating through app button , not on refresh of screen
                            this.fnOpenBusyDialog();
                            if (sKeyUser === "X") { //Keyuser
                                this.getOwnerComponent().getRouter().navTo("UpdateTemplate");
                            } else { //Enduser
                                this.getOwnerComponent().getRouter().navTo("UpdateRouting");
                            }
                        }.bind(this),
                        error: function (error) {
                            oBusyIndicator.close();
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                } else {
                    MessageBox.error(sMsg);
                }
            },
            /*Params : aMAOCI This method used to check mandatory fields in multiple AOCI*/
            fnCheckMandatoryforMAOCI: function (aMAOCI) {
                var bMandate = true;
                if (aMAOCI.length > 0) {
                    aMAOCI.map(function (oItem) {
                        delete oItem.Plant_valueState;
                        delete oItem.Plant_valueStateText;
                        if ((oItem.Material === "" && oItem.Plant !== "") || (oItem.Material !== "" && oItem.Plant === "")) {
                            bMandate = false;
                        }
                    });
                }
                return bMandate;
            },
            // Method to change Template / Routing. Common method for Key user & End user.
            // USER: NG7BBC6   DATE: 24-08-2021
            fnChangeTemplateRouting: function (oEvent) {
                var oBusyIndicator = new BusyDialog();
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sKeyUser = oRoutingModel.getProperty("/keyUser") || "";
                var oTableRowData;
                var oText = oEvent.getSource().getText();
                //show pop over to users on click of close tab and back button
                sap.ushell.Container.setDirtyFlag(false);
                // Check weather navigation is through click of Table column Link or Footer Button click
                // GGUNO6VD - adding condition according to MassUpdate
                //  GGUNO6VD - added oText accrd to MASS UPDATE 
                if (oText === "Change Routing" || oText === "Change Template" || oText === "Proceed to make modifications") {
                    if (oRoutingModel.getProperty("/iChangeTemplateDetailsLength") === 0) {
                        sap.m.MessageToast.show(oBundle.getText("changetemplatebtnvalidationmsg"));
                    } else {
                        var idChngTable = this.getView().byId("idChangeTemplateTable");
                        var rowid = idChngTable.getSelectedIndices();
                        oTableRowData = idChngTable.getContextByIndex(rowid).getObject();
                    }
                } else {
                    oTableRowData = oEvent.getSource().getBindingContext('oRoutingModel').getObject();
                }

                if (oTableRowData) {
                    oBusyIndicator.open();
                    var oObj = {
                        "Material": oTableRowData.Material,
                        "Plant": oTableRowData.Plant,
                        "Group_No": oTableRowData.Group_No,
                        "Grp_Cntr": oTableRowData.Grp_Cntr,
                        "Task_type": oTableRowData.Task_type
                    };
                    oRoutingModel.setProperty("/oRouteDetailsObj", oObj);
                    this.getView().getModel("oRoutingModel").setProperty("/bNavfromselection", true);
                    oBusyIndicator.close();
                    if (sKeyUser === "X") { //Keyuser
                        this.getOwnerComponent().getRouter().navTo("UpdateTemplate");
                    } else { //Enduser
                        this.getOwnerComponent().getRouter().navTo("UpdateRouting");
                    }
                } else {
                    sap.m.MessageToast.show(oBundle.getText("changetemplatebtnvalidationmsg"));
                    oBusyIndicator.close();
                }
            },
            /********************** ChangeTemplateRouting Fragment **********************************/
            // Method to filter in Change template / Routing. Common method for Key user & End user.
            /* Description : 1. This function is used to search routing/template data in change screen
             2. 5 new filters are added in change screen **/
            fnSearchByMultipleParams: function () {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sTemplateStatus = oRoutingModel.getProperty("/sSelectedTemplateStatus") || [];
                var sRoutingStatus = oRoutingModel.getProperty("/sSelectedRoutingStatus") || [];
                var sKeyUser = oRoutingModel.getProperty("/keyUser") || "";
                var sMassUpdateUser = oVisibilityModel.getProperty("/sMassUpdateUser") || "";
                var sTaskListDesc = oRoutingModel.getProperty("/TaskListDesc") || "";
                var sTooltip = oBundle.getText("changeTemplate.Tooltip");
                var oAOCIInput = this.getView().byId("idAOCIInputKeyUser");
                var oAOCIDescInput = this.getView().byId("idAOCIDescInput");
                var oRoutAOCIInput = this.getView().byId("idAOCIInputEndUser");
                var oMaterialInput = this.getView().byId("idMaterialInput");
                var oMaterialDescInput = this.getView().byId("idMaterialDescInput");
                var oPlantInput = this.getView().byId("changePlantID");
                var oGroupInput = this.getView().byId("changeGroupID");
                var oGroupCounterInput = this.getView().byId("idGroupGounterID");
                var oCreatedByInput = this.getView().byId("CreatedByID");
                var oMRPControllerInput = this.getView().byId("MRPControllerID");
                var oMERCodeInput = this.getView().byId("MERCodeID");
                var oPlannerGroupInput = this.getView().byId("PlannerGroupID");
                var sSourceInput = oRoutingModel.getProperty("/sSelectedSource") || [];
                var iAOCI;
                if (sKeyUser === "X") { //Keyuser
                    iAOCI = oRoutingModel.getProperty("/selectedCI") || "";
                } else {
                    iAOCI = oRoutingModel.getProperty("/selectedMaterial") || "";
                }
                if (oAOCIInput.getTokens().length > 0 || oAOCIDescInput.getTokens().length > 0 ||
                    oRoutAOCIInput.getTokens().length > 0 || oMaterialInput.getTokens().length > 0 ||
                    oMaterialDescInput.getTokens().length > 0 || oPlantInput.getTokens().length > 0 ||
                    oGroupInput.getTokens().length > 0 || oGroupCounterInput.getTokens().length > 0 ||
                    sTaskListDesc || sTemplateStatus.length > 0 || sRoutingStatus.length > 0 ||
                    oCreatedByInput.getTokens().length > 0 || oMRPControllerInput.getTokens().length > 0 ||
                    oMERCodeInput.getTokens().length > 0 || oPlannerGroupInput.getTokens().length > 0 || sSourceInput.length > 0) {
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    var aFilters = [new sap.ui.model.Filter("Task_List_Desc", FilterOperator.EQ, sTaskListDesc)];
                    if (oAOCIInput.getTokens().length > 0) {
                        for (var i = 0; i < oAOCIInput.getTokens().length; i++) {
                            var aAOCIList = this.getView().byId("idAOCIInputKeyUser").getTokens();
                            aFilters.push(new sap.ui.model.Filter("CI", sap.ui.model.FilterOperator.EQ, aAOCIList[i].getText()));
                        }
                    }
                    if (oAOCIDescInput.getTokens().length > 0) {
                        for (var i = 0; i < oAOCIDescInput.getTokens().length; i++) {
                            var aAOCIDescList = this.getView().byId("idAOCIDescInput").getTokens();
                            aFilters.push(new sap.ui.model.Filter("MatDesc", sap.ui.model.FilterOperator.EQ, aAOCIDescList[i].getText()));
                        }
                    }
                    if (oRoutAOCIInput.getTokens().length > 0) {
                        for (var i = 0; i < oRoutAOCIInput.getTokens().length; i++) {
                            var aAOCIList = this.getView().byId("idAOCIInputEndUser").getTokens();
                            aFilters.push(new sap.ui.model.Filter("CI", sap.ui.model.FilterOperator.EQ, aAOCIList[i].getText()));
                        }
                    }
                    if (oMaterialInput.getTokens().length > 0) {
                        for (var i = 0; i < oMaterialInput.getTokens().length; i++) {
                            var aMaterialList = this.getView().byId("idMaterialInput").getTokens();
                            aFilters.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, aMaterialList[i].getText()));
                        }
                    }
                    if (oMaterialDescInput.getTokens().length > 0) {
                        for (var i = 0; i < oMaterialDescInput.getTokens().length; i++) {
                            var aMaterialDescList = this.getView().byId("idMaterialDescInput").getTokens();
                            aFilters.push(new sap.ui.model.Filter("MatDesc", sap.ui.model.FilterOperator.EQ, aMaterialDescList[i].getText()));
                        }
                    }
                    if (oPlantInput.getTokens().length > 0) {
                        for (var i = 0; i < oPlantInput.getTokens().length; i++) {
                            var aPlantList = this.getView().byId("changePlantID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, aPlantList[i].getText()));
                        }
                    }
                    if (oGroupInput.getTokens().length > 0) {
                        for (var i = 0; i < oGroupInput.getTokens().length; i++) {
                            var aGroupList = this.getView().byId("changeGroupID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("Group_No", sap.ui.model.FilterOperator.EQ, aGroupList[i].getText()));
                        }
                    }
                    if (oGroupCounterInput.getTokens().length > 0) {
                        for (var i = 0; i < oGroupCounterInput.getTokens().length; i++) {
                            var aGroupCounterList = this.getView().byId("idGroupGounterID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("Grp_Cntr", sap.ui.model.FilterOperator.EQ, aGroupCounterList[i].getText()));
                        }
                    }

                    if (oCreatedByInput.getTokens().length > 0) {
                        for (var i = 0; i < oCreatedByInput.getTokens().length; i++) {
                            var aCreatedByInputList = this.getView().byId("CreatedByID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("Created_By", sap.ui.model.FilterOperator.EQ, aCreatedByInputList[i].getText()));
                        }
                    }
                    if (oMRPControllerInput.getTokens().length > 0) {
                        for (var i = 0; i < oMRPControllerInput.getTokens().length; i++) {
                            var aMRPController = this.getView().byId("MRPControllerID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("MRP_Controller", sap.ui.model.FilterOperator.EQ, aMRPController[i].getText()));
                        }
                    }
                    if (oMERCodeInput.getTokens().length > 0) {
                        for (var i = 0; i < oMERCodeInput.getTokens().length; i++) {
                            var aMERCodeList = this.getView().byId("MERCodeID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("MER_Code", sap.ui.model.FilterOperator.EQ, aMERCodeList[i].getText()));
                        }
                    }
                    if (oPlannerGroupInput.getTokens().length > 0) {
                        for (var i = 0; i < oPlannerGroupInput.getTokens().length; i++) {
                            var aPlannerGroupList = this.getView().byId("PlannerGroupID").getTokens();
                            aFilters.push(new sap.ui.model.Filter("Planner_Group", sap.ui.model.FilterOperator.EQ, aPlannerGroupList[i].getText()));
                        }
                    }

                    for (var i = 0; i < sTemplateStatus.length; i++) {
                        var aStatusList = sTemplateStatus;
                        aFilters.push(new Filter("Status", FilterOperator.EQ, aStatusList[i]));
                    }
                    for (var i = 0; i < sRoutingStatus.length; i++) {
                        var aRoutingStatusList = sRoutingStatus;
                        aFilters.push(new Filter("Status", FilterOperator.EQ, aRoutingStatusList[i]));
                    }
                    if (sKeyUser === "X") {
                        if (sMassUpdateUser === "X") {
                            aFilters.push(new Filter("Mass_Update", FilterOperator.EQ, "X"));
                            aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                            aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                            oRoutingModel.setProperty("/sTooltip", "");
                        } else {
                            aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                            aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                            aFilters.push(new Filter("Mass_Update", FilterOperator.EQ, ""));
                            oRoutingModel.setProperty("/sTooltip", sTooltip);
                        }
                    }
                    else {
                        aFilters.push(new Filter("End_User", FilterOperator.EQ, "X"));
                        aFilters.push(new Filter("Key_User", FilterOperator.EQ, ""));
                        aFilters.push(new Filter("Mass_Update", FilterOperator.EQ, ""));
                        oRoutingModel.setProperty("/sTooltip", sTooltip);
                        for (var i = 0; i < sSourceInput.length; i++) {
                            var aSourceInputList = sSourceInput;
                            aFilters.push(new Filter("MARS_Indicator", FilterOperator.EQ, aSourceInputList[i]));
                        }
                    }
                    var oBusyIndicator = new BusyDialog();
                    oBusyIndicator.open();
                    oDataModel.read("/ET_CEWB_LISTSet", {
                        filters: aFilters,
                        async: true,
                        success: function (oData) {
                            oBusyIndicator.close();
                            if (oData.results.length > 0) {
                                this.getView().getModel("oRoutingModel").setProperty("/aChangeTemplateDetails", oData.results);
                                this.getView().getModel("oRoutingModel").setProperty("/iChangeTemplateDetailsLength", oData.results.length);
                                this.getView().getModel("oRoutingModel").setProperty("/sNavFromScreen1", "Y");
                            }
                        }.bind(this),
                        error: function (error) {
                            oBusyIndicator.close();
                            this.fnCheckError(error);
                            this.getView().getModel("oRoutingModel").setProperty("/aChangeTemplateDetails", []);
                            this.getView().getModel("oRoutingModel").setProperty("/iChangeTemplateDetailsLength", 0);
                        }.bind(this)
                    });
                }
                else {
                    sap.m.MessageToast.show(oBundle.getText("changetemplateValidationmsg"));
                }
            },
            /*Params : oEvent, sDSType This method opens CI value help */
            fnCIValuehelp: function (oEvent, sDSType) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sDSType", sDSType);
                if (!this._oCIValueHelpDialog) {
                    this._oCIValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.CIValueHelp", this);
                    this.getView().addDependent(this._oCIValueHelpDialog);
                }
                var oBinding = this._oCIValueHelpDialog.getBinding("items");
                var oFilter = [new Filter("CI", FilterOperator.EQ, "X")];
                oBinding.filter(oFilter);
                if (sDSType === "MAOCI") {
                    var sAOCIPath = oEvent.getSource().getBindingContext("oRoutingModel").getPath();
                    oRoutingModel.setProperty("/sAOCIPath", sAOCIPath);
                }
                this._oCIValueHelpDialog.open();
            },
            // Method to bind plant value help. Common method for Key user & End user.
            fnValuehelpPlant: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                if (!this._oPlantHelpDialog) {
                    this._oPlantHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.PlantValueHelp", this);
                    this.getView().addDependent(this._oPlantHelpDialog);
                    this._oPlantHelpDialog.setModel(oRoutingModel, "oRoutingModel");
                    this._oPlantHelpDialog.setModel("i18n");
                }
                var oBinding = this._oPlantHelpDialog.getBinding("items");
                oBinding.filter([]);
                //save the suggestion path
                this.sStorageFieldName = oEvent.getSource().getBindingPath("suggestionItems").split("/")[1];
                this._oPlantHelpDialog.open();
            },
            // This method used to provide suggestion for plant. Throw error when something wrong is typed. Common method for Key user & End user.
            fnChangeTemplatePlant: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oPlantSource = oEvent.getSource();
                if (sValue) {
                    var aFilter = [new sap.ui.model.Filter("Plant", FilterOperator.EQ, sValue)];
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    oDataModel.read("/ET_PlantSet", {
                        filters: aFilter,
                        success: function (oData) {
                            oPlantSource.setValueState("None");
                            //save the value in local storage
                            var sField = oPlantSource.getBindingPath("suggestionItems").split("/")[1];
                            if (sField) {
                                this.fnUpdateLclStorage(sField, " " + sValue.trim(), "Plant");
                            }
                        }.bind(this),
                        error: function (error) {
                            oPlantSource.setValueState("Error");
                            oPlantSource.setValueStateText(" ");
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                } else {
                    oPlantSource.setValueState("None");
                }
            },
            // This method used to provide suggestion for Group. Throw error when something wrong is typed. Common method for Key user & End user.
            fnChangeTemplateGroup: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sKeyUser = oRoutingModel.getProperty("/keyUser") || "";
                var sValue = oEvent.getParameter("value");
                var aFilter;
                var oGroupSource = oEvent.getSource();
                if (sValue) {
                    aFilter = [new sap.ui.model.Filter("Group_No", FilterOperator.EQ, sValue)];
                    //save the value in local storage
                    var sField = oGroupSource.getBindingPath("suggestionItems").split("/")[1];
                    if (sField) {
                        this.fnUpdateLclStorage(sField, " " + sValue.trim(), "Group_No");
                    }
                    // Send extra filter based on weather it is key user or end user.
                    if (sKeyUser === "X") {
                        aFilter.push(new Filter("End_User", FilterOperator.EQ, ""));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    } else {
                        aFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    }
                    // End
                    var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                    oDataModel.read("/ET_Group_ListSet", {
                        filters: aFilter,
                        success: function (oData) {
                            oGroupSource.setValueState("None");
                            // Call the method to automatically set group counter if it is only one.
                            this.fnGetGroupCounterList();
                        }.bind(this),
                        error: function (error) {
                            oGroupSource.setValueState("Error");
                            oGroupSource.setValueStateText(" ");
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                } else {
                    oGroupSource.setValueState("None");
                }
            },
            /*method for group counter change event*/
            fnTaskListDescChange: function (oEvent) {
                //save the value in local storage
                var sField = oEvent.getSource().getBindingPath("suggestionItems").split("/")[1];
                if (sField) {
                    this.fnUpdateLclStorage(sField, " " + oEvent.getSource().getValue().trim(), "TaskListDesc");
                }
            },
            /********************** CIValueHelp Fragment **********************************/
            /* Params : oEvent * This method is triggered when a material is selected */
            fnMaterialSelect: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sDStype = oRoutingModel.getProperty("/sDSType");
                if (sDStype === "MAOCI") {
                    var sAOCIPath = oRoutingModel.getProperty("/sAOCIPath");
                }
                // clear other fields
                this.fnClearfields(sDStype, sAOCIPath);
                if (sDStype === "CI") {
                    oRoutingModel.setProperty("/selectedCI", oSelectedItem.getCells()[0].getTitle());
                    oRoutingModel.setProperty("/selectedCIDesc", oSelectedItem.getCells()[1].getText());
                    oRoutingModel.setProperty("/selectedCIValueState", "None");
                    oRoutingModel.setProperty("/selectedCIValueStatemsg", "");
                } else if (sDStype === "targetCI") {
                    oRoutingModel.setProperty("/selectedTargetCI", oSelectedItem.getCells()[0].getTitle());
                    oRoutingModel.setProperty("/selectedTargetCIDesc", oSelectedItem.getCells()[1].getText());
                    oRoutingModel.setProperty("/selectedTargetCIValueState", "None");
                    oRoutingModel.setProperty("/selectedTargetCIValueStatemsg", "");
                } else if (sDStype === "MAOCI") {
                    oRoutingModel.setProperty(sAOCIPath + "/Material", oSelectedItem.getCells()[0].getTitle());
                    oRoutingModel.setProperty(sAOCIPath + "/MaterialDesc", oSelectedItem.getCells()[1].getText());
                    oRoutingModel.setProperty(sAOCIPath + "/aMAOCIPlants", []);
                    oRoutingModel.setProperty(sAOCIPath + "/Plant", "");
                    oRoutingModel.setProperty(sAOCIPath + "/MAOCIValueState", "None");
                    oRoutingModel.setProperty(sAOCIPath + "/MAOCIValueStatemsg", "");
                } else {
                    oRoutingModel.setProperty("/selectedMaterial", oSelectedItem.getCells()[0].getTitle());
                    oRoutingModel.setProperty("/selectedMaterialDesc", oSelectedItem.getCells()[1].getText());
                    oRoutingModel.setProperty("/selectedMaterialValueState", "None");
                    oRoutingModel.setProperty("/selectedMaterialValueStatemsg", "");
                }
                this.fnGetDropDownslist(sDStype, sAOCIPath);

                this.fnUpdateLclStorage(this.sStorageFieldName, " " + oSelectedItem.getCells()[0].getTitle().trim(), "Material");
            },
            /** Params : oEvent  This method used to search material in available materials */
            fnMaterialSearch: function (oEvent) {
                var oFilter = [];
                var sValue = oEvent.getParameter("value");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sDStype = oRoutingModel.getProperty("/sDSType");
                // Added extra filters (Key user & End user) in ET_MaterialSet - New requirement from backend to 
                // differentiate between Key user & End user.
                var sKeyUser = oRoutingModel.getProperty("/keyUser");
                if (sKeyUser === "X") {
                    oFilter.push(new Filter("End_User", FilterOperator.EQ, ""));
                    oFilter.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                } else {
                    oFilter.push(new Filter("End_User", FilterOperator.EQ, "X"));
                    oFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                }
                // End

                if (sDStype === "CI" || sDStype === "targetCI" || sDStype === "MAOCI") {
                    oFilter.push(new Filter("Text", FilterOperator.Contains, sValue));
                    oFilter.push(new Filter("CI", FilterOperator.EQ, "X"));
                } else {
                    oFilter.push(new Filter("Text", FilterOperator.Contains, sValue));
                }

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /** Description : Function to reset the non-required filters and its data.**/
            fnOnReset: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oRoutAOCIInput = this.getView().byId("idAOCIInputEndUser");
                oRoutAOCIInput.setTokens([]);
                var oCreatedByInput = this.getView().byId("CreatedByID");
                oCreatedByInput.setTokens([]);
                var oMRPControllerInput = this.getView().byId("MRPControllerID");
                oMRPControllerInput.setTokens([]);
                var oMERCodeInput = this.getView().byId("MERCodeID");
                oMERCodeInput.setTokens([]);
                var oPlannerGroupInput = this.getView().byId("PlannerGroupID");
                oPlannerGroupInput.setTokens([]);
                oRoutingModel.setProperty("/sSelectedRoutingStatus", []) || [];
                oRoutingModel.setProperty("/sSelectedSource", []) || [];
            },
            /*** Description : Function to open Value Help popup of AOCI MultiInput Field -> Key User.**/
            fnTemplateAOCIValuehelp: function (oEvent, sDSType) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sDSType", sDSType);
                if (!this._oAOCIValueHelpDialog) {
                    this._oAOCIValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.AOCITemplateValueHelp", this);
                    this.getView().addDependent(this._oAOCIValueHelpDialog);
                }
                var oBinding = this._oAOCIValueHelpDialog.getBinding("items");
                var oFilter = [new Filter("CI", FilterOperator.EQ, "X"),
                new Filter("Text", FilterOperator.Contains, "")
                ];
                oBinding.filter(oFilter);
                this._oAOCIValueHelpDialog.open();
            },
            /** Description : Function to select in Value Help popup of AOCI MultiInput Field -> Key User.**/
            fnTemplateAOCISelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oAOCIInput = this.getView().byId("idAOCIInputKeyUser");
                var oAOCIDescInput = this.getView().byId("idAOCIDescInput");
                var oPlantnput = this.getView().byId("changePlantID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oAOCIInput);
                    if (oAOCIInput.getTokens().length === 1) {
                        oAOCIDescInput.removeAllTokens();
                        aSelectedItems.forEach(function (oItem) {
                            oAOCIDescInput.addToken(new Token({
                                text: oItem.mAggregations.cells[1].getText(),
                                key: oItem.mAggregations.cells[1].getText()
                            }));
                        });
                        oRoutingModel.setProperty("/sSelectedAOCIData", aSelectedItems[0].getCells()[0].getTitle());
                        this.fnGetDropDownslistForChangeScreen();
                    } else {
                        oAOCIDescInput.removeAllTokens();
                        oPlantnput.removeAllTokens();
                    }
                }
            },
            /*Description : Function to search in Value Help popup of AOCI MultiInput Field -> Key User.**/
            fnTemplateAOCISearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = [new Filter("Text", FilterOperator.Contains, sValue),
                new Filter("CI", FilterOperator.EQ, "X")]
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /**Description : Function to prevent duplicate token creation.**/
            fnRemoveDuplicateTokens: function (aSelectedItems, oInputElement) {
                aSelectedItems.forEach(function (oItem) {
                    var oCells = oItem.getCells();
                    if (oCells.length > 0) {
                        var sTokenText = oCells[0].getTitle();
                        // Check for duplicate tokens
                        var bDuplicateFound = false;
                        oInputElement.getTokens().forEach(function (existingToken) {
                            if (existingToken.getText() === sTokenText) {
                                bDuplicateFound = true;
                                return;
                            }
                        });
                        if (!bDuplicateFound) {
                            var oToken = new Token({
                                key: sTokenText,
                                text: sTokenText
                            });
                            oInputElement.addToken(oToken);
                        }
                    }
                });
            },
            /* Description : This function used to get Plant data based material n AOCI . **/
            fnGetDropDownslistForChangeScreen: function (oEvent) {
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sKeyUser = oRoutingModel.getProperty("/keyUser");
                var sSelectedMaterialData = oRoutingModel.getProperty("/sSelectedMaterialData");
                var sSelectedAOCIData = oRoutingModel.getProperty("/sSelectedAOCIData");
                var oMaterialInput = this.getView().byId("idMaterialInput");
                var oAOCIInput = this.getView().byId("idAOCIInputKeyUser");
                var aFilters = [];
                if (sKeyUser === "X") {
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Material", FilterOperator.EQ, sSelectedAOCIData));
                } else {
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Material", FilterOperator.EQ, sSelectedMaterialData));
                }
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                var oParameters = {
                    async: true,
                    urlParameters: {
                        "$expand": ["Plant/Group/Available_GC", "Plant/CI"]
                    },
                    filters: aFilters,
                    success: function (oData, oResponse) {
                        if (oData.results.length > 0) {
                            var oPlantnput = this.getView().byId("changePlantID");
                            if (oData.results[0].Plant.results.length === 1) {
                                if (oMaterialInput.getTokens().length <= 1 && oAOCIInput.getTokens().length <= 1) {
                                    oPlantnput.removeAllTokens();
                                    oPlantnput.addToken(new Token({
                                        text: oData.results[0].Plant.results[0].Plant,
                                        key: oData.results[0].Plant.results[0].Plant
                                    }));
                                }
                            }
                            else {
                                for (var i = 0; oData.results[0].Plant.results.length > i; i++) {
                                    if (oRoutingModel.getProperty("/sPreSelectedPlant") === oData.results[0].Plant.results[i].Plant) {
                                        if (oMaterialInput.getTokens().length <= 1 && oAOCIInput.getTokens().length <= 1) {
                                            oPlantnput.removeAllTokens();
                                            oPlantnput.addToken(new Token({
                                                text: oData.results[0].Plant.results[i].Plant,
                                                key: oData.results[0].Plant.results[i].Plant
                                            }));
                                        }
                                        break;
                                    } else {
                                        oPlantnput.removeAllTokens();
                                    }
                                }
                            }
                        }
                        oBusyIndicator.close();
                    }.bind(this),
                    error: function (oError) {
                        this.fnCheckError(oError);
                        oBusyIndicator.close();
                    }.bind(this)
                };
                oDataModel.read("/ET_MaterialSet", oParameters);
            },
            /* Description : Change event of AOCI MultiInput Field.*/
            fnTemplateAOCIChange: function (oEvent) {
                var oAOCIDescInput = this.getView().byId("idAOCIDescInput");
                var oAOCIInput = this.getView().byId("idAOCIInputKeyUser");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oPlantnput = this.getView().byId("changePlantID");
                var sText = oEvent.getSource().getValue().trim();
                if (sText.length >= 8) {
                    var aFilters = [];
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Text", FilterOperator.EQ, sText));
                    aFilters.push(new Filter("CI", FilterOperator.EQ, "X"));
                    var oBusyIndicator = new BusyDialog();
                    oBusyIndicator.open();
                    var oParameters = {
                        async: true,
                        filters: aFilters,
                        success: function (oData, oResponse) {
                            if (oData.results.length === 1 && oData.results[0].Msg === "") {
                                if (oAOCIInput.getTokens().length === 1 && oData.results[0].Text !== "") {
                                    oAOCIDescInput.removeAllTokens();
                                    oAOCIDescInput.addToken(new Token({
                                        text: oData.results[0].Text,
                                        key: oData.results[0].Text
                                    }));
                                    oRoutingModel.setProperty("/sSelectedAOCIData", oData.results[0].Material);
                                    this.fnGetDropDownslistForChangeScreen();
                                } else {
                                    oAOCIDescInput.removeAllTokens();
                                    oPlantnput.removeAllTokens();
                                }
                            } else {
                                oAOCIDescInput.removeAllTokens();
                            }
                            oRoutingModel.setProperty("/sSelectedAOCI", "");
                            oBusyIndicator.close();
                        }.bind(this),
                        error: function (oError) {
                            oRoutingModel.setProperty("/sSelectedAOCI", "");
                            this.fnCheckError(oError);
                            oBusyIndicator.close();
                        }.bind(this)
                    };
                    oDataModel.read("/ET_MaterialSet", oParameters);
                } else {
                    if (oAOCIInput.getTokens().length === 1) {
                        oAOCIDescInput.removeAllTokens();
                        oPlantnput.removeAllTokens();
                    }
                }
            },
            /*Description : Live Change event of AOCI MultiInput Field.**/
            fnTemplateAOCILiveChange: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oAOCIDescInput = this.getView().byId("idAOCIDescInput");
                var sTxt = oEvent.getParameters().value.trim();
                var oPlantnput = this.getView().byId("changePlantID");
                if (sTxt !== "" && sTxt.split(' ').length === 1) {
                    var aFilters = [];
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Text", FilterOperator.Contains, sTxt));
                    aFilters.push(new Filter("CI", FilterOperator.EQ, "X"));
                    var oParameters = {
                        filters: aFilters,
                        async: true,
                        success: function (oData, oResponse) {
                            oRoutingModel.setProperty("/aSuggestTemplateAOCIs", oData.results);
                        },
                        error: function (err) {
                            this.fnCheckError(err);
                        }
                    };
                    oDataModel.read("/ET_MaterialSet", oParameters);
                } else {
                    oAOCIDescInput.removeAllTokens();
                    oPlantnput.removeAllTokens();
                }
            },
            /*Description : 1.This function is used to open material value help in end user.**/
            fnRoutingMaterialValuehelp: function (oEvent) {
                if (!this._oRoutMaterialValueHelpDialog) {
                    this._oRoutMaterialValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.RoutingMaterialValueHelp", this);
                    this.getView().addDependent(this._oRoutMaterialValueHelpDialog);
                }
                var MatTable = sap.ui.getCore().byId("idRoutingMaterialDialog");
                //V3.3 Passing empty filter to get all materials everytime when user open value help. - SJOST4UU
                var oBinding = MatTable.getBinding("items");
                oBinding.filter(new Filter("Text", FilterOperator.Contains, ""));
                this._oRoutMaterialValueHelpDialog.open();
            },
            /*Description : Select function in ValueHelp Popup of Material MultiInput Field.**/
            fnRoutingMaterialSelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oMaterialInput = this.getView().byId("idMaterialInput");
                var oMaterialDescInput = this.getView().byId("idMaterialDescInput");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oPlantnput = this.getView().byId("changePlantID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oMaterialInput);
                    if (oMaterialInput.getTokens().length === 1) {
                        oMaterialDescInput.removeAllTokens();
                        aSelectedItems.forEach(function (oItem) {
                            oMaterialDescInput.addToken(new Token({
                                text: oItem.mAggregations.cells[1].getText(),
                                key: oItem.mAggregations.cells[1].getText()
                            }));
                        });
                        oRoutingModel.setProperty("/sSelectedMaterialData", aSelectedItems[0].getCells()[0].getTitle());
                        this.fnGetDropDownslistForChangeScreen();
                    } else {
                        oMaterialDescInput.removeAllTokens();
                        oPlantnput.removeAllTokens();
                    }
                }
            },
            /*Description : Search function in ValueHelp Popup of Material MultiInput Field.**/
            fnRoutingMaterialSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Text", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /**Description : Change event for Material MultiInput Field -> End User.**/
            fnRoutingMaterialChange: function (oEvent) {
                var oMaterialInput = this.getView().byId("idMaterialInput");
                var oMaterialDescInput = this.getView().byId("idMaterialDescInput");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oPlantnput = this.getView().byId("changePlantID");
                var sText = oEvent.getSource().getValue().trim();
                if (sText.length >= 8) {
                    var aFilters = [];
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Text", FilterOperator.EQ, sText));
                    var oBusyIndicator = new BusyDialog();
                    oBusyIndicator.open();
                    var oParameters = {
                        async: true,
                        filters: aFilters,
                        success: function (oData, oResponse) {
                            if (oData.results.length === 1 && oData.results[0].Msg === "") {
                                if (oMaterialInput.getTokens().length === 1 && oData.results[0].Text !== "") {
                                    oMaterialDescInput.removeAllTokens();
                                    oMaterialDescInput.addToken(new Token({
                                        text: oData.results[0].Text,
                                        key: oData.results[0].Text
                                    }));
                                    oRoutingModel.setProperty("/sSelectedMaterialData", oData.results[0].Material);
                                    this.fnGetDropDownslistForChangeScreen();
                                } else {
                                    oMaterialDescInput.removeAllTokens();
                                    oPlantnput.removeAllTokens();
                                }
                            } else {
                                oMaterialDescInput.removeAllTokens();
                            }
                            oRoutingModel.setProperty("/sSelectedMaterial", "");
                            oBusyIndicator.close();
                        }.bind(this),
                        error: function (oError) {
                            oRoutingModel.setProperty("/sSelectedMaterial", "");
                            this.fnCheckError(oError);
                            oBusyIndicator.close();
                        }.bind(this)
                    };
                    oDataModel.read("/ET_MaterialSet", oParameters);
                } else {
                    // oRoutingModel.setProperty("/sSelectedMaterial", "");
                    if (oMaterialInput.getTokens().length === 1) {
                        oMaterialDescInput.removeAllTokens();
                        oPlantnput.removeAllTokens();
                    }
                }
            },
            /*Description : Live Change event for Material Multi Input Field -> End User.**/
            fnRoutingMaterialLiveChange: function (oEvent) {
                var that = this;
                var oRoutingModel = that.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oMatDescMultiInput = this.getView().byId("idMaterialDescInput");
                var oPlantnput = this.getView().byId("changePlantID");
                var sTxt = oEvent.getParameters().value.trim();
                if (sTxt !== "" && sTxt.split(' ').length === 1) {
                    var aFilters = [];
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Text", FilterOperator.Contains, sTxt));
                    var oParameters = {
                        filters: aFilters,
                        async: true,
                        success: function (oData, oResponse) {
                            oRoutingModel.setProperty("/aSuggestRoutingMaterials", oData.results);
                        },
                        error: function (err) {
                            that.fnCheckError(err);
                        }
                    };
                    oDataModel.read("/ET_MaterialSet", oParameters);
                } else {
                    oMatDescMultiInput.removeAllTokens();
                    oPlantnput.removeAllTokens();
                }
            },
            /*Description : Change event for Description Multi Input Field.**/
            fnRoutingMaterialDescChange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim().toLowerCase() === sNewValue.trim().toLowerCase();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /**Description : Function to open Plant value help for Plant Field .**/
            fnChangeTemplatePlantValuehelp: function (oEvent) {
                if (!this._oChangePlantValueHelpDialog) {
                    this._oChangePlantValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.ChangeTemplatePlantValueHelp", this);
                    this.getView().addDependent(this._oChangePlantValueHelpDialog);
                }
                var PlantTable = sap.ui.getCore().byId("idChangePlantDialog");
                var oBinding = PlantTable.getBinding("items");
                oBinding.filter(new Filter("Name", FilterOperator.Contains, ""));
                this._oChangePlantValueHelpDialog.open();
            },
            /*Description : Select function in plant value help for Plant Field.**/
            fnChangeTemplatePlantSelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oPlantInput = this.getView().byId("changePlantID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oPlantInput);
                }
            },
            /*Description : Search function in plant value help for Plant Field . **/
            fnChangeTemplatePlantSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /*Description : Change event for Plant Field .**/
            fnChangeTemplatePlantChange: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oMultiInput = this.getView().byId("changePlantID");
                oRoutingModel.setProperty("/sSelectedPlants", "");
            },
            /*Description : Live Change event for Plant Field .*/
            fnChangeTemplatePlantLivechange: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sTxt = oEvent.getParameters().value;
                oRoutingModel.setProperty("/aSuggestChangePlants", []);
                var aFilter = [new sap.ui.model.Filter("Plant", FilterOperator.Contains, sTxt)];
                var oParameters = {
                    filters: aFilter,
                    async: true,
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            oRoutingModel.setProperty("/aSuggestChangePlants", oData.results);
                        }
                    }.bind(this),
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_PlantSet", oParameters);
            },
            /*Description : Function to open Value help of Group MultiInput . **/
            fnValuehelpGroup: function (oEvent) {
                if (!this._oGroupHelpDialog) {
                    this._oGroupHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.GroupValueHelp", this);
                    this.getView().addDependent(this._oGroupHelpDialog);
                    this._oGroupHelpDialog.setModel(this.getView().getModel("i18n"), "i18n");
                }
                var GroupTable = sap.ui.getCore().byId("idChangeGroupDialog");
                var oBinding = GroupTable.getBinding("items");
                oBinding.filter(new Filter("Group_No", FilterOperator.Contains, ""));
                this._oGroupHelpDialog.open();
            },
            /*Description : Search function in Value help of Group MultiInput . **/
            fnGroupSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Group_No", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /*Description : Live Change event for Group MultiInput. **/
            fnChangeTemplateGroupLivechange: async function (oEvent) {
                const sValue = oEvent.getSource().getValue();
                const oRoutingModel = this.getView().getModel("oRoutingModel");
                const sKeyUser = oRoutingModel.getProperty("/keyUser") || "";
                // Clear suggestions 
                oRoutingModel.setProperty("/aSuggestChangeGroup", []);
                if (sValue.length > 2) {
                    // filter conditions
                    const aFilter = [new sap.ui.model.Filter("Group_No", sap.ui.model.FilterOperator.Contains, sValue)];
                    if (sKeyUser === "X") {
                        aFilter.push(new sap.ui.model.Filter("End_User", sap.ui.model.FilterOperator.EQ, ""));
                        aFilter.push(new sap.ui.model.Filter("Key_User", sap.ui.model.FilterOperator.EQ, "X"));
                    } else {
                        aFilter.push(new sap.ui.model.Filter("End_User", sap.ui.model.FilterOperator.EQ, "X"));
                        aFilter.push(new Filter("Key_User", FilterOperator.EQ, ""));
                    }
                    try {
                        const oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                        const oData = await oDataModel.read("/ET_Group_ListSet", {
                            filters: aFilter,
                            async: true,
                            success: function (oData) {
                                if (oData.results.length > 0) {
                                    oRoutingModel.setProperty("/aSuggestChangeGroup", oData.results);
                                    oRoutingModel.refresh();
                                }
                            }.bind(this),
                            error: function (oError) { }
                        });

                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }
            },
            /*Description : Change event for Group MultiInput. **/
            fnChangeTemplateGroupchange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                /**
                 * Duplicate Token Handling
                 */
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim() === sNewValue.trim();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /*Description : This method is used to avoid unnecessary typing of char & max digits in Group counter field. 
                Common method for Key user & End user.*/
            fnValidateDigitsinGCounter: function (oEvent) {
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sValue = oEvent.getSource().getValue();
                var sRegExp = (/^[0-9]+$/);
                var bMatched = sRegExp.test(sValue);
                if (oEvent.getSource().getValue() === " ") {
                    this.fnGetLoclStorageData(oEvent, "oRoutingModel");
                }
                // Reset to empty and show error
                else if (!bMatched) {
                    oEvent.getSource().setValue("");
                    sap.m.MessageToast.show(oBundle.getText("groupcountererrormsg"));
                }
            },
            /*Description : method to get the stored data from local cache*/
            fnGetLoclStorageData: function (oEvent, sModel) {
                var oSrc = oEvent.getSource();
                sap.ui.require(["sap/ui/util/Storage"], function (Storage) {
                    var sPath = oSrc.getBindingPath("suggestionItems"),
                        sFieldName = sPath.split("/")[1],
                        oStorage = new Storage(Storage.Type.local),
                        aGetData = oStorage.get("localSugData"),
                        aFinalData = JSON.parse(aGetData);
                    this.getView().getModel(sModel).setProperty(sPath, aFinalData[sFieldName]);
                }.bind(this));
            },
            /* Description : This method for group counter change event */
            fnGroupCounterChange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim() === sNewValue.trim();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            fnHandleSuggestItmSelected: function (oEvent) {
                var sValue = oEvent.getParameter("selectedItem").getText().trim();
                oEvent.getSource().setValue(sValue);
                oEvent.getSource().fireChangeEvent(sValue);
            },
            /*Description : This method for group counter live change event */
            fnGroupCounterliveChange: function (oEvent) {
                if (oEvent.getSource().getValue() === " ") {
                    this.fnGetLoclStorageData(oEvent, "oRoutingModel");
                }
            },
            /*Description : Method to get Template status data*/
            fnTemplateStatusSelectionChange: function (oEvent) {
                var oSelectedItem = oEvent.getSource();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sSelectedTemplateStatus", oSelectedItem.mProperties.selectedKeys);
            },
            fnTemplateStatusSelectionFinish: function (oEvent) {

            },
            /*Description : Function for AOCI MultiInput Value Search Help -> End User Field.**/
            fnRoutingAOCIValuehelp: function (oEvent, sDSType) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sDSType", sDSType);
                if (!this._oRoutingAOCIValueHelpDialog) {
                    this._oRoutingAOCIValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.AOCIRoutingValueHelp", this);
                    this.getView().addDependent(this._oRoutingAOCIValueHelpDialog);
                }
                var oBinding = this._oRoutingAOCIValueHelpDialog.getBinding("items");
                var oFilter = [new Filter("CI", FilterOperator.EQ, "X"),
                new Filter("Text", FilterOperator.Contains, "")
                ];
                oBinding.filter(oFilter);
                this._oRoutingAOCIValueHelpDialog.open();
            },
            /*Description : Select function for AOCI MultiInput Value Search Help -> End User Field.**/
            fnRoutingAOCISelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oAOCIInput = this.getView().byId("idAOCIInputEndUser");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oAOCIInput);
                }
            },
            /**Description : Search function for AOCI MultiInput Value Search Help -> End User Field.**/
            fnRoutingAOCISearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = [new Filter("Text", FilterOperator.Contains, sValue),
                new Filter("CI", FilterOperator.EQ, "X")]
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /*Description : Change Event for AOCI MultiInput Feild -> End User Field.**/
            fnRoutingAOCIChange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim().toLowerCase() === sNewValue.trim().toLowerCase();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /*Description : Live Change Event for AOCI MultiInput Feild -> End User Field.**/
            fnRoutingAOCILiveChange: function (oEvent) {
                var that = this;
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var sTxt = oEvent.getParameters().value;
                oRoutingModel.setProperty("/sCopiedRoutingAOCIs", "N");
                var aEnteredTokens = sTxt.split(" ");
                if (sTxt !== "") {
                    var aFilters = [];
                    aFilters.push(new Filter("End_User", FilterOperator.EQ, ""));
                    aFilters.push(new Filter("Key_User", FilterOperator.EQ, "X"));
                    aFilters.push(new Filter("Text", FilterOperator.Contains, sTxt));
                    aFilters.push(new Filter("CI", FilterOperator.EQ, "X"));
                    var oParameters = {
                        filters: aFilters,
                        async: true,
                        success: function (oData, oResponse) {
                            oRoutingModel.setProperty("/aSuggestRoutingAOCIs", oData.results);
                        },
                        error: function (err) {
                            that.fnCheckError(err);
                        }
                    };
                    oDataModel.read("/ET_MaterialSet", oParameters);
                }
            },
            fnChangeRoutStatusChange: function (oEvent) {
                var oSelectedItem = oEvent.getSource();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sSelectedRoutingStatus", oSelectedItem.mProperties.selectedKeys);
            },
            /*Description : Function to open Value help of CreatedBy MultiInput . */
            fnValueHelpCreatedByOpen: function (oEvent) {
                if (!this._oCreatedByHelpDialog) {
                    this._oCreatedByHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.CreatedByList", this);
                    this.getView().addDependent(this._oCreatedByHelpDialog);
                }
                this._oCreatedByHelpDialog.open();
            },
            /*Description : Function to search values inside Value help of CreatedBy MultiInput . **/
            fnCreatedBySearch: function (oEvent) {
                var that = this;
                var sValue = oEvent.getParameters().value;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sValue));
                var oParameters = {
                    filters: aFilters,
                    async: true,
                    success: function (oData, oResponse) {
                        oRoutingModel.setProperty("/aCreatedByList", oData.results);
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_Created_BySet", oParameters);
            },
            /*Description : Function to select values inside Value help of CreatedBy MultiInput .*/
            fnCreatedBySelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oCreatedByInput = this.getView().byId("CreatedByID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oCreatedByInput);
                }
            },
            /*Description : Function to select suggestion values of CreatedBy MultiInput . */
            fnCreatedByLivechange: function (oEvent) {
                var that = this;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var sName = oEvent.getSource().getValue();
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sName));
                var oParameters = {
                    filters: aFilters,
                    async: true,
                    success: function (oData, oResponse) {
                        oRoutingModel.setProperty("/aSuggestCreatedBy", oData.results);
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_Created_BySet", oParameters);
            },
            /*Description : Function to change and validate values of CreatedBy MultiInput . */
            fnCreatedBychange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                /**
                 * Duplicate Token Handling
                 */
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim() === sNewValue.trim();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /*Description : Function to Call of MRP controller MultiInput Data. **/
            fnValuehelpMRPController: function () {
                var that = this;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var aFilters = [];
                var oPlantInput = this.getView().byId("changePlantID");
                if (oPlantInput.getTokens().length > 0) {
                    for (var i = 0; i < oPlantInput.getTokens().length; i++) {
                        var aPlantList = this.getView().byId("changePlantID").getTokens();
                        aFilters.push(new sap.ui.model.Filter("PLANT", sap.ui.model.FilterOperator.EQ, aPlantList[i].getText()));
                    }
                }
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                var oParameters = {
                    filters: aFilters,
                    async: true,
                    success: function (oData, oResponse) {
                        oBusyIndicator.close();
                        oRoutingModel.setProperty("/aMRPControllerList", oData.results);
                        that.fnValueHelpMRPControllerOpen();
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_F4_MRPSet", oParameters);
            },
            /*Description : Function to open Value help of MRP controller MultiInput . **/
            fnValueHelpMRPControllerOpen: function (oEvent) {
                if (!this._oMRPControllerHelpDialog) {
                    this._oMRPControllerHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.MRPController", this);
                    this.getView().addDependent(this._oMRPControllerHelpDialog);
                }
                this._oMRPControllerHelpDialog.open();
            },
            /*Description : Function to search values inside Value help of MRP Controller . **/
            fnMRPControllerSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("MRP", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /*Description : Function to select values inside Value help of MRP Controller.**/
            fnMRPControllerSelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oMRPControllerInput = this.getView().byId("MRPControllerID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oMRPControllerInput);
                }
            },
            /*Description : Function to select suggestion values of MRP Controller . **/
            fnMRPControllerLivechange: function (oEvent) {
                var that = this;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var sValue = oEvent.getSource().getValue();
                var aFilters = [];
                var oPlantInput = this.getView().byId("changePlantID");
                if (oPlantInput.getTokens().length > 0) {
                    for (var i = 0; i < oPlantInput.getTokens().length; i++) {
                        var aPlantList = this.getView().byId("changePlantID").getTokens();
                        aFilters.push(new sap.ui.model.Filter("PLANT", sap.ui.model.FilterOperator.EQ, aPlantList[i].getText()));
                    }
                }
                aFilters.push(new sap.ui.model.Filter("MRP", sap.ui.model.FilterOperator.EQ, sValue));
                var oParameters = {
                    filters: aFilters,
                    async: true,
                    success: function (oData, oResponse) {
                        oRoutingModel.setProperty("/aSuggestMRPController", oData.results);
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_F4_MRPSet", oParameters);
            },
            /*Description : Function to change and validate values of MRP Controller.**/
            fnMRPControllerchange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                /**
                 * Duplicate Token Handling
                 */
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim() === sNewValue.trim();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /*Description : Function to Call of MER Code MultiInput Data. **/
            fnValuehelpMERCode: function () {
                var that = this;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                var oParameters = {
                    async: true,
                    success: function (oData, oResponse) {
                        oBusyIndicator.close();
                        oRoutingModel.setProperty("/aMERCodeList", oData.results);
                        that.fnValueHelpMERCodeOpen();
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_F4_MERSet", oParameters);
            },
            /*Description : Function to open Value help of MER Code MultiInput . **/
            fnValueHelpMERCodeOpen: function (oEvent) {
                if (!this._oMERCodeHelpDialog) {
                    this._oMERCodeHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.MERCode", this);
                    this.getView().addDependent(this._oMERCodeHelpDialog);
                }
                this._oMERCodeHelpDialog.open();
            },
            /*Description : Function to search values inside Value help of MERCode .**/
            fnMERCodeSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("MER", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /*Description : Function to select values inside Value help of MER Code. **/
            fnMERCodeSelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oMERCodeInput = this.getView().byId("MERCodeID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oMERCodeInput);
                }
            },
            /*Description : Function to select suggestion values of MER Code . **/
            fnMERCodeLivechange: function (oEvent) {
                var that = this;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var sValue = oEvent.getSource().getValue();
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("MER", sap.ui.model.FilterOperator.EQ, sValue));
                var oParameters = {
                    filters: aFilters,
                    async: true,
                    success: function (oData, oResponse) {
                        oRoutingModel.setProperty("/aSuggestMERCode", oData.results);
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_F4_MERSet", oParameters);
            },
            /*Description : Function to change and validate values of MER Code.*/
            fnMERCodechange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                /**
                 * Duplicate Token Handling
                 */
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim() === sNewValue.trim();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /*Description : Function to get planner group data on change screen . **/
            fnGetChangePlannerGroupdata: function () {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var aFilter = [];
                var oPlantInput = this.getView().byId("changePlantID");
                if (oPlantInput.getTokens().length > 0) {
                    for (var i = 0; i < oPlantInput.getTokens().length; i++) {
                        var aPlantList = this.getView().byId("changePlantID").getTokens();
                        aFilter.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, aPlantList[i].getText()));
                    }
                }
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                oDataModel.read("/ET_Plnr_GrpSet", {
                    filters: aFilter,
                    success: function (oData) {
                        oBusyIndicator.close();
                        if (oData.results.length > 0) {
                            oRoutingModel.setProperty("/aChnagePlannerGroup", oData.results);
                        } else {
                            oRoutingModel.setProperty("/aChnagePlannerGroup", []);
                        }

                        this._oPlannerGrpValueHelpDialog.open();
                    }.bind(this),
                    error: function (error) {
                        this.fnCheckError(error);
                    }.bind(this)
                });
            },
            /*Description : Function to open planner group MultiInput value help.**/
            fnValuehelpChangePlannerGroup: function () {
                if (!this._oPlannerGrpValueHelpDialog) {
                    this._oPlannerGrpValueHelpDialog = sap.ui.xmlfragment("com.airbus.zcfe2meautorc.fragment.ChangePlannerGroupValueHelp", this);
                    this.getView().addDependent(this._oPlannerGrpValueHelpDialog);
                    this._oPlannerGrpValueHelpDialog.setModel(this.getView().getModel("i18n"), "i18n");
                }
                this.fnGetChangePlannerGroupdata(); //Fetch the planner group data from Odata call
            },
            /*Description : Function to search values inside Value help of planner group . **/
            fnChangePlannerGroupSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Plnr_Grp", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },
            /*Description : Function to select values inside Value help of planner group.**/
            fnChnagePlannerGroupSelect: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems"),
                    oMERCodeInput = this.getView().byId("PlannerGroupID");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    this.fnRemoveDuplicateTokens(aSelectedItems, oMERCodeInput);
                }
            },
            /*Description : Function to select suggestion values of planner group.**/
            fnChangePlannerGroupLivechange: function (oEvent) {
                var that = this;
                var oRoutingModel = that.getOwnerComponent().getModel("oRoutingModel");
                var oDataModel = that.getOwnerComponent().getModel("oSrvModel");
                var sValue = oEvent.getSource().getValue();
                var aFilters = [];
                var oPlantInput = this.getView().byId("changePlantID");
                if (oPlantInput.getTokens().length > 0) {
                    for (var i = 0; i < oPlantInput.getTokens().length; i++) {
                        var aPlantList = this.getView().byId("changePlantID").getTokens();
                        aFilters.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, aPlantList[i].getText()));
                    }
                }
                aFilters.push(new sap.ui.model.Filter("Plnr_Grp", sap.ui.model.FilterOperator.EQ, sValue));
                var oParameters = {
                    filters: aFilters,
                    async: true,
                    success: function (oData, oResponse) {
                        oRoutingModel.setProperty("/aSuggestChnagePlannerGroup", oData.results);
                    },
                    error: function (err) {
                        that.fnCheckError(err);
                    }
                };
                oDataModel.read("/ET_Plnr_GrpSet", oParameters);
            },
            /*Description : Function to change and validate values of planner group.**/
            fnChnagePlannerGroupchange: function (oEvent) {
                var sNewValue = oEvent.getParameter("newValue");
                var aTokens = oEvent.getSource().getTokens();
                /**
                 * Duplicate Token Handling
                 */
                // Check for duplicates, case-insensitive
                var bExists = aTokens.some(function (token) {
                    return token.getText().trim() === sNewValue.trim();
                });
                if (bExists) {
                    // Clear the input field
                    oEvent.getSource().setValue([]);
                }
            },
            /*Description : Function to pass parameters to open routing in new template.**/
            fnChangeTemplateRoutingNewTab: function (oEvent) {
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oVisibilityModel = this.getView().getModel("oVisibilityModel");
                var keyUser = oRoutingModel.getProperty("/keyUser");
                var oTableRowData;
                sap.ushell.Container.setDirtyFlag(false);
                // Button 
                var oText = oEvent.getSource().getText();
                var sChangeTemplate = oBundle.getText("update.ChangeTmp");
                var sChangeRouting = oBundle.getText("createtemp.change");
                var sProceed = oBundle.getText("massUpdate.ProceedButton");
                if (oText === sChangeRouting || oText === sChangeTemplate || oText === sProceed) {
                    if (oRoutingModel.getProperty("/iChangeTemplateDetailsLength") === 0) {
                        sap.m.MessageToast.show(oBundle.getText("changetemplatebtnvalidationmsg"));
                    } else {
                        if (oRoutingModel.getProperty("/keyUser") === "X") {
                            var idChngTable = this.getView().byId("idChangeTemplateTable");
                        } else {
                            var idChngTable = this.getView().byId("idChangeRoutingTable");
                        }
                        var rowid = idChngTable.getSelectedIndices();
                        oTableRowData = idChngTable.getContextByIndex(rowid).getObject();
                    }
                } else {
                    oTableRowData = oEvent.getSource().getBindingContext('oRoutingModel').getObject();
                }
                //Start-V4.0 - Mass Update Show additional Status - MJADMK7Z
                if (oVisibilityModel.getProperty("/sMassUpdateUser") === "X" && oTableRowData.Status !== "ME") {
                    oBusyIndicator.close();
                    MessageBox.error(oBundle.getText("update.noMEStatus"));
                    return;
                }
                //End-V4.0 - Mass Update Show additional Status - MJADMK7Z 
                if (oTableRowData) {
                    if (keyUser === "X" && this.getView().getModel('oVisibilityModel').getProperty('/sMassUpdateUser') === '') {
                        var App = "KeyUser";
                        var oObj = {
                            "CI": oTableRowData.CI,
                            "Plant": oTableRowData.Plant,
                            "Group_No": oTableRowData.Group_No,
                            "Grp_Cntr": oTableRowData.Grp_Cntr,
                            "Task_type": oTableRowData.Task_type
                        };
                        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                        var oParam = {
                            User: App,
                            AOCI: oObj.CI,
                            G: oObj.Group_No,
                            GC: oObj.Grp_Cntr,
                            P: oObj.Plant,
                            TT: oObj.Task_type,
                            User: "KeyUser",
                            mode: "CT",
                            nMode: "ChangeTemp"
                        };
                        var hash =
                            (oCrossAppNavigator &&
                                oCrossAppNavigator.hrefForExternal({
                                    target: {
                                        // semanticObject: "ZSO_CFE2_ME_AU_KEYUSER",
                                        semanticObject: "comairbuszcfe2meautorc",
                                        // action: "track"
                                        action: "display"
                                    },
                                    params: oParam,
                                })) ||
                            "";
                        var url = window.location.href.split("#")[0] + hash;
                        sap.m.URLHelper.redirect(url, true);
                        oBusyIndicator.close();
                    }
                    if (keyUser === "X" && this.getView().getModel('oVisibilityModel').getProperty('/sMassUpdateUser') === 'X') {
                        //condition to check Mass Update User
                        var oObj = {
                            "CI": oTableRowData.CI,
                            "Plant": oTableRowData.Plant,
                            "Group_No": oTableRowData.Group_No,
                            "Grp_Cntr": oTableRowData.Grp_Cntr,
                            "Task_type": oTableRowData.Task_type
                        };
                        oRoutingModel.setProperty("/oRouteDetailsObj", oObj);
                        this.getView().getModel("oRoutingModel").setProperty("/bNavfromselection", true);
                        oBusyIndicator.close();
                        this.getRouter().navTo("UpdateTemplate");
                    }
                    else {
                        if (keyUser === "") {
                            var oObj = {
                                "Material": oTableRowData.Material,
                                "Plant": oTableRowData.Plant,
                                "Group_No": oTableRowData.Group_No,
                                "Grp_Cntr": oTableRowData.Grp_Cntr,
                                "Task_type": oTableRowData.Task_type
                            };
                            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                            var App = "EndUser";
                            var oParam = {
                                User: App,
                                M: oObj.Material,
                                G: oObj.Group_No,
                                GC: oObj.Grp_Cntr,
                                P: oObj.Plant,
                                TT: oObj.Task_type,
                                User: "EndUser",
                                mode: "Change",
                                nMode: "ChangeRouting"
                            };
                            // Change
                            var hash =
                                (oCrossAppNavigator &&
                                    oCrossAppNavigator.hrefForExternal({
                                        target: {
                                            // semanticObject: "ZSO_CFE2_ME_AU_ENDUSER",
                                            semanticObject: "comairbuszcfe2meautorc",
                                            action: "display"
                                        },
                                        params: oParam,
                                    })) ||
                                "";
                            var url = window.location.href.split("#")[0] + hash;
                            sap.m.URLHelper.redirect(url, true);
                            oBusyIndicator.close();
                        }
                    }
                } else {
                    sap.m.MessageToast.show(oBundle.getText("changetemplatebtnvalidationmsg"));
                    oBusyIndicator.close();
                }
                oBusyIndicator.close();
            },
            /*Description : Function is used to change source filter data in end user .**/
            fnSourceChange: function (oEvent) {
                var oSelectedItem = oEvent.getSource();
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                oRoutingModel.setProperty("/sSelectedSource", oSelectedItem.mProperties.selectedKeys);
            },
            /********************** DSValueHelp Fragment **********************************/
            // This method is triggered when group is selected. Common method for Key user & End user.
            fnGroupSelect: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oRoutingModel.setProperty("/selectedChangeGroup", oSelectedItem.getCells()[0].getTitle());
                // Call the method to automatically set group counter if it is only one.
                this.fnGetGroupCounterList();
                //save the value in local storage
                this.fnUpdateLclStorage(this.sStorageFieldName, " " + oSelectedItem.getCells()[0].getTitle().trim(), "Group_No");
            },
            // This method used to fetch Group counters list and prefill if only one. Common method for Key user & End user.
            fnGetGroupCounterList: function () {
                var oDataModel = this.getOwnerComponent().getModel("oSrvModel");
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var sGroup = oRoutingModel.getProperty("/selectedChangeGroup");
                var aTempGCounters = [];
                var oBusyIndicator = new BusyDialog();
                oBusyIndicator.open();

                if (sGroup) {
                    oDataModel.read("/ET_Used_GCSet", {
                        filters: [new Filter("Plnnr", FilterOperator.EQ, sGroup)],
                        success: function (oData) {
                            oBusyIndicator.close();
                            oData.results.filter(function (c) {
                                aTempGCounters.push({
                                    "Available_GC": c.Plnal
                                });
                            });
                            if (aTempGCounters.length === 1) {
                                oRoutingModel.setProperty("/groupCounter", aTempGCounters[0].Available_GC);
                            } else {
                                oRoutingModel.setProperty("/groupCounter", "");
                            }
                        }.bind(this),
                        error: function (error) {
                            oBusyIndicator.close();
                            this.fnCheckError(error);
                        }.bind(this)
                    });
                }
            },
            // This method is triggered when plant is selected. Common method for Key user & End user.
            fnPlantSelect: function (oEvent) {
                var oRoutingModel = this.getView().getModel("oRoutingModel");
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oRoutingModel.setProperty("/selectedChangePlant", oSelectedItem.getCells()[0].getTitle());
                this.fnUpdateLclStorage(this.sStorageFieldName, " " + oSelectedItem.getCells()[0].getTitle().trim(), "Plant");
            },
            /********************** PlantValueHelp Fragment **********************************/
            // This method used to search for Plant in value help. Common method for Key user & End user.
            fnPlantSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter(oFilter);
            },

        });
    });
