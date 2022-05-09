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
    attachDL: function () {
        let currentUser = JSON.parse(localStorage["currentUser"] || "{}");

        if (!currentUser.walletId) {
            alert("Error: There is no wallet")
        }
        else {
            let DLID = document.getElementsByName("dlNo")[0].value;
            let name = document.getElementsByName("namePerDL")[0].value;
            let dob = document.getElementsByName("dob")[0].value;
            let address = document.getElementsByName("address")[0].value;

            App.contracts.IManagement.deployed().then(function (instance) {
                iManagementInstance = instance;

                iManagementInstance.attachDl(name, DLID, dob, address, { from: web3.eth.accounts[0], gas: 3000000 })
                    .then(function (receipt) {
                        const { logs } = receipt;
                        const result = logs[0];

                        const data = {
                            dlId: result.args._dlId,
                            walletId: result.args._walletId,
                            address: result.args._from
                        };
                        localStorage["currentUser"] = JSON.stringify(data, null, 4);
                        alert(JSON.stringify(data, null, 4))
                        window.location = "/home"
                    });
            }).catch(function (e) {
                console.log("fail: ", e)
            })
        }
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    });
});