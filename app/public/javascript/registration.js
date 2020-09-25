var registerID;
var ip;
$(function() 
{
    "use strict";
    initConnection();
    registerID=window.location.href.split('sender=')[1];
    $("#signUp").on('click',function(e)
    {
        if(checkVaildate())
        {
            let password=document.getElementById('password').value;
            let passwordCheck=document.getElementById('passwordCheck').value;
            if(password!=passwordCheck)
            {
              alert('密碼與確認密碼不一致!');
            }
            else
            {
              let account=document.getElementById('account').value;
              let name=document.getElementById('name').value;
              let selector=document.getElementById('slct');
              let groupName=selector.options[selector.selectedIndex].text;
              $.post('/registering',
              {
                  name:name,
                  account: account,
                  password: password,
                  line_id: registerID,
                  groupName:groupName
              },
              function(data,status)
              { 
                alert(data);
                window.top.close();
              });
            }
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
        let selector=document.getElementById('slct');
        if(selector.selectedIndex==0)
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
})