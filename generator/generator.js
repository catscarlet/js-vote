var newCount = 1;
function addHoverDom(treeId, treeNode) {
  //Need css
  if (!treeNode.isParent) {
    return;
  }
  var sObj = $("#" + treeNode.tId + "_span");
  if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) {
    return;
  };
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
    "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  var btn = $("#addBtn_" + treeNode.tId);
  if (btn) {btn.bind("click", function() {
    var zTree = $.fn.zTree.getZTreeObj("zTree");
    zTree.addNodes(treeNode, { id:(100 + newCount), pId:treeNode.id, name:"New Option" + (newCount++) });
    return false;
  });};
};

function removeHoverDom(treeId, treeNode) {
  $("#addBtn_" + treeNode.tId).unbind().remove();
};

var zSetting = {
  data: {
    simpleData: {
      enable: true
    },
    keep: {
      leaf: true,
      parent: true
    }
  },
  edit: {
    enable: true,
    editNameSelectAll: true,
    //showRemoveBtn: showRemoveBtn,
    drag:{
      isCopy: false,
      isMove: false
    }
  },
  check: {
    enable: true,
    chkStyle: 'radio'
  },
  view: {
    addHoverDom: addHoverDom,
    removeHoverDom: removeHoverDom,
    selectedMulti: false,
    dblClickExpand: false
  }
};
var nodes;
$(document).ready(function() {
  $.getJSON("stand_to_ztree.php", function(result) {
    nodes = result;
    $.fn.zTree.init($("#zTree"), zSetting, nodes);
  });

  $("#button_add").click(function() {
    var treeObj = $.fn.zTree.getZTreeObj("zTree");
    var newNodes = [ { "id": 200 + newCount++, "name": "New Question title",  "qInfo": "New Question information",  "qPic": "New Question Picture URL",  "qChoice": "s",  "isParent": true, "nocheck": true } ];
    treeObj.addNodes(null, newNodes);
  });

  $("#button_sub").click(function() {
    var treeObj = $.fn.zTree.getZTreeObj("zTree");
    var nodesArray = treeObj.transformToArray(treeObj.getNodes());
    var qNodes = new Array();
    var oNodes = new Array();
    var zIdq = 0;
    var zIdo = 0;
    $.each(nodesArray, function(k, v) {
      if (v.isParent) {
        zIdq++;
        zIdo = 0;
        qNodes.push( {
          "id": zIdq,
          "name": v.name,
          "qInfo": v.qInfo,
          "qPic": v.qPic,
          "qChoice": "s"
        } );
        //This code need to change to use 'children' instead.
      } else {
        zIdo++;
        oNodes.push( {
          "id": zIdq * 10 + zIdo,
          "pId": zIdq,
          "name": v.name,
          "checked": v.checked
        } );
      }

    });

    $.each(qNodes, function(qNodesK, qNodesV) {
      var tmpArray = new Array();
      $.each(oNodes, function(oNodesK, oNodesV) {

        if (oNodesV.pId == qNodesV.id) {
          tmpArray.push(oNodesV);

          //console.log(oNodesV);
          if (oNodesV.checked == true) {
            //console.log(oNodesV);
            qNodes[ qNodesK ][ "right" ] = oNodesV.id;
          }
        }
      });

      qNodes[ qNodesK ][ "optionStr" ] = JSON.stringify(tmpArray);
    });

    qJson =  {
      "mTitle": "This is main title",
      "mInfo": "This is main information",
      "mPic": "This is main title picturl url",
      "question":qNodes
    };

    console.log(JSON.stringify(qJson));

  });
});
