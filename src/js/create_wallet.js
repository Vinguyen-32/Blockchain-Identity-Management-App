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
      })
    },
    createWallet: function () {
        let name = document.getElementsByName("name")[0].value;
        let email = document.getElementsByName("email")[0].value;
        let phone = document.getElementsByName("phone")[0].value;
        App.contracts.IManagement.deployed().then(function (instance) {
            iManagementInstance = instance;

            const event = iManagementInstance.addWallet(name, email, phone, {from: web3.eth.accounts[1], gas:3000000})
            .then(function(receipt){
                const { logs } = receipt;
                const result = logs[0];

                const data = {
                  walletId: result.args._id,
                  address: result.args._from
                };

                alert(JSON.stringify(data, null, 4))
                console.log(JSON.stringify(data, null, 4))
                localStorage["currentUser"] = JSON.stringify(data, null, 4);
                window.location = "/home"
            });
        }).catch(function(e){
          console.log("fail: ", e)
        })
    }
  }
   
  $(function () {
    $(window).load(function () {
      App.init();
    });
  });