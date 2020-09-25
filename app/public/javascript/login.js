var ip;
$(function() 
{
    'use strict';
    initConnection();
        
    var input = document.getElementById("txt_pass");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("btn_login").click();
    }
    });
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
            $("#btn_login").on('click', function(e)
            {
                var account=$("#txt_user").val();
                var password=$("#txt_pass").val();
                login(account,password);
            }); 
        })
    }   
    function login(account,pass)
    {
        $.post('/verify',
        {
            user: account,
            password: pass
        },
        function(data,status)
        {
           if(data.includes('/home'))
           {
             window.location.href='http://'+ip+data;
           }
           else
           {
                alert(data);
           }
           
        });
    }
})