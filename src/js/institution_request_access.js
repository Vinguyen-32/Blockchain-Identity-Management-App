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
        })
    },
    createRequest: function () {
        let name = document.getElementsByName("institutionName")[0].value;
        let requestedId = document.getElementsByName("blockchainID")[0].value;
        let allPermissions = $('.checkbox:checkbox').map(function () { return this.value; }).get();
        let selectedPermissions = $('.checkbox:checkbox:checked').map(function () { return this.value; }).get();
        let permissions = allPermissions.map(function(permission){ return selectedPermissions.indexOf(permission) > -1 ? "1": "0"}).join("");

        // console.log("name: " + name)
        // console.log("requestedId: " + requestedId)
        // console.log("permissions: ", permissions)
        App.contracts.IManagement.deployed().then(function (instance) {
            iManagementInstance = instance;

            iManagementInstance.createRequest(name, requestedId, permissions, { from: web3.eth.accounts[0], gas: 3000000 })
                .then(function (receipt) {
                    const { logs } = receipt;
                    const result = logs[0];

                    const data = {
                        requestId: result.args._id
                    };

                    alert(JSON.stringify(data, null, 4))
                    window.location = "institution.html"
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