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
            ethereum.request({ method: 'eth_requestAccounts' });
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
                approvedPermissionsString = request[4];
                let requestedPermissions = requestedPermissionsString.split("");
                let permissionBody = "";

                iManagementInstance.DLs(request[2]).then(function (DL) {
                    iManagementInstance.wallets(request[2]).then(function (wallet) {
                        requestedPermissions.map(function (p, idx) {
                            const dlData = [
                                DL[2],
                                DL[1],
                                DL[3],
                                DL[4],
                                ""
                            ]

                            if (p == "1") {
                                const approved = approvedPermissionsString[idx] == "1";
                                permissionBody += `
                            <tr>
                            <td><p class="">${PERMISSIONS[idx]}</p></td>
                            <td class="checkmark-box">
                                <label>${approved ? '✔️' : '❌'}</label>
                            </td>
                            <td>
                                ${approved ? dlData[idx] : ""}
                            </td>
                        </tr>
                        `
                            }
                        })

                        document.getElementById("institutionName").innerHTML = name;
                        document.getElementById("permissions").innerHTML = permissionBody;
                        document.getElementById("requestStatus").innerHTML = status;
                    })
                })

            });
        }).catch(function (e) {
            console.log("fail: ", e)
        })
    },
    approveRequest: function () {
        let selectedPermissions = $('.checkbox:checkbox:checked').map(function () { return this.value; }).get();
        console.log("asd: ", selectedPermissions)
        let permissions = PERMISSIONS.map(function (permission) { console.log(permission); return selectedPermissions.indexOf(permission) > -1 ? "1" : "0" }).join("");

        console.log("permissions: ", permissions)
        App.contracts.IManagement.deployed().then(function (instance) {
            iManagementInstance = instance;

            let url_string = window.location.href;
            let url = new URL(url_string);
            let requestId = url.searchParams.get("requestId");

            let status = permissions == requestedPermissionsString ? "APPROVED" : permissions == "00000" ? "NOT APPROVED" : "PATIAL APPROVED";

            iManagementInstance.approveRequest(requestId, status, permissions, { from: web3.eth.accounts[0], gas: 3000000 })
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