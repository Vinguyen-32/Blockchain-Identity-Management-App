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
        let name = document.getElementsByName("institutionName")[0].value;
        let requestedId = document.getElementsByName("blockchainID")[0].value;
        let allPermissions = $('.checkbox:checkbox').map(function () { return this.value; }).get();
        let selectedPermissions = $('.checkbox:checkbox:checked').map(function () { return this.value; }).get();
        let permissions = allPermissions.map(function (permission) { return selectedPermissions.indexOf(permission) > -1 ? "1" : "0" }).join("");

        console.log("name: " + name)
        console.log("requestedId: " + requestedId)
        console.log("permissions: ", permissions)








        App.contracts.IManagement.deployed().then(function (instance) {
            iManagementInstance = instance;

            console.log("requestsCount: " + requestsCount)
            let tableContent = $("#request-table-content");
            tableContent.empty();

            for (let i = 1; i <= requestsCount; i++) {
                iManagementInstance.requests(i).then(function (request) {
                    // uint id;
                    // string institution_name;
                    // address requestedId;
                    // // string[] requestedPermissions;
                    // // string[] approvedPermissions;
                    // string requestedPermissionsString;
                    // string approvedPermissionsString;
                    // string status;


                    let id = request[0];
                    let name = request[1];
                    let status = request[5];

                    let template =
                        `<tr>
                            <td><p class="">${name}</p></td>
                            <td><p class="status status-approved">${status}</p></td>
                            <td><button class="more-info-btn blue-btn" onclick="window.location.href='more-info-approve-access.html?requestId=${id}'">MORE INFO</button></td>
                        </tr>`
                    tableContent.append(template);
                });
            }
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