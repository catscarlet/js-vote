var questionData;

function getTheQuestion() {
  console.log("Let's get The Question");
  $.ajax({
    type:'GET',
    url:'test.json',
    dataType:"json",
    async:false,
    success:function(msg) {
      questionData = msg;
      console.log('get The Question Success !');
    },
    error:function() {
      console.log('get The Question Failed !');
    }
  });
}

var zSetting = {
  data: {
    simpleData: {
      enable: true
    }
  },
  async: {
    enable: true,
    //url: "ztree_to_ztree.php",
    url: "vote_to_ztree.php",
    autoParam: [ "id" ]
  }
};



$(document).ready(function() {

  $.fn.zTree.init($("#zTree"), zSetting);

  $("#button_sub").click(function() {
    var treeObj = $.fn.zTree.getZTreeObj("zTree");
    var nodesArray = treeObj.transformToArray(treeObj.getNodes());
    var qNodes = new Array();
    var oNodes = new Array();

    $.each(nodesArray, function(k, v) {

      if (v.isParent) {
        qNodes.push( { "id": v.id,
          "pId": v.pId,
          "name": v.name,
          "qInfo": v.qInfo,
          "qPic": v.qPic,
          "qChoice": v.qChoice,
          "isParent": v.isParent } );
      } else {
        oNodes.push( { "id": v.id,
          "pId": v.pId,
          "name": v.name,
          "isParent": v.isParent } );
      }

    });




    $.each(qNodes, function(qNodesK, qNodesV) {
      var tmpArray = new Array();
      $.each(oNodes, function(oNodesK, oNodesV) {

        if (oNodesV.pId == qNodesV.id) {
          tmpArray.push(oNodesV);
        }
      });

      qNodes[ qNodesK ][ "optionStr" ] = JSON.stringify(tmpArray);
    });
    console.log(JSON.stringify(qNodes));
  });
});