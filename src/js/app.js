App = {
  web3Provider: null,
  contracts: {},

  init: function(){
    return App.initWeb3();
  }, 
  
  // async function() {
  //   // Load pets.
  //   $.getJSON('../pets.json', function(data) {
  //     var petsRow = $('#petsRow');
  //     var petTemplate = $('#petTemplate');

  //     for (i = 0; i < data.length; i ++) {
  //       petTemplate.find('.panel-title').text(data[i].name);
  //       petTemplate.find('img').attr('src', data[i].picture);
  //       petTemplate.find('.pet-breed').text(data[i].breed);
  //       petTemplate.find('.pet-age').text(data[i].age);
  //       petTemplate.find('.pet-location').text(data[i].location);
  //       petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

  //       petsRow.append(petTemplate.html());
  //     }
  //   });

  //   return await App.initWeb3();
  // },

  initWeb3: function() {
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
  
  // async function() {
  //   /*
  //    * Replace me...
  //    */

  //   return App.initContract();
  // },

  initContract: function() {
    $.getJSON("IdentityManagement.json", function(IManagement){
      App.contracts.IManagement = TruffleContract(IManagement);
      App.constracts.IManagement.setProvider(App.web3Provider);
      return App.render();
    })
  },
  render: function() {
    let iManagementInstance;
    let loader = $("#loader");
    let content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account){
      if (err === null){
        App.cccount = account;
        $("#accountAddress").html("Your account: " + account);
      }
    });

    App.contracts.IManagement.deployed().then(function(instance) {
      iManagementInstance = instance;
      return iManagementInstance.candidatesCount();
    }).then(function(candidatesCount){
      let candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (let i = 1; i <= candidatesCount; i++){
        iManagementInstance.candidates(i).then(function(candidate){
          let id = candidate[0];
          let name = candidate[1];
          let voteCount = candidate[2];

          let candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>"
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  }
  // bindEvents: function() {
  //   $(document).on('click', '.btn-adopt', App.handleAdopt);
  // },

  // markAdopted: function() {
  //   /*
  //    * Replace me...
  //    */
  // },

  // handleAdopt: function(event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   /*
  //    * Replace me...
  //    */
  // }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
