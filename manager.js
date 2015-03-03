
//An object responsible for handling requests from another page
var Manager = function () {
alert("manager loaded");
    //Sets up a listener for the postMessage call from the IFrame
    var Init = function () {
        $(window).on("message", function (e) {
            //debugger;
            switch (e.originalEvent.data.action) {
                case "Save":
                    ExtJSApi().Save();
                    break;
                case "SaveState":
                    ExtJSApi().SaveState();
                    break;
                case "Load":
                    ExtJSApi().Load(e.originalEvent.data.data);
                    break;
                case "GetGridDataFromServer":
                    ExtJSApi().GetGridDataFromServer();
                    break;
                case "GetDataFromCRM":
                    ExtJSApi().GetDataFromCRM();
                    break;
            }
        });
    }

    //Returns a JSON array in a postMessage to the Host
    var SaveState = function () {
        alert("IFrame: Save State fired");

        var newValue = [{
            "firstName": "Cox",
            "lastName": "Carney",
            "company": "Enormo",
            "employed": true
        },
      {
          "firstName": "Lorraine",
          "lastName": "Wise",
          "company": "Comveyer",
          "employed": false
      },
      {
          "firstName": "Nancy",
          "lastName": "Waters",
          "company": "Fuelton",
          "employed": false
      }];
        parent.postMessage(newValue, "https://realcommercedev.crm.dynamics.com");
    };

    //Indicates that a save has been called
    var Save = function () {
        alert("IFrame: Save fired");
    };

    //Indicates that a load has been called
    var Load = function (value) {
        alert("IFrame: Load fired");
        //parent.postMessage("Loaded from Server", "https://realcommercedev.crm.dynamics.com");
    };

    //Returns a JSON array to the caller - GridCtrl
    var GetGridDataFromServer = function () {
        alert("IFrame: Get Data From Host fired");
        return [
             {
                 "firstName": "Cox",
                 "lastName": "Carney",
                 "company": "Enormo",
                 "employed": true
             },
             {
                 "firstName": "Lorraine",
                 "lastName": "Wise",
                 "company": "Comveyer",
                 "employed": false
             },
             {
                 "firstName": "Nancy",
                 "lastName": "Waters",
                 "company": "Fuelton",
                 "employed": false
             }];
    };

    //Sending an OData request to the CRM - currently pops an error due to same origin policy
    var GetDataFromCRM = function () {
        alert("IFrame: Get Data From CRM fired");

        $.ajax({
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: 'https://realcommercedev.crm.dynamics.com/XRMServices/2011/OrganizationData.svc//AccountSet?$select=Name,Telephone1,Address1_Country,Address1_City',
            //data: jsonAccount,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                debugger;

                alert("IFrame: OData succeeded");

                if (data.d.results != null && data.d.results != undefined && data.d.results.length > 0) {
                    var dataSet = [];
                    for (var index in data.d.results) {
                        dataSet.push({
                            "Name": data.d.results[index].Name,
                            "Phone": data.d.results[index].Telephone1,
                            "Country": data.d.results[index].Address1_Country,
                            "City": data.d.results[index].Address1_City
                        });
                    }
                }

                //send dataSet to the grid
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("IFrame: "+textStatus);
            }
        });
    }

    return {
        Init: Init,
        Save: Save,
        SaveState: SaveState,
        Load: Load,
        GetDataFromCRM: GetDataFromCRM,
        GetGridDataFromServer: GetGridDataFromServer
    };
};



