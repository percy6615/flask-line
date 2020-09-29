var missionID;
var ip;
var mission;
$(function() 
{
    "use strict";
    missionID=window.location.href.split('mission_id=')[1];
    if(missionID===undefined){
        missionID=window.location.href.split('mission_id%3D')[1];
    }

//    missionID =  {{ mission_id }}

    // var geolocation = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDsB1VYlaE7oPT4iJEdF3-2n_JRwcNJQIA';
    // (function() {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('POST', geolocation);
    //     xhr.onload = function () {
    //         var response = JSON.parse(this.responseText);
    //         console.log(response);
    //         alert(JSON.stringify(response));
    //     }
    //     xhr.send();
    // })();
    initConnection();
    getMissionData();

    function initConnection()
    {
        $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) 
        {
            if(data.includes("118.163.40.55"))
            {
              ip="192.168.4.121";
            }
            else
            {
              ip="ncsist.wrapoc.tk";
            }
        })
    }   
    function getMissionData()
    {
        $.get( "/webhooks/querymission?mission_id="+missionID, function(data)
        {
            console.log(data);
            if(data!="查無此筆任務")
            {

                mission=data;
                $("#input_base").val(data.base_unit+'-'+data.report_no);
                $("#input_mission_location").val(data.mission_status+'-'+data.support_location);
                $("#input_num").val(mission.num);
                if(data.remarks==undefined || data.remarks=="")
                {
                    $("#input_remarks").val("無");
                }
                else
                {
                    $("#input_remarks").val(data.remarks);
                }
               var carCheckBoxList=document.getElementById("car_list");
               var checkBoxHtml='';
               for(var i=0; i<data.carlist.length;i++)
               {
                   checkBoxHtml+=' <input type="checkbox" id="vehicle'+i+'" name="checkbox" value="'+data.carlist[i]+'"><label for="vehicle'+i+'">'+data.carlist[i]+'</label><br>'
               }
               carCheckBoxList.innerHTML=checkBoxHtml;
            }
//            else
//            {
//                window.location.href="./login";
//            }
        });
    }
})