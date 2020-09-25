var missionID;
var ip;
var mission;
$(function() 
{
    "use strict";
    missionID=window.location.href.split('mission_id=')[1];
    if(missionID===undefined){
        missionID=window.location.href.split('mission_id%3')[1];
    }
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
    $("#signUp").on('click',function(e)
    {
        if(checkVaildate())
        {
            var pump_car_list='';
            let checkbox=document.getElementsByName('checkbox');
            checkbox.forEach((element) => 
            {
                if(element.checked==true)
                {
                    if(pump_car_list!='')
                    {
                        pump_car_list+=','+element.value;
                    }
                    else
                    {
                        pump_car_list+=element.value;
                    }
                }
            })
            var selector=document.getElementById('status_select');
            let site_condition=selector.options[selector.selectedIndex].text;
            selector=document.getElementById('deep_select');
            let flood_deep=selector.options[selector.selectedIndex].text;

            var formData = new FormData();
            var file = document.getElementById("btn_upload").files[0];
            formData.append("Filedata", file);
            fetch('/webhooks/uploadimage?mission_id='+missionID, {
                method: 'POST',
                body: formData,
            });

            $.post('/webhooks/querymission',
            {
                mission_id:missionID,
                site_condition: site_condition,
                flood_deep: flood_deep,
                site_pic_url:"",
                pump_car_list:pump_car_list
            },
            function(data,status)
            { 
                if(data=='派遣任務回報成功!')
                {
                    alert(data);
                    window.location.href='./login';
                }
                else
                {
                    alert(data);
                }
            });
        }
        else
        {
            alert('請檢查是否填妥資訊!');
        }
    });
    function checkVaildate()
    {
      var result=true;
      let elements = document.getElementsByName('input');
        elements.forEach((element) => 
        {
          if(element.value=='')
          {
              result=false;
          }
        })
        let selector=document.getElementsByName('slct');
        selector.forEach((element) => 
        {
          if(element.selectedIndex==0)
          {
              result=false;
          }
        })
        let checkbox=document.getElementsByName('checkbox');
        var checkboxResult=false;
        var breakFlag=false;
        checkbox.forEach((element) => 
        {
          if(breakFlag==false)
          {
            if(element.checked==true)
            {
              checkboxResult=true;
              breakFlag=true;
            }
            else
            {
              checkboxResult=false;
            }
          }
        })
        if(checkboxResult==false)
        {
            result=false;
        }
        if(document.getElementById("btn_upload").files.length==0)
        {
            result=false;
        }
        return result;
    }
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