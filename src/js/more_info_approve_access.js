const PERMISSIONS = [
    "Driver License No.",
    "Name as per Driver License",
    "DOB as per Driver License",
    "Address as per Driver License",
    "Copy of Driver License"
]

App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        return App.initWeb3();
    },
    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        }
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },
    initContract: function () {
        $.getJSON("IdentityManagement.json", function (IManagement) {
            App.contracts.IManagement = TruffleContract(IManagement);
            App.contracts.IManagement.setProvider(App.web3Provider);
            return App.render();
        })
    },
    render: function () {
        App.contracts.IManagement.deployed().then(function (instance) {
            iManagementInstance = instance;

            let url_string = window.location.href;
            let url = new URL(url_string);
            let requestId = url.searchParams.get("requestId");

            if (!requestId) {

            }

            iManagementInstance.requests(requestId).then(function (request) {
                let name = request[1];
                let status = request[5];
                requestedPermissionsString = request[3];
                console.log("requestedPermissionsString: " + requestedPermissionsString)
                let requestedPermissions = requestedPermissionsString.split("");
                let permissionBody = "";
                requestedPermissions.map(function (p, idx) {
                    if (p == "1") {
                        permissionBody += `
                        <tr>
                        <td><p class="">${PERMISSIONS[idx]}</p></td>
                        <td class="checkmark-box">
                            <label>
                                <input class="checkbox" type="checkbox" value="${PERMISSIONS[idx]}">
                                <span class="checkmark"></span>
                            </label>
                        </td>
                    </tr>
                    `
                    }
                })

                document.getElementById("institutionName").innerHTML = name;
                document.getElementById("permissions").innerHTML = permissionBody;
                document.getElementById("requestStatus").innerHTML = status;
                
            });
        }).catch(function (e) {
            console.log("fail: ", e)
        })
    },
    approveRequest: function () {
        let selectedPermissions = $('.checkbox:checkbox:checked').map(function () { return this.value; }).get();
        console.log("asd: " , selectedPermissions)
        let permissions = PERMISSIONS.map(function (permission) { console.log(permission);return selectedPermissions.indexOf(permission) > -1 ? "1" : "0" }).join("");

         console.log("permissions: ", permissions)
        App.contracts.IManagement.deployed().then(function (instance) {
            iManagementInstance = instance;

            let url_string = window.location.href;
            let url = new URL(url_string);
            let requestId = url.searchParams.get("requestId");

            let status = permissions == requestedPermissionsString ? "APPROVED" : permissions == "00000" ? "NOT_APPROVED" : "PATIAL_APPROVED";
            
            iManagementInstance.approveRequest(requestId, status, permissions, { from: web3.eth.accounts[1], gas: 3000000 })
                .then(function (receipt) {
                    const { logs } = receipt;
                    const result = logs[0];

                    const data = {
                        requestId: result.args._id
                    };

                    alert(JSON.stringify(data, null, 4))
                    window.location = "/home"
                });
        }).catch(function (e) {
            console.log("fail: ", e)
        })
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    });
});