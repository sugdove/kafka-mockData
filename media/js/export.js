/**
 * Created by suge on 2017/6/7.
 */
//显示zookeeper方法
$.ajax({
    url:"media/json/get.json",
    //"http://" + localhost + "/longGangKafka/zookeeper/get",
    cache: true,
    type: "post",
    async: false,
    success: function (data) {
        console.log(data);
        var str = "";
        for(var key in data){
            var ip = data[key].ip;
            var port = data[key].port;
            var timestam ="创建时间:"+data[key].timestam;
            var zookeeper = ip+":"+port;
            var znode = data[key].znode;
            var showip;
            if(ip.split(",").length>2){
                showip = ip.split(",")[0]+","+ip.split(",")[1]
            }
            else{
                showip = ip;
            }
            var description = data[key].description;
            var showzookeeper =description+" "+znode+" "+showip+":"+port;
            str += "<li class='vcip_li' title='"+timestam+"' data-zookeeper='"+zookeeper+"' data-znode='"+znode+"'><img src='media/image/datacenter.png' class='zookeeper_img'>"+showzookeeper+"</li>";
        }
        $("#vmware-list").html(str);
        $("#vmware-list-2").html(str);
    }
});
//获取右侧具体信息
var znode;
var zookeeper;
var ip;
var port;
$("#vmware-list").on("click",".vcip_li",function () {
    $("#sample_1").dataTable().fnDestroy();
    $("#vmware-list").find(".vcip_li").removeClass("eee");
    $(this).addClass("eee");
     zookeeper = $(this).data("zookeeper");
     ip = zookeeper.split(":")[0];
     port = zookeeper.split(":")[1];
    znode = $(this).data("znode");
    $("#alert-info").hide();
    $("#vcid-id").val(zookeeper);
    $(".black_overlay").show();
    $(".spinner").show();
    $.ajax({
        cache: true,
        type: "post",
        url:"media/json/getAllTables.json",
        //"http://" + localhost + "/longGangKafka/getAllTables",
        data:{hbasezk:ip,hbaseport:port,znode:znode},
        async: true,
        success: function (data) {
            if(data.length==1&&data[0].tableName==="-1"){
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '连接超时！',
                    content: '连接超时请检查错误（此确认框会在3秒后消失）',
                    autoClose: '确定|3000',
                    buttons: {
                        确定: function () {
                            $(".black_overlay").hide();
                            $(".spinner").hide();
                            $("#v_tbody").html("");
                            $("#table_div").hide();
                            $(".alert-info").show();
                        }
                    }
                });
            }
            else{
                $("#table_div").show();
                $(".alert-info").hide();
                $(".black_overlay").hide();
                $(".spinner").hide();
                $("#sample_1").dataTable().fnDestroy();
                $("#sample_1_thead").find("th").eq(4).css("width","10%");
                $("#sample_1_thead").find("th").eq(0).css("width","3%");
                var length = data.length;
                var i = 0;
                var str ="";
                for (i; i < length; i++) {
                    var num = i + 1;
                    var tableName = data[i].tableName;
                    var enable = data[i].enable;
                    var manage;
                    switch (enable) {

                        case true:
                            enable = "<span class='label label-success'>可用</span>";
                            str+="<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='tableName'  class='checkboxes ck2' value='" + tableName + "'></td><td>" + num + "</td><td>" + tableName + "</td><td class='hidden-480'>" + enable + "</td></tr>";
                            break;
                        case false:
                            enable = "<span class='label label-danger'>不可用</span>";
                            str+="<tr class='odd gradeX'><td class='sorting_1'><input type='radio' name='tableName'  disabled class='checkboxes ck2' value='" + tableName + "'></td><td>" + num + "</td><td>" + tableName + "</td><td class='hidden-480'>" + enable + "</td></tr>";
                            break;
                    }


                }
                $("#v_tbody").html(str);
                if (!jQuery().uniform) {
                    return;
                }
                var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
                if (test.size() > 0) {
                    test.each(function () {
                        if ($(this).parents(".checker").size() == 0) {
                            $(this).show();
                            $(this).uniform();
                        }
                    });
                }
                $('#sample_1').dataTable({
                    "aoColumnDefs": [
                        {"orderable": false, "aTargets": [0, 2, 3]}// 制定列不参与排序
                    ],
                    "aLengthMenu": [
                        [5, 15, 20, -1],
                        [5, 15, 20, "All"] // change per page values here
                    ],
                    // set the initial value
                    "iDisplayLength": 5,
                    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                    "sPaginationType": "bootstrap",
                    language: {
                        "sProcessing": "处理中...",
                        "sLengthMenu": "显示 _MENU_ 项结果",
                        "sZeroRecords": "没有匹配结果",
                        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                        "sInfoPostFix": "",
                        "sSearch": "搜索:",
                        "sUrl": "",
                        "sEmptyTable": "表中数据为空",
                        "sLoadingRecords": "载入中...",
                        "sInfoThousands": ",",
                        "oPaginate": {
                            "sFirst": "首页",
                            "sPrevious": "上页",
                            "sNext": "下页",
                            "sLast": "末页"
                        },
                        "oAria": {
                            "sSortAscending": ": 以升序排列此列",
                            "sSortDescending": ": 以降序排列此列"
                        }
                    },
                    "aaSorting": [[1, "asc"]],//默认第几个排序
                });
                //checkboxes的全选和全不选
                jQuery('#sample_1 .group-checkable').change(function () {

                    var set = jQuery(this).attr("data-set");
                    var checked = jQuery(this).is(":checked");
                    jQuery(set).each(function () {
                        if (checked) {
                            $(this).attr("checked", true);
                        } else {
                            $(this).attr("checked", false);
                        }
                    });
                    jQuery.uniform.update(set);
                });
            }

        },

        error:function (data) {
            $.confirm({
                confirmButtonClass: 'btn btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton: '确认',
                cancelButton: '取消',
                animation: 'zoom',
                closeAnimation: 'rotateXR',
                title: '连接超时！',
                content: '连接超时请检查错误（此确认框会在3秒后消失）',
                autoClose: '确定|3000',
                buttons: {
                    确定: function () {
                        $(".black_overlay").hide();
                        $(".spinner").hide();
                        $("#v_tbody").html("");
                    }
                }
            });
        }

    });
});
//时间显示
$('.timepicker1').timepicker({
    showMeridian: false,
});
$(function () {
    $("[data-toggle='popover']").popover();
});
function showtime() {
    var mydate = new Date();
    var t = mydate.toLocaleString();
    var time = "服务器时间:" + t;
    $("#time_show").html(time);
    setTimeout(showtime, 1000)
}
showtime();
/*//选择方式
$("body").on("change", "#backup_way", function () {
    //0:HIVE 1:HBASE
    if ($("#backup_way").val() == "1") {
        $("#backup_2").hide();
        $("#tableName_hide").hide();
        $("#list-div-2").show()
    }
    if ($("#backup_way").val() == "0") {
        $("#backup_2").show();
        $("#tableName_hide").show();
        $("#list-div-2").hide()
    }
});*/
var tableName;
//checkbox改变时效果
$("#v_tbody").on("change",".checkboxes",function () {
    tableName = $(this).val();
    $("#vmidset-id").val(tableName);
});
var hznode;
$("#vmware-list-2").on("click",".vcip_li",function () {
    $("#vmware-list-2").find("li").removeClass("ccc");
    $(this).addClass("ccc");
    hznode = $(this).data("znode");
    $("#zhbasehide").val($(this).data("zookeeper"));
});
$("#vmware-list-2").find(".vcip_li").eq(0).click();

//取得UUID方法
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
/***********************************以下为提交方法相关JS***************************************************/
//最后的提交方法
$(".button-submit").click(function () {
    var description = $("#msg-g").text();
    var serviceId = generateUUID();
    var HBaseTable = $("#vmidset-f").text();
    var zookeeper = $("#vcid-f").text();
   /* var zookeeper_ = zookeeper.split(":")[0];
    var port = zookeeper.split(":")[1];
    var zookeeper__ = zookeeper_.split(",");
    var newarry=[];
    for(key in zookeeper__){
        newarry.push(zookeeper__[key]+":"+port);
    }
    var zoo = newarry.join(",");*/
    var todo  = "fromHbase";
    var topic = $("#topic").val();
    var json ={serviceId:serviceId,HBaseTable:HBaseTable,zookeeper:zookeeper,znode:znode,topic:topic,todo:todo,description:description};
     var json_ = JSON.stringify(json);
    //HBase
          $.ajax({
              url: "http://" + localhost + "/longGangKafka/toKafka",
              cache: true,
              data:{param:json_},
              type: "post",
              async: false,
              success: function (data) {
                  //这里的-1是BUG后期会进行修改
                      $.confirm({
                          confirmButtonClass: 'btn btn-info',
                          cancelButtonClass: 'btn-danger',
                          confirmButton: '确认',
                          cancelButton: '取消',
                          animation: 'zoom',
                          closeAnimation: 'rotateXR',
                          title: 'HBase导出成功！',
                          content: '即将跳转到数据流任务（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                  location.href = "all_task.html";
                              }
                          }
                      });
              }
          })
});
