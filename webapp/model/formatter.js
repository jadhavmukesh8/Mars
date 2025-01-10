jQuery.sap.declare("com.airbus.zcfe2meautorc.model.formatter");
com.airbus.zcfe2meautorc.model.formatter = {
  fnHTMLFormat: function (aTexts) {
    var cLineBreak = "<br />",
      cBold = "<b>",
      cEndBold = "</b>",
      cPara =
        '<pre style="max-width: 72ch; min-width: 72ch; font-family: monospace; white-space: pre-wrap; word-wrap: break-word">',
      cContentNoneditPara =
        '<pre style="max-width: 72ch; min-width: 72ch; font-family: monospace; white-space: pre-wrap;word-wrap; background-color:#bfbfbf;" contenteditable=false>',
      cEndPara = "</pre>";
    var aParas = [],
      sEditable = "",
      sNonEditale = "",
      sText = "",
      count = 0;
    var sEditFlag = true,
      sNonEditFlag = true;
    var textLenght = aTexts.length;
    //if it's empty then wrap it pre tag --- Ergonomy changes..
    if (!textLenght) {
      sText = cPara + sText + cEndPara;
    } else {
      jQuery.each(
        aTexts,
        function (index, oText) {
          //Loop through Plaintext and Includetexts
          oText.Line = this.fnEncodeEntities(oText.Line); //Replacing < and >
          if (oText.Edit === "E") {
            // Ediatable text
            count = 0;
            //sEditable = cLineBreak + oText.Line;
            if (oText.Highlight === "B") {
              oText.Line =
                '<strong style="font-weight:bold;">' + oText.Line + "</strong>";
              sEditable = sEditable + cLineBreak + oText.Line;
            } else if (oText.Highlight === "C") {
              // E3E3E3
              oText.Line =
                "<i style='background-color:#E3E3E3; font-style: normal; max-width: 72ch; min-width: 72ch'>" +
                oText.Line +
                "</i>";
              sEditable = sEditable + cLineBreak + oText.Line;
            } else {
              sEditable = sEditable + cLineBreak + oText.Line;
            }
            sNonEditFlag = false;
            sEditFlag = true;
          } else if (oText.Edit === "N") {
            // Non-Editable Text
            sNonEditale = sNonEditale + cLineBreak + oText.Line;
            sEditFlag = false;
            sNonEditFlag = true;
          } else if (oText.Edit === "I") {
            // Include text
            count++;
            if (count > 1) {
              sNonEditale = sNonEditale.replace(cLineBreak, "");
              aParas.push({
                text: sNonEditale,
                key: "N",
              });
              sNonEditale = "";
            }
            sNonEditale =
              sNonEditale + cLineBreak + cBold + oText.Line + cEndBold;
            sEditFlag = false;
            sNonEditFlag = true;
          }
          if (!sEditFlag && sEditable !== "") {
            sEditable = sEditable.replace(cLineBreak, "");
            aParas.push({
              text: sEditable,
              key: "E",
            });
            sEditable = "";
          } else if (!sNonEditFlag && sNonEditale !== "") {
            sNonEditale = sNonEditale.replace(cLineBreak, "");
            aParas.push({
              text: sNonEditale,
              key: "N",
            });
            sNonEditale = "";
          }
          if (index === textLenght - 1) {
            if (sNonEditFlag) {
              sNonEditale = sNonEditale.replace(cLineBreak, "");
              aParas.push({
                text: sNonEditale,
                key: "N",
              });
              sNonEditale = "";
            } else if (sEditFlag) {
              sEditable = sEditable.replace(cLineBreak, "");
              aParas.push({
                text: sEditable,
                key: "E",
              });
              sEditable = "";
            }
          }
        }.bind(this)
      );
      jQuery.each(aParas, function (index, oPara) {
        // Create Para for Editable and Non Editable texts
        if (oPara.key === "E") {
          oPara.text = cPara + oPara.text + cEndPara;
          sText = sText + oPara.text;
        } else if (oPara.key === "N") {
          oPara.text = cContentNoneditPara + oPara.text + cEndPara;
          sText = sText + oPara.text;
        }
      });
    }
    return sText; //HTML Output
  },

  fnPlainText: function (sText) {
    if (sText) {
      var index = 0,
        sEdit = "",
        aPlaintText = [],
        sHighlight = "",
        aFinal = [],
        aParas = [];
      var re = new RegExp("<p", "gi");
      while (re.exec(sText)) {
        var sPara = sText.slice(index, re.lastIndex - 2);
        index = re.lastIndex - 2;
        aParas.push(sPara);
      }
      //Adding the last paragraph to the array
      sPara = sText.slice(index, sText.length);
      aParas.push(sPara);
      // Removing the intial empty added array
      aParas.splice(0, 1);
      jQuery.each(
        aParas,
        function (index1, oPara) {
          if (oPara.search("<br") >= 0 || oPara.search("<br />") >= 0) {
            //Replace Linebreks
            if (oPara.search("<br />") >= 0) {
              var aPLine = oPara.split("<br />");
            } else {
              aPLine = oPara.split("<br>");
            }
            sEdit = "";
            jQuery.each(aPLine, function (index2, oPLine) {
              //Replace Bold text
              if (oPLine.search("<strong>") >= 0 || oPLine.search("<b>") >= 0) {
                sEdit = "I";
                sHighlight = "";
              } else if (sEdit === "I" || sEdit === "N") {
                sEdit = "N";
                sHighlight = "";
              } else {
                sEdit = "E";
                sHighlight = "";
              }
              if (
                oPLine.search("font-weight:bold") >= 0 ||
                oPLine.search("font-weight: bold") >= 0
              ) {
                sEdit = "E";
                sHighlight = "B";
              }
              // E3E3E3
              if (
                oPLine.search("#E3E3E3") >= 0 ||
                oPLine.search("#e3e3e3") >= 0
              ) {
                sEdit = "E";
                sHighlight = "C";
              }
              aPlaintText.push({
                Line: oPLine.replace(/<(.|\n)*?>/g, ""),
                Edit: sEdit,
                Highlight: sHighlight,
              });
            });
          } else {
            sEdit = "";
            if (oPara.search("<strong>") >= 0 || oPara.search("<b>") >= 0) {
              sEdit = "I";
              sHighlight = "";
            } else if (sEdit === "I" || sEdit === "N") {
              sEdit = "N";
              sHighlight = "";
            } else {
              sEdit = "E";
              sHighlight = "";
            }
            if (
              oPara.search("font-weight:bold") >= 0 ||
              oPara.search("font-weight: bold") >= 0
            ) {
              sEdit = "E";
              sHighlight = "B";
            }
            if (
              oPara.search("background-color:#E3E3E3") >= 0 ||
              oPara.search("background-color: #E3E3E3") >= 0 ||
              oPara.search("background-color:#e3e3e3") >= 0 ||
              oPara.search("background-color: #e3e3e3") >= 0
            ) {
              sEdit = "E";
              sHighlight = "C";
            }

            var sFormattedLine = oPara.replace(/<(.|\n)*?>/g, ""); // Remove newline characters and additional whitespaces
            aPlaintText.push({
              Line: sFormattedLine,
              Edit: sEdit,
              Highlight: sHighlight,
            });
          }
        }.bind(this)
      );
      aPlaintText.map(function (oItem) {
        // To break lines to have maximum 132 charcaters
        if (oItem.Line.length > 132) {
          var iSize = 132;
          var sLine = oItem.Line;
          for (var k = 0; k < sLine.length / iSize; k++) {
            var iMin = iSize * k;
            var iMax = iMin + iSize;
            var sSubline = sLine.slice(iMin, iMax);
            aFinal.push({
              Line: sSubline,
              Edit: oItem.Edit,
              Highlight: oItem.Highlight,
            });
          }
        } else {
          aFinal.push(oItem);
        }
      });
      return aFinal;
    } else {
      return [];
    }
  },
  fnFormatPlainText: function (aText) {
    aText.map(
      function (oItem) {
        //Decode Unicode UTF-8 characters
        oItem.Line = this.fnDecodeEntities(oItem.Line);
        oItem.Line = this.fnRemoveBlankSpaceEnd(oItem.Line);
      }.bind(this)
    );
    return aText;
  },
  fnDSTitle: function (sDStype, oDialog) {
    var resourceBundle = oDialog.getModel("i18n").getResourceBundle();
    if (sDStype === "CI" || sDStype === "targetCI") {
      return resourceBundle.getText("civaluehelp.title");
    } else {
      return resourceBundle.getText("dsvaluehelp.title");
    }
  },

  fnDSText: function (sDStype, oDialog) {
    var resourceBundle = oDialog.getModel("i18n").getResourceBundle();
    if (sDStype === "CI" || sDStype === "targetCI") {
      return resourceBundle.getText("civaluehelp.ci");
    } else {
      return resourceBundle.getText("dsvaluehelp.material");
    }
  },

  fnDSDesc: function (sDStype, oDialog) {
    var resourceBundle = oDialog.getModel("i18n").getResourceBundle();
    if (sDStype === "CI" || sDStype === "targetCI") {
      return resourceBundle.getText("civaluehelp.cidescription");
    } else {
      return resourceBundle.getText("dsvaluehelp.materialdescription");
    }
  },
  fnDecodeEntities: function (input) {
    return $("<div/>").html(input).text();
  },

  // MARS V3.0 undo longtext issue SJOST4UU
  fnRemoveBlankSpaceEnd: function (aLongtext) {
    return aLongtext.trimEnd();
  },

  fnEncodeEntities: function (sText) {
    sText = sText.replaceAll("<", "&lt;");
    sText = sText.replaceAll(">", "&gt;");
    return sText;
  },

  //This method is for enabling / disabling set up & Labor time when StdValKey eq Z000
  fnTiconTimesEnable: function (
    Vplnr,
    Ticon_status_1,
    Ticon_status_2,
    Ticon_status_3,
    StdValKey,
    Calcultype,
    bEnableOprFileds
  ) {
    if (bEnableOprFileds === false) {
      return false;
    } else {
      if (StdValKey === "Z000") {
        return true;
      } else if (Calcultype === "P") {
        return false;
      } else if (
        Ticon_status_1 === "REL" ||
        Ticon_status_2 === "REL" ||
        Ticon_status_3 === "REL"
      ) {
        return false;
      } else if (Vplnr === "") {
        return true;
      } else {
        return false;
      }
    }
  },

  //This method is for hiding / showing set up & Labor time when StdValKey eq Z000.
  fnTiconTimesVisibility: function (StdValKey, SLWID) {
    if (StdValKey === "Z000" || SLWID === "ZMEAUTO") {
      return false;
    } else {
      return true;
    }
  },

  // This method is written for decimal comma separator in Setup Time/ Labour time
  // Developer- SP001581  Date: 07-09-2021
  fnGetFormattedNumeric: function (value) {
    var format = this.getView()
      .getModel("oOperationItemsModel")
      .getProperty("/DCPFM");
    if (value !== undefined && format !== undefined) {
      if (format === ".") {
        var oFloatNumberFormat =
          sap.ui.core.format.NumberFormat.getFloatInstance({
            decimalSeparator: ".",
            groupingSeparator: ",",
            minFractionDigits: 3,
            maxFractionDigits: 3,
          });
        return oFloatNumberFormat.format(value);
      } else if (format === ",") {
        oFloatNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 3,
          maxFractionDigits: 3,
        });
        return oFloatNumberFormat.format(value);
      } else {
        oFloatNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 3,
          maxFractionDigits: 3,
        });
        return oFloatNumberFormat.format(value);
      }
    }
    return value;
  },
  fnGetEmpNumeric: function (value) {
    var format = this.getView()
      .getModel("oOperationItemsModel")
      .getProperty("/DCPFM");
    if (value !== undefined && format !== undefined) {
      if (format === ".") {
        var oFloatNumberFormat =
          sap.ui.core.format.NumberFormat.getFloatInstance({
            decimalSeparator: ".",
            groupingSeparator: ",",
            minFractionDigits: 2,
            maxFractionDigits: 2,
          });
        return oFloatNumberFormat.format(value);
      } else if (format === ",") {
        oFloatNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 2,
          maxFractionDigits: 2,
        });
        return oFloatNumberFormat.format(value);
      } else {
        oFloatNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 2,
          maxFractionDigits: 2,
        });
        return oFloatNumberFormat.format(value);
      }
    }
    return value;
  },
  // This method is written for decimal comma separator in Setup Time/ Labour time
  // Developer- SP001581  Date: 07-09-2021
  getParsedNumeric: function (value, format) {
    if (value !== undefined && format !== undefined) {
      if (format === ".") {
        var oCurrencyFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ".",
          groupingSeparator: ",",
          minFractionDigits: 3,
          maxFractionDigits: 3,
        });
      } else if (format === ",") {
        oCurrencyFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 3,
          maxFractionDigits: 3,
        });
      } else {
        oCurrencyFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 3,
          maxFractionDigits: 3,
        });
      }
      //var oFloatFormat = NumberFormat.getFloatInstance();
      return oCurrencyFormat.parse(value);
    }
    return value;
  },
  getParsedEmpNumeric: function (value, format) {
    if (value !== undefined && format !== undefined) {
      if (format === ".") {
        var oCurrencyFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ".",
          groupingSeparator: ",",
          minFractionDigits: 2,
          maxFractionDigits: 2,
        });
      } else if (format === ",") {
        oCurrencyFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 2,
          maxFractionDigits: 2,
        });
      } else {
        oCurrencyFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: ",",
          groupingSeparator: ".",
          minFractionDigits: 2,
          maxFractionDigits: 2,
        });
      }
      //var oFloatFormat = NumberFormat.getFloatInstance();
      return oCurrencyFormat.parse(value);
    }
    return value;
  },
  // This method is written for displaying date as per user profile format
  // Developer- SP001581  Date: 10-10-2021
  fngetDateFormat: function (value, format) {
    format = this.getView()
      .getModel("oOperationItemsModel")
      .getProperty("/DATFM");
    if (value) {
      if (format === "MM-DD-YYYY") {
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "MM.dd.YYYY",
        });
        var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
        var dateStr = dateFormat.format(new Date(value.getTime() + TZOffsetMs));
      } else if (format === "DD.MM.YYYY") {
        dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "dd.MM.YYYY",
        });
        TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
        dateStr = dateFormat.format(new Date(value.getTime() + TZOffsetMs));
      } else if (format === "MM/DD/YYYY") {
        dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "MM/dd/YYYY",
        });
        TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
        dateStr = dateFormat.format(new Date(value.getTime() + TZOffsetMs));
      } else if (format === "YYYY/MM/DD") {
        dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "YYYY/MM/dd",
        });
        TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
        dateStr = dateFormat.format(new Date(value.getTime() + TZOffsetMs));
      } else if (format === "YYYY.MM.DD") {
        dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "YYYY.MM.dd",
        });
        TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
        dateStr = dateFormat.format(new Date(value.getTime() + TZOffsetMs));
      } else if (format === "YYYY-MM-DD") {
        dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "YYYY-MM-dd",
        });
        TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
        dateStr = dateFormat.format(new Date(value.getTime() + TZOffsetMs));
      } else {
        return value;
      }
    }
    return dateStr;
  },
  //  SP001581 Date:22 Dec,2021
  //Format method added for long text icon in Questions Dialog of Ticon
  // SP001581 Date:8th April,2022 Changes done for Ticon MIP with changed FM's
  fnTiconLongTextIcon: function (COMNT_EXIST) {
    if (COMNT_EXIST === "X") {
      return "sap-icon://request";
    } else {
      return "sap-icon://document";
    }
  },
  fnTiconLongTextTooltip: function (COMNT) {
    if (COMNT) {
      var sFormattedComment = COMNT.replaceAll("<BR>", "\n");
      return sFormattedComment;
    } else {
      return " ";
    }
  },
  /*this method is formmating the component quantity delete button*/
  fnQntDelIconVisibility: function (bChils) {
    if (bChils === "Y") {
      return true;
    } else {
      return false;
    }
  },
  /*this method is formmating the component quantity splite button*/
  fnQntSplitIconVisibility: function (bChild, bPntmChild, bLevel) {
    if (bLevel === "1" || bLevel === "2") {
      return false;
    } else {
      if (bChild === "Y") {
        return false;
      } else {
        return true;
      }
    }
  },
  /*this method is formmating the longtext value*/
  fnFormatRteValue: function (sPlainText, sShortText, sSyncText) {
    var sLongText = "",
      sOprShortText = sShortText || "",
      sSyncOprText = sSyncText;
    if (sPlainText.length > 0) {
      sSyncOprText = sPlainText[0].Line.substring(0, 40);
    }
    //Push Operation Short text if no texts in longtext to maintain synchronization
    if (sPlainText.length < 1 && sOprShortText.length > 0) {
      sPlainText.push({
        Edit: "E",
        Line: sOprShortText,
      });
    } else if (sSyncOprText !== sOprShortText && sPlainText.length > 0) {
      if (sPlainText[0].Edit === "E") {
        //If editable text
        sPlainText[0].Line = sOprShortText;
      } else {
        //or else include text
        if (
          sOprShortText.substring(0, 39) !== sSyncOprText.substring(0, 39) ||
          sSyncOprText.substring(39, 40) !== " " ||
          sOprShortText.substring(39, 40) !== ""
        ) {
          var index = 1;
          for (var i = 1; i < sPlainText.length; i++) {
            if (sPlainText[i].Edit === "N") {
              index++;
            } else if (
              sPlainText[i].Edit === "E" ||
              sPlainText[i].Edit === "I"
            ) {
              break;
            }
          }
          sPlainText.splice(0, index);
          sPlainText.unshift({
            Edit: "E",
            Line: sOprShortText,
          });
        }
      }
    }
    sLongText = this.fnHTMLFormat(sPlainText);
    return sLongText;
  },
  /** NG6B610 - V2.2
   * Description : This method returns the status of BOM Item so that the color code will display accordingly
   */
  fnProposedBOMItemColorStatus: function (bStatus) {
    if (bStatus !== null && bStatus !== undefined) {
      if (bStatus === "1") {
        return "Success";
      } else if (bStatus === "2") {
        return "Indication05";
      } else if (bStatus === "3") {
        return "Indication03";
      } else if (bStatus === "4") {
        return "Indication02";
      } else if (bStatus === "5") {
        return "Information";
      }
    }
  },
  /** NG6B610 - V2.2
   * Description : This method returns the status checkbox of BOM Item
   */
  fnProposedBOMItemTabelCkeckBox: function (bCheck) {
    if (bCheck === "X") {
      return true;
    } else {
      return false;
    }
  },
  /** SGUP3YO4 - V4.1
   * Description : This method returns the status checkbox of BOM table column Relevance of Costing
   */
  fnRelevanceToCostingColumnCheckBox: function (relCheck) {
    if (relCheck === "X") {
      return true;
    } else {
      return false;
    }
  },
  /*SKAGP1R5 V2.0
  function to enable or disable PRT table fields
  */
  fnEnablePrtFields: function (bEnable) {
    if (bEnable) {
      return true;
    } else {
      return false;
    }
  },
  /*NG6b610 V2.2
  //This method is used to select/un select check box for the smart copy table
  */
  fnSmartCopyCheckbox: function (sValue) {
    if (sValue === "X") {
      return true;
    } else {
      return false;
    }
  },
  /*ARAJ88M6 V2.2
  //This method is used to display Success/Failed text according to Smart Copy Results value S/F
  */
  fnSmartCopyResults: function (sValue) {
    if (sValue === "S") {
      return "Success";
    } else if (sValue === "F") {
      return "Failed";
    } else {
      return "";
    }
  },
  /*ARAJ88M6 V2.2
  //This method is used to display row Status color according to Smart Copy Results value S/F/Y
  */
  fnSmartCopyRowStatus: function (sValue) {
    if (sValue === "S") {
      return "Success";
    } else if (sValue === "F") {
      return "Error";
    } else if (sValue === "Y") {
      return "Warning";
    } else {
      return "None";
    }
  },
  /*NG6b610 V2.2
  //This method is used to select/un select check box for the BOM proposed allocation check box
  */
  fnPrposedAllocCheckbox: function (sValue) {
    if (sValue === "X") {
      return true;
    } else {
      return false;
    }
  },
  /*NG6b610 V2.2
  //This method is used to enabled/disabled check box for the BOM proposed allocation check box
  */
  fnPrposedAllocCheckboxEnabled: function (sValue) {
    if (sValue === "X") {
      return false;
    } else {
      return true;
    }
  },
  /*function to format the ticon varaible value 
  SJOST4UU 12/15/2022
  */
  fnFormatFloatValue: function (sValue) {
    var oFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
      decimalSeparator: ".",
      groupingSeparator: ",",
      minFractionDigits: 2,
      maxFractionDigits: 5,
    });

    return oFormat.format(sValue);
  },
  /*V2.2 SKAGP1R5
  function to mange the visibility of form elements 
  */
  fnManageFieldVisibility: function (sKey) {
    if (sKey) {
      return true;
    } else {
      return false;
    }
  },
  /*
  V2.2 SKAGP1R5
  function to enable or disable the user field check box*/
  fnUsrFieldCheckboxEnabled: function (sValue) {
    if (sValue === "X") {
      return true;
    } else {
      return false;
    }
  },
  /*	V2.2 SKAGP1R5
  function parse value as number*/
  fnParseInt: function (sValue) {
    return isNaN(sValue) ? 0 : parseInt(sValue, 0);
  },
  /* v2.2 SKAGP1R5
  function to format the date as per user defined parameters
  */
  fnUserFormatDate: function (dDate) {
    var sformat = this.getView()
      .getModel("oOperationItemsModel")
      .getProperty("/DATFM")
      .toLowerCase()
      .replaceAll("m", "M"),
      dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: sformat,
        utc: true,
      });
    if (dDate) {
      return dateFormat.format(new Date(dDate));
    } else {
      return dDate;
    }
  },
  /* v2.2 ARAJ88M6
    function to return table type on BomStatus value
    */
  fnBomStatusTable: function (sValue) {
    if (sValue === "12" || sValue === "11" || sValue === "10") {
      return "MultiToggle";
    } else {
      return "None";
    }
  },
  /* v2.2 ARAJ88M6
  function to return enable value true/false depending on BomStatus value
  */
  fnBomStatusTableEnable: function (sValue, bFlag) {
    if (bFlag === false) {
      return false;
    } else {
      if (sValue === "12" || sValue === "11" || sValue === "10") {
        return true;
      } else {
        return false;
      }
    }
  },
  fnGetProbabilityText: function (bStatus) {
    if (bStatus === "1") {
      return "Accurate";
    } else if (bStatus === "2") {
      return "High";
    } else if (bStatus === "3") {
      return "Medium";
    } else if (bStatus === "4") {
      return "Low";
    } else if (bStatus === "5") {
      return "";
    }
  },
  // new cmp changes
  fnReturnProposedOprText: function (sColorCode, sNewCompInd, sOperTxt) {
    if (sNewCompInd === "X") {
      if (sOperTxt === "") {
        return "?";
      } else {
        return sOperTxt;
      }
    } else {
      if (sColorCode === 9) {
        return "?";
      } else {
        return sOperTxt;
      }
    }
  },
  /*GGUNO6VD V2.4 MASS UPDATE
  Method : fnReturnProposedOprTextNewComp
  Description :  Function to set the proposed opr number of new components */
  // 	fnReturnProposedOprTextNewComp: function (sNewCompInd, sOperTxt) {
  // 		if (sNewCompInd === "X") {
  // 			return '?';
  // 		} else {
  // 			return sOperTxt;
  // 		}
  // },
  /* function to format the BOM qty
    v2.3 --- Decimal Split US -- SKAGP1R5
  */
  fnFormatBomQty: function (sValue) {
    if (sValue) {
      var sFormat =
        this.getView()
          .getModel("oOperationItemsModel")
          .getProperty("/DCPFM") || ",",
        oFloatNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          decimalSeparator: sFormat,
          groupingSeparator: sFormat === "," ? "." : ",",
          minFractionDigits: 3,
          maxFractionDigits: 3,
        }),
        iParsedValue;
      //no need toparse the value if it already number
      if (typeof sValue === "number") {
        iParsedValue = sValue;
      } else {
        iParsedValue = oFloatNumberFormat.parse(sValue);
      }

      //if it has decimal then format it or return it
      if (iParsedValue && (iParsedValue % 1 || sValue % 1)) {
        //if backend sends the value with ,
        if (sValue.toString().includes(",")) {
          return oFloatNumberFormat.format(iParsedValue);
        } else {
          return oFloatNumberFormat.format(sValue.toString().trim());
        }
      } else {
        return parseFloat(sValue);
      }
    } else {
      return sValue;
    }
  },
  /* function to format the BOM qty
    v2.3 --- Combine US -- SKAGP1R5
  */
  fnQntMergeIconVisibility: function (
    bChild,
    bShowMergeBtn,
    bPntmChild,
    bLevel
  ) {
    if (bLevel === "1" || bLevel === "2") {
      return false;
    } else {
      if (bShowMergeBtn && bChild !== "Y" && bPntmChild !== "X") {
        return true;
      } else {
        return false;
      }
    }
  },
  /* function to format the visibility of Expand and Collapse
    v2.3 --- Phantam Part-- SIKK26L3
  */
  fnReturnExpandVisible: function (
    bChild,
    sPhantom_indicator,
    sPhantom_expand_collapse
  ) {
    if (
      bChild !== "Y" &&
      sPhantom_indicator === "X" &&
      sPhantom_expand_collapse === ""
    ) {
      return true;
    } else {
      return false;
    }
  },

  fnReturnCollapseVisible: function (
    bChild,
    sPhantom_indicator,
    sPhantom_expand_collapse
  ) {
    if (
      bChild !== "Y" &&
      sPhantom_indicator === "X" &&
      sPhantom_expand_collapse === "X"
    ) {
      return true;
    } else {
      return false;
    }
  },
  fnRowSettingsColor: function (bStatus) {
    if (bStatus !== null && bStatus !== undefined) {
      if (bStatus === "1") {
        return "Success";
      } else if (bStatus === "2") {
        return "Information";
      } else if (bStatus === "3") {
        return "Warning";
      } else {
        return "None";
      }
    }
  },
  /* SJOST4UU - V2.4 Variable Generator
   Method : fnToDifferBetweenParameter3
   Description : Function to return true/false depending on Parameter3 to visible property
    */
  fnToDifferBetweenParameter3: function (sValue) {
    if (sValue !== "") {
      return true;
    } else {
      return false;
    }
  },
  fnOprTooltiptxt: function (sValue, Cond) {
    var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
    if (sValue !== "") {
      return resourceBundle.getText("SplitItem");
    } else {
      return resourceBundle.getText("SplitItem");
    }
  },
  /* SJOST4UU - V2.4 Variable Generator
   Method : fnToDifferBetweenParameter3Multiple
   Description : Function to return true/false depending on Parameter3Multiple to visible property
    */
  fnToDifferBetweenParameter3Multiple: function (sValue) {
    if (sValue !== "") {
      return true;
    } else {
      return false;
    }
  },
  /*GGUNO6VD V2.4 MASS UPDATE
  Method : fnSaveVisible
  Description :  Function to set the visibility of the save button */
  fnSaveVisible: function (
    sMassUpdateUser,
    bSaveVisible,
    bChangeSelectedSimpleForm,
    sViewTemplate
  ) {
    if (sMassUpdateUser === "X") {
      if (sViewTemplate === "X") {
        return true;
      }
      else {
        return false;
      }
    } else {
      if (bSaveVisible || bChangeSelectedSimpleForm) {
        return true;
      } else {
        return false;
      }
    }
  },
  fnMARSIconVisibility: function (sVal) {
    if (sVal === "X") {
      return true;
    } else {
      return false;
    }
  },
  // 2.4 Template status US
  // Only ME status is selectable in End user Select template field
  fnMETemplateStatus: function (sStatus) {
    if (sStatus === "ME") {
      return true;
    } else {
      return false;
    }
  },
  fnIconChange: function (sStatus) {
    if (sStatus === "ME") {
      return "sap-icon://accept";
    } else if (sStatus !== "ME") {
      return "sap-icon://message-error";
    }
  },
  fnSelTempRadioVisible: function (sStatus) {
    if (sStatus === "ME") {
      return true;
    } else {
      return false;
    }
  },
  // fnIconColorChange: function (sStatus) {
  //   if (sStatus === "ME") {
  //     return "#008000";
  //   } else {
  //     return "#FFA500";
  //   }
  // },
  // formatAdditionalText: function (oData) {
  //   const plnal = oData.Plnal ? oData.Plnal.padEnd(10) : "".padEnd(10);
  //   const status = oData.Status ? oData.Status.padEnd(15) : "".padEnd(15);
  //   let smallCI_MATNR = oData.SmallCI_MATNR
  //     ? oData.SmallCI_MATNR.padEnd(20)
  //     : "".padEnd(21);
  //   const smalllCI_MAKTX = oData.SmalllCI_MAKTX
  //     ? oData.SmalllCI_MAKTX.padEnd(25)
  //     : "".padEnd(21);..

  //   if (oData.SmallCI_MATNR === "") {
  //     smallCI_MATNR = "".padEnd(21);
  //   }

  //   return plnal + status + smallCI_MATNR + smalllCI_MAKTX;
  // },
  fnOprNoLabeltxt: function (sValue, sCond) {
    var sResourceBundle = this.getView().getModel("i18n").getResourceBundle();
    if (sValue === "10") {
      return sResourceBundle.getText("update.ChangeOprNoCurr");
    } else {
      return sResourceBundle.getText("bom.operationno");
    }
  },
  fnStatusVisible: function (
    sMassUpdateUser,
    bKeyUserVisible,
    bViewTemplate
  ) {
    if (sMassUpdateUser === "X" || bKeyUserVisible !== true) {
      if (bViewTemplate === "X") {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },
  fnStatusVisibleKeyUser: function (
    sMassUpdateUser,
    bKeyUserVisible,
    bEndUserVisible
  ) {
    if (sMassUpdateUser === "X" || bKeyUserVisible === true) {
      return true;
    } else {
      return false;
    }
  },
  fnStatusEnabledMassUpdate: function (sMassUpdateUser) {
    if (sMassUpdateUser === "X") {
      return false;
    } else {
      return true;
    }
  },
  fnRtrStatusVisible: function (
    sMassUpdateUser,
    bEndUserVisible,
    bViewTemplate
  ) {
    if (sMassUpdateUser === "X" || bEndUserVisible === true) {
      if (bViewTemplate === "X") {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  fnMUCheckBoxSelect: function (sChkBx) {
    if (sChkBx === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnMUCheckBoxEnabled: function (sChkBx, sTask) {
    if (sTask === "1" || sTask === "2") {
      if (sChkBx === "" || sChkBx === "X" || sChkBx === "U") {
        return false;
      } else {
        return true;
      }
    }
    else if (sChkBx === "E" && sTask === "9") {
      return false;
    }
    else {
      if (sChkBx === "" || sChkBx === "X") {
        return false;
      } else {
        return true;
      }
    }
  },
  fnMUMaterial: function (sValue) {
    if (sValue !== null && sValue !== undefined) {
      if (sValue === "C1") {
        return "Violet";
      } else if (sValue === "C2") {
        return "Yellow";
      } else if (sValue === "C3") {
        return "Pink";
      }
    }
  },
  fnValueInputEditable: function (
    isTiconEdit,
    REUSE,
    FACTOR,
    CLASS,
    INPUT_DRIVER
  ) {
    if (isTiconEdit === "REL") {
      return false;
    } else if (
      REUSE !== "" ||
      FACTOR !== "" ||
      CLASS !== "" ||
      INPUT_DRIVER !== ""
    ) {
      return false;
    } else {
      return true;
    }
  },
  fnDisplayLngTxtBtn: function (oCond) {
    if (oCond === "U") {
      return true;
    } else {
      return false;
    }
  },
  fnCondOprAcceptIconVisibility: function (oCond, sActivity) {
    if (oCond === "I") {
      return true;
    } else if (oCond === "U" && sActivity === "9") {
      return true;
    } else {
      return false;
    }
  },
  fnCondOprExpIconVisibility: function (oCond, sActivity) {
    if (oCond === "U" && sActivity !== "9") {
      return true;
    } else if (oCond === "E" && sActivity === "9") {
      return true;
    } else {
      return false;
    }
  },
  fnCondOprDelIconVisibility: function (oCond) {
    if (oCond === "D") {
      return true;
    } else {
      return false;
    }
  },
  fnCondOprDeclIconVisibility: function (oCond) {
    if (oCond === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnCondPRTExpOrIconVisibility: function (oCond) {
    if (oCond === "U") {
      return true;
    } else {
      return false;
    }
  },
  fnCondPRTExpGryIconVisibility: function (oCond) {
    if (oCond === "P") {
      return true;
    } else {
      return false;
    }
  },
  fnCondPRTDelIconVisibility: function (oCond) {
    if (oCond === "D") {
      return true;
    } else {
      return false;
    }
  },
  fnCondPRTDeclIconVisibility: function (oCond) {
    if (oCond === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnCondPRTAcceptIconVisibility: function (oCond) {
    if (oCond === "I") {
      return true;
    } else {
      return false;
    }
  },
  fnResultsText: function (sStatus) {
    if (sStatus === "S") {
      return "Success";
    } else {
      return "";
    }
  },
  fnResultsLink: function (sStatus) {
    if (sStatus === "E") {
      return "Error";
    } else {
      return "";
    }
  },
  fnResultsTextVisibility: function (sStatus) {
    if (sStatus === "S") {
      return true;
    } else {
      return false;
    }
  },
  fnResultsLinkVisibility: function (sStatus) {
    if (sStatus === "S") {
      return false;
    } else {
      return true;
    }
  },
  fnCurrStatusSame: function (sCurSts, sNewSts) {
    if (sCurSts !== sNewSts) {
      return true;
    } else {
      return false;
    }
  },
  fnCurrStatusDiffere: function (sCurSts, sNewSts) {
    if (sCurSts === sNewSts) {
      return true;
    } else {
      return false;
    }
  },
  fnCopyButtonVisibiltiyForClassifiedRecs: function (
    PARAMETER3,
    PARAMETER3_MULTIPLE,
    PARAMETER2,
    PARAMETER1,
    KEYWORD
  ) {
    if (
      PARAMETER3 !== "" ||
      PARAMETER3_MULTIPLE !== "" ||
      PARAMETER2 !== "" ||
      PARAMETER1 !== "" ||
      KEYWORD !== ""
    ) {
      return true;
    } else {
      return false;
    }
  },
  fnStatusSelectionForKeyUser: function (
    Status,
    Userflag,
    Tmpl_User,
    Key_User
  ) {
    if (Status === "ME" && Userflag === "" && Key_User === "X") {
      return false;
    } else if (
      (Status === "MC", "MD", "MG" && Userflag === "" && Tmpl_User === "X")
    ) {
      return false;
    } else {
      return true;
    }
  },
  fnBomStatusTableEnableItemsAssign: function (sValue, bFlag, aFlag) {
    if (aFlag === true) {
      if (bFlag === false) {
        return false;
      } else {
        if (sValue === "12" || sValue === "11" || sValue === "10") {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  },
  //GGUNO6VD - to make the similar text bold and text
  fnGetSimilarPartNo: function (Boldchars, SimilarPartNo, Frstcharskp) {
    if (Boldchars !== undefined && SimilarPartNo !== null && Frstcharskp !== null) {
      var ssimlarity = "";
      var i = 0;
      if (Boldchars > 0) {
        if (Frstcharskp === "X") {
          i = 1;
        } else {
          i = 0;
        }
        for (; i < Boldchars; i++) {
          ssimlarity += SimilarPartNo[i];
        }
        return SimilarPartNo.replace(
          ssimlarity,
          "<strong><cite>" + ssimlarity + "</cite></strong>"
        );
      } else {
        return SimilarPartNo;
      }
    }
  },
  //GGUNO6VD - to make the similar text bold and text
  fnGetSimilarDesc: function (SimilarDesc, NewCompDesc) {
    if (SimilarDesc !== null && NewCompDesc !== null) {
      var ssimlarity = [],
        finSimlarity = "",
        simCompDesc = SimilarDesc.split(" "),
        newCompDesc = NewCompDesc.split(" ");
      for (var i = 0; i < simCompDesc.length; i++) {
        if (simCompDesc[i] === newCompDesc[i]) {
          ssimlarity[i] = simCompDesc[i];
        } else {
          break;
        }
      }
      if (ssimlarity.length > 0) {
        finSimlarity = ssimlarity.join(" "); // [one,two,three] ->one two three
        SimilarDesc = SimilarDesc.replace(
          finSimlarity,
          "<strong><cite>" + finSimlarity + "</cite></strong>"
        ); //<strong><cite>one two three
        return SimilarDesc;
      } else {
        return SimilarDesc;
      }
    }
  },
  //GGUNO6VD - to append the score with "Pts."
  fnGetScorePerc: function (sScore) {
    if (sScore !== null) {
      return sScore + "Pts.";
    }
  },
  //GGUNO6VD - to highlight if similar comp weight and new component weight are matched
  fnGetSimilarWeight: function (SmlrCompWgt, NewCompwgt) {
    if (SmlrCompWgt !== null && NewCompwgt !== null) {
      if (SmlrCompWgt === "") {
        return "- G";
      }
      if (SmlrCompWgt === NewCompwgt) {
        return "<strong><cite>" + SmlrCompWgt + "</cite></strong>";
      } else {
        return SmlrCompWgt;
      }
    }
  },

  fnSourceColorUpdate: function (sValue) {
    if (sValue !== null) {
      if (sValue === "X") {
        return "Orange";
      } else {
        return "Plain";
      }
    }
  },
  // visible="{= ${oOperationItemsModel>Vplnr} === '' &amp;&amp; ${oRoutingModel>/keyUser} !== 'X'}"
  fnModifyColorOPRYellow: function (sVplnr, skeyUser, sValue) {
    if (sVplnr === "" && skeyUser !== 'X') {
      if (sValue !== "" && sValue !== '000000000000000000') {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  fnModifyColorOPR: function (sVplnr, skeyUser, sValue) {
    if (sVplnr === "" && skeyUser !== 'X') {
      if (sValue === "" || sValue === '000000000000000000') {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  fnObjDepColorOPRYellow: function (sVplnr, sMassUser, sValue) {
    if (sVplnr === "" && sMassUser !== 'X') {
      if (sValue !== "" && sValue !== '000000000000000000') {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  fnObjDepColorOPR: function (sVplnr, sMassUser, sValue) {
    if (sVplnr === "" && sMassUser !== 'X') {
      if (sValue === "" || sValue === '000000000000000000') {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  fnObjDepColorOPRBlue: function (sMassUser, sValue) {
    if (sMassUser !== 'X') {
      if (sValue !== "" && sValue !== '000000000000000000') {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  fnClassificationColor: function (sValue, sMassUpdateUser) {
    if (sValue !== "X" && (sMassUpdateUser !== "X" || sMassUpdateUser === undefined)) {
      return true;
    } else {
      return false;
    }
  },
  fnClassificationColorBlue: function (sValue, sMassUpdateUser) {
    if (sValue === "X" && (sMassUpdateUser !== "X" || sMassUpdateUser === undefined)) {
      return true;
    }
    else {
      return false;
    }
  },
  fnChangeTemplatecheckBoxVisibility: function (sValue) {
    if (sValue === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnChangeTemplateAgendaVisibility: function (sValue) {
    if (sValue === true) {
      return true;
    } else {
      return false;
    }
  },
  fnRoutingAgendaVisibility: function (sValue) {
    if (sValue === false) {
      return true;
    } else {
      return false;
    }
  },
  fnNoEmployeesSame: function (sValue, aValue) {
    if (sValue !== null && aValue !== null) {
      if (aValue === sValue) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  fnNoEmployeesDifferent: function (sValue, aValue) {
    if (sValue !== null && aValue !== null) {
      if (aValue !== sValue) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  fnNewCompIbtnVisibal: function (sIbtn) {
    if (sIbtn === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnNewCompGrayIbtnVisibal: function (sIbtn) {
    if (sIbtn === "") {
      return true;
    } else {
      return false;
    }
  },
  fnNewcompRowColor: function (sColor) {
    if (sColor === "W") {
      return "Information";
    } else if (sColor === "G") {
      return "Success";
    }
    else {
      return "None";
    }
  },
  fnNewCompColorUpdate: function (sValue) {
    if (sValue === "X") {
      return "Orange";
    } else {
      return "Plain";
    }
  },
  fnSaveEnable: function (bSavedBomSplitData, sViewTemplate) {
    if (bSavedBomSplitData) {
      if (sViewTemplate === "") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  fnMatVisible: function (sKeyUser, sMassUpdateUser, sViewTemplate) {
    if (sMassUpdateUser === "X" && sViewTemplate === "" && sKeyUser === "X") {
      return false;
    }
    return true;
  },
  fnStdkeyopr: function (arefktch, sMassupdate) {
    if (sMassupdate !== "X") {
      if (arefktch !== "X") {
        return true;
      } else {
        return false;
      }
    }
  },
  langDisplay: function (sLang) {
    if (sLang === "E") {
      return "EN";
    }
    if (sLang === "F") {
      return "FR";
    }
    if (sLang === "D") {
      return "DE";
    }
    if (sLang === "S") {
      return "SP";
    }
  },
  fnCharTableVisible: function (sClass) {
    if (sClass === "") {
      return false;
    } else {
      return true;
    }
  },
  fnCharValueVisible: function (sCharVaule) {
    if (sCharVaule === "X") {
      return false;
    } else {
      return true;
    }
  },
  fnDelCompVisible: function (sOprNo) {
    if (sOprNo !== "" && sOprNo !== undefined) {
      return true;
    }
    else {
      return false;
    }
  },
  //Mini's V3.2 ....formatter to display the copy button
  fnCopyVisible: function (sPrtNo) {
    if (sPrtNo !== "" && sPrtNo !== undefined) {
      return true;
    }
    else {
      return false;
    }
  },
  fnMM03BOMVisible: function (sPrtNo, sItemCat) {
    if (sPrtNo !== "" && sPrtNo !== undefined) {
      if (sItemCat === "L" || sItemCat === "N" || sItemCat === "Y" || sItemCat === "P" || sItemCat === "R") {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  },
  fnMM03PRTVisible: function (sPrtMatNo) {
    if (sPrtMatNo !== "" && sPrtMatNo !== undefined) {
      return true;
    } else {
      return false;
    }
  },
  fnOprCol: function (sValue) {
    if (sValue === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnInspCharColor: function (sValue, sMassUpdateUser, sValEmpty) {
    if (sValue === "" && (sMassUpdateUser !== "X" || sMassUpdateUser === undefined) && sValEmpty === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnInspCharColorBlue: function (sValue, sMassUpdateUser, sValEmpty) {
    if (sValue === "X" && (sMassUpdateUser !== "X" || sMassUpdateUser === undefined) && sValEmpty === "") {
      return true;
    }
    else {
      return false;
    }
  },
  fnInspCharColorDisable: function (sValue, sMassUpdateUser, sValEmpty) {
    if (sValue === "" && sValEmpty === "" || (sMassUpdateUser === "X")) {
      return true;
    }
    else {
      return false;
    }
  },
  fnRefRoutingSelected: function (sVal) {
    if (sVal === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnStingCombine: function (sVal1, sVal2) {
    return sVal1 + "/" + sVal2;
  },
  fnRowColorPrt: function (sVal, sedit) {

    if (sVal === 'X') {
      return "Information";
    }
    if (sedit === true) {
      return "Warning";
    }
    if (sedit === true && sVal === 'X') {
      return "Warning";
    }
    else {
      return "None";
    }
  },
  fnInspLongTextBtn: function (sVal) {
    if (sVal !== "") {
      return true;
    } else {
      return false;
    }
  },
  fnSourceColorUpdateItmCat: function (sValue) {
    if (sValue !== null) {
      if (sValue === "T") {
        return "Orange";
      } else {
        return "Plain";
      }
    }
  },
  fnCombineScorePercent: function (sScore, sPercent) {
    if (sScore && sPercent) {
      return sPercent + "%" + " (" + sScore + ")";
    } else {
      return "";
    }
  },
  fnASPColor: function (sValue) {
    switch (sValue) {
      case 'D':
        return "Red";
      case 'E':
        return "Blue";
      case 'A':
        return "Green";
      case 'S':
        return "Gray";
      case 'U':
        return "Purple";
      case "":
        return "White";
    }
  },
  fnRoutinfStatusCheckOKIconVisible: function (sOK, sNOK, sNA) {
    if (sOK === "X" && sNOK === "" && sNA === "") {
      return true;
    } else {
      return false;
    }
  },
  fnRoutinfStatusCheckNOKIconVisible: function (sOK, sNOK, sNA) {
    if (sNOK === "X" && sOK === "" && sNA === "") {
      return true;
    } else {
      return false;
    }
  },
  fnRoutinfStatusCheckNAIconVisible: function (sOK, sNOK, sNA) {
    if (sNA === "X" && sOK === "" && sNOK === "") {
      return true;
    } else {
      return false;
    }
  },
  fnASPLRowColor: function (sValue, sValue1, sValue2) {
    if (sValue === 'X' && sValue1 === "X" && sValue2 === "") {
      return "OrangeEnd";
    } else if (sValue === 'X' && sValue1 === "" && sValue2 === "X") {
      return "OrangeStart";
    } else if (sValue === '' && sValue1 === "X" && sValue2 === "") {
      return "PlainEnd";
    } else if (sValue === '' && sValue1 === "" && sValue2 === "X") {
      return "PlainStart";
    } else if (sValue === 'X' && sValue1 === "" && sValue2 === "") {
      return "Orange"
    } else if (sValue === '' && sValue1 === "" && sValue2 === "") {
      return "Plain"
    }
  },
  fnASPLFormatBold: function (sRight, sLeft, sLMaterial, sRMaterial, sRMod) {
    if (sRMod !== "A") {
      if (sLMaterial === sRMaterial && sLMaterial && sRMaterial) {
        if (sLeft !== sRight) {
          sRight = "<strong>" + sRight + "</strong>"
          return sRight;
        }
      } else {
        if (sRight !== sLeft && sLeft) {
          sRight = "<strong>" + sRight + "</strong>"
          return sRight;
        } else {
          return sRight;
        }
      }
    } else {
      return sRight;
    }
  },
  fnASPLFormatBoldScore: function (sScore, sPercent, sBoldflag) {
    if (sScore && sPercent) {
      sTxt = sPercent + "%" + " (" + sScore + ")";
    } else {
      sTxt = "";
    }
    if (sBoldflag === 'X') {
      sTxt = "<strong>" + sTxt + "</strong>"
      return sTxt;
    } else {
      return sTxt;
    }
  },
  fnASPLFormatBoldIcon: function (sMod, sBold) {
    var color;
    if (sBold === 'X') {
      if (sMod === 'E') {
        color = "#002040"
      }
      if (sMod === 'D') {
        color = "#990000"
      }
      if (sMod === 'S') {
        color = "#004880"
      }
      if (sMod === 'A') {
        color = "#00501a"
      }
      return color;
    } else {
      if (sMod === 'E') {
        color = "#004080"
      }
      if (sMod === 'D') {
        color = "#cc0000"
      }
      if (sMod === 'S') {
        color = "#0096FF"
      }
      if (sMod === 'A') {
        color = "#00802b"
      }
      return color;
    }
  },
  fnMARSIconVisibilityKeyUser: function (sVal) {
    if (sVal === "X") {
      return true;
    } else {
      return false;
    }
  },
  fnMassUpdateOprEditIcon: function (sMassUpdateUser, sMassUpdateOprEditIcon, sVplnr) {
    //Mass Update user display edit icon only for selected operation number
    if (sMassUpdateUser === "X") {
      if (sMassUpdateOprEditIcon === "X") {
        return true;
      } else {
        return false;
      }
      //Key user display edit icon only for normal operation(not Ref. Opr.) 
    } else {
      if (sVplnr === "") {
        return true;
      } else {
        return false;
      }
    }
  },
};
