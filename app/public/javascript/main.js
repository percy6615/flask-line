//var ip="192.168.4.141";
var ip;
var socket;
var map;
var clientUser;
var token;

//圖標詳細視窗
var container;
var tab;
var content ;
var closer;
var overlay;
// cctv詳細視窗
var cctvContainer;
var cctvContent ;
var cctvCloser;
var cctvOverlay;
var cctvInterval;

var interval;

var circleLayer;//

var currZoom;
var featuresData=[];
var relativeTempLayer;//for relative click item use
var initStatus=true;//to divide update or init

var missionTable;
var missionList;
$(function () {
  'use strict';
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    if(data.includes("118.163.40.55"))
    {
      ip="192.168.4.121";
    }
    else
    {
      ip="ncsist.wrapoc.tk";
    }
    socket = io.connect("http://"+ip+":8085");
    token = window.location.href.split('token=')[1];
    socket.emit('user',token)

    window.onbeforeunload = WindowCloseHanlder;

    createSocketListeners();
    createButtonClickListeners();
    initMap();
    //getKmlData();
})
 // Toggle the side navigation
 $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
  $("body").toggleClass("sidebar-toggled");
  $(".sidebar").toggleClass("toggled");
  if ($(".sidebar").hasClass("toggled")) {
    $('.sidebar .collapse').collapse('hide');
  };
});
function WindowCloseHanlder()
{
 // socket.emit("logout",token);
}
function getKmlData()
{
  var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'http://'+ip+'/floodingSensorKML',
      format: new ol.format.KML()
    })
  });
  map.addLayer(vector);
}
  function createSocketListeners()
  {
      socket.on('user', function(data)
      {
        $("#user_name").text(data.name+"長官，您好");
        clientUser=data;
      });
      socket.on('logout',function(data)
      {
        if(data)
        {
          window.location.href="/login";
        }
      });
      socket.on('allMission',function(data)
      {
        if(data!='查無任務')
        {
          for(var i=0;i<data.length;i++)
          {
            data[i].no=i+1;
            data[i].read_status=data[i].read_status==1?'v':'';
          }
          missionList=data;
          for(var i=0;i<missionList.length;i++)
          {
            missionTable.row.add(missionList[i]).draw();
          }
        }
        
      });
      socket.on('WaterRealTime', function(data)
      {
        for(var i=0;i<4;i++)
        {
          var layer=findLayerByID("WaterRealTime-"+i);
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
        }
        var layer=findLayerByID("WaterRealTime-noValue");
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresLevel_0 = [];
        var featuresLevel_1 = [];
        var featuresLevel_2 = [];
        var featuresLevel_3 = [];
        var featuresLevel_noValue = [];//暫時，因大部分資料有誤須有此圖層
       for(var value in data)
       {
          data[value]=checkWaterLevel(data[value]);
          var station=data[value];
          var longitude = station.lon;
          var latitude = station.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(station.stationNo);
          var iconStyle;
          switch(station.alarmLevel)
          {
            case '未達警戒':
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/water_level/water_level_0.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  // get the text from the feature - `this` is ol.Feature
                  // and show only under certain resolution
                  text:'',
                  offsetY : 12
              })
            });
            iconFeature.setStyle(iconStyle);
            featuresLevel_0.push(iconFeature);
            break;
            case '一級警戒':
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/water_level/water_level_1.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  // get the text from the feature - `this` is ol.Feature
                  // and show only under certain resolution
                  text:'',
                  offsetY : 12
              })
            });
            iconFeature.setStyle(iconStyle);
            featuresLevel_1.push(iconFeature);
            break;
            case '二級警戒':
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/water_level/water_level_2.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  // get the text from the feature - `this` is ol.Feature
                  // and show only under certain resolution
                  text:'',
                  offsetY : 12
              })
            });
            iconFeature.setStyle(iconStyle);
            featuresLevel_2.push(iconFeature);
            break;
            case '三級警戒':
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/water_level/water_level_3.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  // get the text from the feature - `this` is ol.Feature
                  // and show only under certain resolution
                  text:'',
                  offsetY : 12
              })
            });
            iconFeature.setStyle(iconStyle);
            featuresLevel_3.push(iconFeature);
            break;
            default :
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/no_value.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  // get the text from the feature - `this` is ol.Feature
                  // and show only under certain resolution
                  text:'',
                  offsetY : 12
                })
              });
              iconFeature.setStyle(iconStyle);
              featuresLevel_noValue.push(iconFeature);
            break;
          }
        };
        //未達警戒圖層
        var vectorSource0 = new ol.source.Vector({features: featuresLevel_0});
        var vectorLayer0 = new ol.layer.Vector({source: vectorSource0});
        //一級警戒圖層
        var vectorSource1 = new ol.source.Vector({features: featuresLevel_1});
        var vectorLayer1 = new ol.layer.Vector({source: vectorSource1});
       //二級警戒圖層
        var vectorSource2 = new ol.source.Vector({ features: featuresLevel_2});
        var vectorLayer2 = new ol.layer.Vector({source: vectorSource2});
       //三級警戒圖層
        var vectorSource3 = new ol.source.Vector({features: featuresLevel_3});
        var vectorLayer3 = new ol.layer.Vector({source: vectorSource3});
       //無法判斷警戒圖層
        var vectorSource_noValue = new ol.source.Vector({features: featuresLevel_noValue});
        var vectorLayer_noValue = new ol.layer.Vector({source: vectorSource_noValue});

        vectorLayer0.set("id","WaterRealTime-0",false);
        vectorLayer1.set("id","WaterRealTime-1",false);
        vectorLayer2.set("id","WaterRealTime-2",false);
        vectorLayer3.set("id","WaterRealTime-3",false);
        vectorLayer_noValue.set("id","WaterRealTime-noValue",false);

        vectorLayer0.setVisible(false);
        vectorLayer1.setVisible(false);
        vectorLayer2.setVisible(false);
        vectorLayer3.setVisible(false);
        vectorLayer_noValue.setVisible(false);

        map.addLayer(vectorLayer0);
        map.addLayer(vectorLayer1);
        map.addLayer(vectorLayer2);
        map.addLayer(vectorLayer3);
        map.addLayer(vectorLayer_noValue);

        featuresData["WaterRealTime"]=data;

         //defalut click alarm level's layer
        if(initStatus)
        {
          $( "#level_1" ).trigger( "click" );
          $( "#level_2" ).trigger( "click" );
          $( "#level_3" ).trigger( "click" );
        }


        document.getElementById('water_level3_total').innerHTML=featuresLevel_3.length+" 件";
        document.getElementById('water_level2_total').innerHTML=featuresLevel_2.length+" 件";
        document.getElementById('water_level1_total').innerHTML=featuresLevel_1.length+" 件";

        checkLayersOpenStatus("WaterRealTime");
      });   

      socket.on('waterLevel24hr',function(data)
      {
        createWaterLevelChart(data);
      });
      socket.on('FloodingSensor24hr',function(data)
      {
        createFloodingSensorChart(data);
      });
      socket.on('cctvID',function(data)
      {
        var cctvIndicators=document.getElementById('cctvIndicators');
        var cctvCarouselInner=document.getElementById('cctvCarouselInner');
        var indicatorsHTMLString;
        var carouseInnerHTMLString;
        var cameraCounts=data.cameras.length;
        //start to build html content
        cctvIndicators.innerHTML='';
        cctvCarouselInner.innerHTML='';
        for(var i=0;i<cameraCounts;i++)
        {
          if(data.cameras[i].video==undefined)
          {
            if(i==0)
            {
              indicatorsHTMLString='<li data-target="#cctvCarousel" data-slide-to="'+i+'" class="active"></li>'
              carouseInnerHTMLString=' <div class="carousel-item active">'
              +'<canvas id="camera'+i+'" name="images">'
              +'</div>'
            }
            else
            {
              indicatorsHTMLString='<li data-target="#cctvCarousel" data-slide-to="'+i+'" class=""></li>'
              carouseInnerHTMLString=' <div class="carousel-item">'
                +'<canvas id="camera'+i+'" name="images">'
                +'</div>'
            }
          }
          else
          {
            if(i==0)
            {
              indicatorsHTMLString='<li data-target="#cctvCarousel" data-slide-to="'+i+'" class="active"></li>'
              carouseInnerHTMLString=' <div class="carousel-item active">'
              +'<iframe id="camera'+i+'" name="video" width="560" height="315"'
              +'src=""'
             +'frameborder="0" allow="autoplay; encrypted-media">'
              +'</iframe>'
              +'</div>'
            }
            else
            {
              indicatorsHTMLString='<li data-target="#cctvCarousel" data-slide-to="'+i+'" class=""></li>'
              carouseInnerHTMLString=' <div class="carousel-item">'
              +'<iframe id="camera'+i+'" name="video" width="560" height="315"'
              +'src=""'
             +'frameborder="0" allow="autoplay; encrypted-media">'
              +'</iframe>'
              +'</div>'
            }
          }
            cctvIndicators.innerHTML+=indicatorsHTMLString;
            cctvCarouselInner.innerHTML+=carouseInnerHTMLString;
        }
        $("#cctvCarousel").unbind();//remove old listener
        $('#cctvCarousel').on('slid.bs.carousel', function () 
        {
          clearInterval(cctvInterval);
          var i=$(this).find('.active').index();
          if(document.getElementById("camera"+i).name=="video")
          {
            var iframe=document.getElementById("camera"+i);
            iframe.src='https://www.youtube.com/embed/'+data.cameras[i].video+'?frameborder="0"&allow="accelerometer"&autoplay=1';
          }
          else
          {
            var canvas = document.getElementById("camera"+i);
            var ctx = canvas.getContext("2d");
            canvas.style.width="480px";
            canvas.style.height="240px";
            var index=0;
            // console.log(data.cameras.length);
            var srcCount=data.cameras[i].images.length;
            var images=data.cameras[i].images;
            cctvInterval=window.setInterval(function()
            {
              var image = new Image();
              image.src = images[index];
              image.onload = function() 
              {
                ctx.drawImage(image, 0,0,300,200);
                if(index!=srcCount-1)
                {
                  index++;
                }
                else
                {
                  index=0;
                }
              };
            },1000);
          }
         
        })
        if(document.getElementById("camera0").name=="video")
        {
          var iframe=document.getElementById("camera0");
          iframe.src='https://www.youtube.com/embed/'+data.cameras[0].video+'?frameborder="0"&allow="accelerometer"&autoplay=1';
        }
        else
        {
          var canvas = document.getElementById("camera0");
          var ctx = canvas.getContext("2d");
          canvas.style.width="480px";
          canvas.style.height="240px";
          var index=0;
          var srcCount=data.cameras[0].images.length;
          var images=data.cameras[0].images;
          cctvInterval=window.setInterval(function()
          {
            var image = new Image();
            image.src = images[index];
            image.onload = function() 
            {
              ctx.drawImage(image, 0,0,300,200);
              if(index!=srcCount-1)
              {
                index++;
              }
              else
              {
                index=0;
              }
            };
          },1000);
        }
        var dataContent=document.getElementById("cctvData");
        if(data.basinName==''|| data.basinName==undefined)
        {
          data.basinName='無';
        }
        dataContent.innerHTML='<code>'
        +'站點編號:'+data.id +'</code><br><code>'
        +'站點名稱:'+data.name+'</code><br><code>'
        +'所屬流域:'+data.basinName+'</code><br><code>'
        +'地點:'+data.townname+'</code><br><code>';

        //end of building html content    
      });

      socket.on('RainFallRealTime', function(data)
      {
        for(var i=0;i<3;i++)
        {
          var layer=findLayerByID("RainFallRealTime-"+i);
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
        }
        var layer=findLayerByID("RainFallRealTime-noValue");
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        
        var featuresLevel_0= [];
        var featuresLevel_1 = [];
        var featuresLevel_2 = [];
        var featuresLevel_noValue = [];
       for(var value in data)
       {
          var station=data[value];
          var longitude = station.lon;
          var latitude = station.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(station.stationNo);
          data[value].levelH1=checkRainFallLevel(station.h1,station.alertLevel1_H1,station.alertLevel2_H1);
          data[value].levelH3=checkRainFallLevel(station.h3,station.alertLevel1_H3,station.alertLevel2_H3);
          data[value].levelH6=checkRainFallLevel(station.h6,station.alertLevel1_H6,station.alertLevel2_H6);
          station=data[value];
          var iconStyle;
          if(station.levelH1=="一級警戒" || station.levelH3=="一級警戒" || station.levelH6=="一級警戒")
          {
            iconStyle = new ol.style.Style({
              image: new ol.style.Icon(({
                  anchor: [0.5, 1],
                  src: "/icons/markers/rainfall/rainfall_level_1.png",
                  opacity : 0
              })),
              text: new ol.style.Text({
                font: '14px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 4
                }),
                text:'',
                offsetY : 12
            })
            });
            iconFeature.setStyle(iconStyle);
            featuresLevel_1.push(iconFeature);
          }
          else
          {
            if(station.levelH1=="二級警戒" || station.levelH3=="二級警戒" || station.levelH6=="二級警戒")
            {
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/rainfall/rainfall_level_2.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  text:'',
                  offsetY : 12
              })
              });
              iconFeature.setStyle(iconStyle);
              featuresLevel_2.push(iconFeature);
            }
            else
            {
              if(station.levelH1=="未達警戒" || station.levelH3=="未達警戒" || station.levelH6=="未達警戒")
              {
                iconStyle = new ol.style.Style({
                  image: new ol.style.Icon(({
                      anchor: [0.5, 1],
                      src: "/icons/markers/rainfall/rainfall_level_0.png",
                      opacity : 0
                  })),
                  text: new ol.style.Text({
                    font: '14px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: '#000' }),
                    stroke: new ol.style.Stroke({
                        color: '#fff', width: 4
                    }),
                    text:'',
                    offsetY : 12
                })
                });
                iconFeature.setStyle(iconStyle);
                featuresLevel_0.push(iconFeature);
              }
              else
              {
                iconStyle = new ol.style.Style({
                  image: new ol.style.Icon(({
                      anchor: [0.5, 1],
                      src: "/icons/markers/no_value.png",
                      opacity : 0
                  })),
                  text: new ol.style.Text({
                    font: '14px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: '#000' }),
                    stroke: new ol.style.Stroke({
                        color: '#fff', width: 4
                    }),
                    text:'',
                    offsetY : 12
                })
                });
                iconFeature.setStyle(iconStyle);
                featuresLevel_noValue.push(iconFeature);
              }
             
            }
          } 

        }
         //未達警戒圖層
         var vectorSource0 = new ol.source.Vector({features: featuresLevel_0});
         var vectorLayer0 = new ol.layer.Vector({source: vectorSource0});
         //一級警戒圖層
         var vectorSource1 = new ol.source.Vector({features: featuresLevel_1});
         var vectorLayer1 = new ol.layer.Vector({source: vectorSource1});
        //二級警戒圖層
         var vectorSource2 = new ol.source.Vector({ features: featuresLevel_2});
         var vectorLayer2 = new ol.layer.Vector({source: vectorSource2});
        //無法判斷警戒圖層
         var vectorSource_noValue = new ol.source.Vector({features: featuresLevel_noValue});
         var vectorLayer_noValue = new ol.layer.Vector({source: vectorSource_noValue});
 
         vectorLayer0.set("id","RainFallRealTime-0",false);
         vectorLayer1.set("id","RainFallRealTime-1",false);
         vectorLayer2.set("id","RainFallRealTime-2",false);
         vectorLayer_noValue.set("id","RainFallRealTime-noValue",false);
 
         vectorLayer0.setVisible(false);
         vectorLayer1.setVisible(false);
         vectorLayer2.setVisible(false);
         vectorLayer_noValue.setVisible(false);
 
         map.addLayer(vectorLayer0);
         map.addLayer(vectorLayer1);
         map.addLayer(vectorLayer2);
         map.addLayer(vectorLayer_noValue);
         featuresData["RainFallRealTime"]=data;
          //defalut click alarm level's layer
          if(initStatus)
          {
            $( "#rainlevel_1" ).trigger( "click" );
            $( "#rainlevel_2" ).trigger( "click" );
          }
       

        document.getElementById('rainfall_level2_total').innerHTML=featuresLevel_2.length+" 件";
        document.getElementById('rainfall_level1_total').innerHTML=featuresLevel_1.length+" 件";

        checkLayersOpenStatus("RainFallRealTime");
      });   
      socket.on('FloodingDisaster',function(data) //TODO 淹水感測器災情跟淹水災情所判斷的淹水感測來源災情重複的問題  MAYBE 直接以FLOODING API為主?
      {
        var layer=findLayerByID("FloodingDisaster");
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresFlooding= [];
        var reportTotal=0;
        var sensorTotal=0;
        var reportNotRecededCount=0;
        var sensorNotRecededCount=0;
        for(var value in data)
        {
          var floodingDisaster=data[value];
          for(var i=0;i<floodingDisaster.disasterFloodings.length;i++)
          {
            var temp=floodingDisaster.disasterFloodings[i];
            var longitude = temp.lon;
            var latitude = temp.lat;
            var iconFeature = new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
            });
            iconFeature.setId(temp.disasterFloodingID);
            switch(temp.sourceCode)
            {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 9:
              if(temp.isReceded)
              {
                var iconStyle = new ol.style.Style({
                  image: new ol.style.Icon(({
                      anchor: [0.5, 1],
                      src: "/icons/markers/flood_sensor/report_receded.png",
                      opacity : 0
                  })),
                  text: new ol.style.Text({
                    font: '14px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: '#000' }),
                    stroke: new ol.style.Stroke({
                        color: '#fff', width: 4
                    }),
                    text:'',
                    offsetY : 12
                })
                });
                iconFeature.setStyle(iconStyle);
                featuresFlooding.push(iconFeature); 
              }
              else //if(!temp.isReceded || temp.isReceded==undefined)
              {
                var iconStyle = new ol.style.Style({
                  image: new ol.style.Icon(({
                      anchor: [0.5, 1],
                      src: "/icons/markers/flood_sensor/report_notReceded.png",
                      opacity : 0
                  })),
                  text: new ol.style.Text({
                    font: '14px Calibri,sans-serif',
                    fill: new ol.style.Fill({ color: '#000' }),
                    stroke: new ol.style.Stroke({
                        color: '#fff', width: 4
                    }),
                    text:'',
                    offsetY : 12
                })
                });
                iconFeature.setStyle(iconStyle);
                featuresFlooding.push(iconFeature); 
                reportNotRecededCount++;
              }
              reportTotal++;
              break;
              case 7:
              case 8:
                if(temp.isReceded)
                {
                  var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 1],
                        src: "/icons/markers/flood_sensor/sensor_receded.png",
                        opacity : 0
                    })),
                    text: new ol.style.Text({
                      font: '14px Calibri,sans-serif',
                      fill: new ol.style.Fill({ color: '#000' }),
                      stroke: new ol.style.Stroke({
                          color: '#fff', width: 4
                      }),
                      text:'',
                      offsetY : 12
                  })
                  });
                  iconFeature.setStyle(iconStyle);
                  featuresFlooding.push(iconFeature); 
                }
                else //if(!temp.isReceded || temp.isReceded==undefined)
                {
                  var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 1],
                        src: "/icons/markers/flood_sensor/sensor_notReceded.png",
                        opacity : 0
                    })),
                    text: new ol.style.Text({
                      font: '14px Calibri,sans-serif',
                      fill: new ol.style.Fill({ color: '#000' }),
                      stroke: new ol.style.Stroke({
                          color: '#fff', width: 4
                      }),
                      text:'',
                      offsetY : 12
                  })
                  });
                  iconFeature.setStyle(iconStyle);
                  featuresFlooding.push(iconFeature); 
                  sensorNotRecededCount++;
                }
                sensorTotal++;
              break;
            }
          }
        }
         var vectorSource = new ol.source.Vector({features: featuresFlooding});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","FloodingDisaster",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData["FloodingDisaster"]=data;
          //defalut click alarm level's layer
          if(initStatus)
          {
            $("#flooding_disaster" ).trigger( "click" );
          }
          document.getElementById('flooding_total').innerHTML=reportNotRecededCount+"/"+reportTotal+" 件";
          document.getElementById('sensor_total').innerHTML=sensorNotRecededCount+"/"+sensorTotal+" 件";
          checkLayersOpenStatus("FloodingDisaster");
      });   

      socket.on('cctv',function(data)
      {
        var layer=findLayerByID('cctv');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresCCTV= [];
        for(var value in data)
        {
          var cctvStation=data[value];
          var longitude = cctvStation.lon;
          var latitude = cctvStation.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(cctvStation.id);
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/markers/cctv_marker.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresCCTV.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresCCTV});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id",'cctv',false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['cctv']=data;

         checkLayersOpenStatus("cctv");
      });   
      socket.on('road_cctv2',function(data)
      {   
        var layer=findLayerByID('cctv2');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresRoadCCTV= [];
        for(var value in data)
        {
          var cctvStation=data[value];
          var longitude = cctvStation.lon;
          var latitude = cctvStation.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(cctvStation.id);
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/markers/cctv2.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresRoadCCTV.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresRoadCCTV});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","cctv2",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['cctv2']=data;

         checkLayersOpenStatus("cctv2");
      })
      socket.on('volunteer',function(data)
      {
        var layer=findLayerByID('volunteer');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresVolunteer= [];
        for(var value in data)
        {
          var volunteer=data[value];
          var longitude = volunteer.lon;
          var latitude = volunteer.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(volunteer.id);
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/markers/volunteer.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresVolunteer.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresVolunteer});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","volunteer",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['volunteer']=data;

         checkLayersOpenStatus("volunteer");
      });   
      socket.on('allSocialWelfareAgency',function(data)
      {
        var layer=findLayerByID('allSocialWelfareAgency');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresVolunteer= [];
        for(var value in data)
        {
          var angency=data[value];
          var longitude = angency.lon;
          var latitude = angency.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(angency.id);
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/markers/social.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresVolunteer.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresVolunteer});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","allSocialWelfareAgency",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['allSocialWelfareAgency']=data;

         checkLayersOpenStatus("allSocialWelfareAgency");
      });
      socket.on('community',function(data)
      {
        var layer=findLayerByID('community');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresCommunity= [];
        for(var value in data)
        {
          var community=data[value];
          var longitude = community.lon;
          var latitude = community.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(community.id);
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/markers/community_marker.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresCommunity.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresCommunity});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","community",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['community']=data;

         checkLayersOpenStatus("community");
      });
      socket.on('floodingSensor',function(data)
      {
        var layer=findLayerByID('floodingSensor');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        layer=findLayerByID('floodingSensorAlert');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresFloodingSensor= [];
        var featuresFloodingAlert=[];
        var total=0;
        var notRecededCount=0;
        for(var value in data)
        {
          var floodingSensor=data[value];
          var longitude = floodingSensor.lon;
          var latitude = floodingSensor.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(floodingSensor.id);
          var iconStyle;
          if(floodingSensor.depth>10)
          {
            // if(floodingSensor.toBeConfirm)//檢核不通過=非災情
            // {
              iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    src: "/icons/markers/flood_sensor/Flood_r_7.png",
                    opacity : 0
                })),
                text: new ol.style.Text({
                  font: '14px Calibri,sans-serif',
                  fill: new ol.style.Fill({ color: '#000' }),
                  stroke: new ol.style.Stroke({
                      color: '#fff', width: 4
                  }),
                  text:'',
                  offsetY : 12
              })
              });
             //}
            // else//檢核通過=災情
            // {
              // iconStyle = new ol.style.Style({
              //   image: new ol.style.Icon(({
              //       anchor: [0.5, 1],
              //       src: "/icons/markers/flood_sensor/sensor_notReceded.png",
              //       opacity : 0
              //   })),
              //   text: new ol.style.Text({
              //     font: '14px Calibri,sans-serif',
              //     fill: new ol.style.Fill({ color: '#000' }),
              //     stroke: new ol.style.Stroke({
              //         color: '#fff', width: 4
              //     }),
              //     text:'',
              //     offsetY : 12
              // })
              // });
              // notRecededCount++;
          //  }
            iconFeature.setStyle(iconStyle);
            featuresFloodingAlert.push(iconFeature); 
            // total++;
          }
          else
          {
            iconStyle = new ol.style.Style({
              image: new ol.style.Icon(({
                  anchor: [0.5, 1],
                  src: "/icons/markers/flood_sensor/Flood_b_7.png",
                  opacity : 0
              })),
              text: new ol.style.Text({
                font: '14px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 4
                }),
                text:'',
                offsetY : 12
            })
            });
            iconFeature.setStyle(iconStyle);
            featuresFloodingSensor.push(iconFeature); 
          }
        }
         var vectorSource = new ol.source.Vector({features: featuresFloodingSensor});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         var vectorSource2 = new ol.source.Vector({features: featuresFloodingAlert});
         var vectorLayer2 = new ol.layer.Vector({source: vectorSource2});

         vectorLayer.set("id","floodingSensor",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         vectorLayer2.set("id","floodingSensorAlert",false);
         vectorLayer2.setVisible(false);
         map.addLayer(vectorLayer2);

         featuresData['floodingSensor']=data;
        //  if(initStatus)
        //  {
        //   $( "#floodingSensorAlert" ).trigger( "click" );
        //  }
         checkLayersOpenStatus("floodingSensor");
         checkLayersOpenStatus("floodingSensorAlert");

        // document.getElementById('sensor_total').innerHTML=notRecededCount+"/"+total+" 件";
      });
      socket.on('waterPumpCar',function(data)
      {
        var layer=findLayerByID('waterPumpCar');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresWaterPumpCar= [];
        for(var value in data)
        {
          var car=data[value];
          var longitude = car.lon;
          var latitude = car.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(car.id);
          var iconStyle;
          iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/water-pump.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresWaterPumpCar.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresWaterPumpCar});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","waterPumpCar",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['waterPumpCar']=data;
         checkLayersOpenStatus("waterPumpCar");

      });
      socket.on('waterPumpStation1',function(data)
      {
        var layer=findLayerByID('waterPumpStation1');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresWaterPumpStation1= [];
        for(var value in data)
        {
          var station=data[value];
          var longitude = station.lon;
          var latitude = station.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(station.id);
          var iconStyle;
          iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/water_pump_station.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresWaterPumpStation1.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresWaterPumpStation1});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","waterPumpStation1",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['waterPumpStation1']=data;

         checkLayersOpenStatus("waterPumpStation1");
      });
      socket.on('waterPumpStation2',function(data)
      {
        var layer=findLayerByID('waterPumpStation2');
        if(layer!=undefined)
        {
          map.removeLayer(layer);
        }
        var featuresWaterPumpStation2= [];
        for(var value in data)
        {
          var station=data[value];
          var longitude = station.lon;
          var latitude = station.lat;
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'))
          });
          iconFeature.setId(station.id);
          var iconStyle;
          iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "/icons/water_pump_station.png",
                opacity : 0
            })),
            text: new ol.style.Text({
              font: '14px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 4
              }),
              text:'',
              offsetY : 12
          })
          });
          iconFeature.setStyle(iconStyle);
          featuresWaterPumpStation2.push(iconFeature); 
        }
         var vectorSource = new ol.source.Vector({features: featuresWaterPumpStation2});
         var vectorLayer = new ol.layer.Vector({source: vectorSource});

         vectorLayer.set("id","waterPumpStation2",false);
         vectorLayer.setVisible(false);
         map.addLayer(vectorLayer);

         featuresData['waterPumpStation2']=data;
         checkLayersOpenStatus("waterPumpStation2");
      });
  }
function centerMap(lat, long) 
{
  // map.getView().animate({  
  //   center: ol.coordinate.add(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'),[0,(1/map.getView().getZoom())*5000]),//TODO 應該是越大移動越小數值
  //   duration: 1000
  // });
  map.getView().animate({  
    center: ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'),
    duration: 1000
  });
}
function zoomMap(value)
{
  map.getView().animate({
    zoom: value,
    duration: 500
  })
}
function checkRainFallLevel(value,target_1,target_2)
{
  if(target_2==null)
  {
    if(target_1==null)
    {
      return "無法判斷";
    }
    else
    {
      if(value>=target_1)
      {
        return "一級警戒"
      }
      else
      {
        return "無法判斷(有1級無2級，且<1級)"
      }
    } 
  }
  else
  {
    if(value>=target_2)
    {
        if(value>=target_1)
        {
          return"一級警戒"
        }
        else
        {
          return"二級警戒";
        }
    }
    else
    {
      return "未達警戒";
    }
  }
}
function checkWaterLevel(station)
{
    var level_1=station.warningLevel1;//一級警戒值(公尺) 
    var level_2=station.warningLevel2;//二級警戒值(公尺)
    var level_3=station.warningLevel3;//三級警戒值(公尺)
    var realTimeValue=station.waterLevel;//目前水位高(公尺)
    //無即時資料，不可判斷
    if(station.waterLevel==null)
    {
      station.waterLevel='無資料';
      station.alarmLevel='無法判斷(無即時資料)';
      return station;
    }
    //完全無閥值資料，直接變綠色
    else if(level_3==undefined && level_2==undefined && level_1==undefined)
    {
      // alert(station.stationName);
      station.alarmLevel='未達警戒';
      return station;
    }
    else
    {
        //僅有一、二級
      if(level_3==undefined && level_2!=undefined && level_1!=undefined)
      {
        // alert(station.stationName);
        if(realTimeValue<level_2)
        {
          station.alarmLevel='未達警戒';
        }
        else if(realTimeValue>=level_2 && realTimeValue<level_1)
        {
          station.alarmLevel='二級警戒';
        }
        else if(realTimeValue>=level_1)
        {
          station.alarmLevel='一級警戒';
        }
      }
      //僅有一級
      else if(level_3==undefined && level_2==undefined && level_1!=undefined)
      {
        if(realTimeValue<level_1)
        {
          station.alarmLevel='未達警戒';
        }
        else
        {
          station.alarmLevel='一級警戒';
        }
      }
      else
      {
        if(realTimeValue<level_3)
        {
          station.alarmLevel='未達警戒';
        }
        else if(realTimeValue>=level_3 && realTimeValue<level_2)
        {
          station.alarmLevel='二級警戒';
        }
        else if(realTimeValue>=level_2 && realTimeValue<level_1)
        {
          station.alarmLevel='二級警戒';
        }
        else
        {
          station.alarmLevel='一級警戒';
        }
      }
      return station;
    }
}
function updateAllData()
{
  refreshMissionTable();
  initStatus=false;
  queryLayer("FloodingDisaster");
  queryLayer("WaterRealTime");
  queryLayer("RainFallRealTime");
  queryLayer("cctv");
  queryLayer("road_cctv2");
  queryLayer("volunteer");
  queryLayer("allSocialWelfareAgency");
  queryLayer("community");
  queryLayer("floodingSensor");
  queryLayer("waterPumpCar");
  queryLayer("waterPumpStation1");
  queryLayer("waterPumpStation2");
  var today = new Date();
  var hours=today.getHours()<10?'0'+today.getHours():today.getHours();
  var min=today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes();
  var sec=today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds(); 
  document.getElementById('update_time').innerHTML=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+" "+hours + ":" + min + ":" +sec ;
}
function checkLayersOpenStatus(type)
{
  switch(type)
  {
    case "WaterRealTime":
      if($("#lv0").css('display') != 'none')
      {
        findLayerByID('WaterRealTime-0').setVisible(true);
      }
      if($("#lv1").css('display') != 'none')
      {
        findLayerByID('WaterRealTime-1').setVisible(true);
      }
      if($("#lv2").css('display') != 'none')
      {
        findLayerByID('WaterRealTime-2').setVisible(true);
      }
      if($("#lv3").css('display') != 'none')
      {
        findLayerByID('WaterRealTime-3').setVisible(true);
      }
      if($("#lvno").css('display') != 'none')
      {
        findLayerByID('WaterRealTime-noValue').setVisible(true);
      }
    break;
    case "RainFallRealTime":
      if($("#rainlv0").css('display') != 'none')
      {
        findLayerByID('RainFallRealTime-0').setVisible(true);
      }
      if($("#rainlv1").css('display') != 'none')
      {
        findLayerByID('RainFallRealTime-1').setVisible(true);
      }
      if($("#rainlv2").css('display') != 'none')
      {
        findLayerByID('RainFallRealTime-2').setVisible(true);
      }
      if($("#rainlvno").css('display') != 'none')
      {
        findLayerByID('RainFallRealTime-noValue').setVisible(true);
      }
    break;
    case "FloodingDisaster":
      if($("#flooding").css('display') != 'none')
      {
        findLayerByID('FloodingDisaster').setVisible(true);
      }
    break;
    case "cctv":
      if($("#cctv").css('display') != 'none')
      {
        findLayerByID('cctv').setVisible(true);
      }
    break;
    case "cctv2":
      if($("#cctv2").css('display') != 'none')
      {
        findLayerByID('cctv2').setVisible(true);
      }
    break;
    case "volunteer":
      if($("#volunteer").css('display') != 'none')
      {
        findLayerByID('volunteer').setVisible(true);
      }
    break;
    case "allSocialWelfareAgency":
      if($("#social").css('display') != 'none')
      {
        findLayerByID('allSocialWelfareAgency').setVisible(true);
      }
    break;
    case "community":
      if($("#community").css('display') != 'none')
      {
        findLayerByID('community').setVisible(true);
      }
    break;
    case "floodingSensor":
      if($("#sensor").css('display') != 'none')
      {
        findLayerByID('floodingSensor').setVisible(true);
      }
    break;
    case "floodingSensorAlert":
      if($("#sensorAlert").css('display') != 'none')
      {
        findLayerByID('floodingSensorAlert').setVisible(true);
      }
    break;
    case "waterPumpCar":
      if($("#pump").css('display') != 'none')
      {
        findLayerByID('waterPumpCar').setVisible(true);
      }
    break;
    case "waterPumpStation1":
      if($("#pumpStation1").css('display') != 'none')
      {
        findLayerByID('waterPumpStation1').setVisible(true);
      }
    break;
    case "waterPumpStation2":
      if($("#pumpStation2").css('display') != 'none')
      {
        findLayerByID('waterPumpStation2').setVisible(true);
      }
    break;
  }
  
 
}
function initMap()
{
    container = document.getElementById('popup');
    cctvContainer = document.getElementById('popup_cctv');
    tab=document.getElementById('tab');
    content = document.getElementById('popup-content');
    cctvContent = document.getElementById('popup-content2');
    closer = document.getElementById('popup-closer');
    cctvCloser=document.getElementById('popup-closer2')

    //Create an overlay to anchor the popup to the map.
    overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    cctvOverlay = new ol.Overlay({
      element: cctvContainer,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    cctvCloser.onclick = function() {
      cctvOverlay.setPosition(undefined);
      cctvCloser.blur();
      return false;
    };
    // var layer=new ol.layer.Tile
    // ({
    //   source: new ol.source.TileWMS({
    //     url: "http://"+ip+"/wra/geoserver/geotaiwan/wms?service=WMS&version=1.1.1&request=DescribeLayer&layers=geotaiwan:EMAP6_OPENDATA",
    //     params: {'LAYERS': "taiwan", 'TILED': true},
    //     serverType: 'geoserver',
    //     transition: 0
    //   })
    // });
    // layer.set("id","taiwan",false);
   map = new ol.Map({
    target: 'map',
    renderer: 'webgl',
    overlays: [overlay,cctvOverlay],
    layers: 
    [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
    ],
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    view: new ol.View({
      center: ol.proj.fromLonLat([121, 23.4696923]),
      zoom: 8
    })
  });
  queryLayer("FloodingDisaster");
  queryLayer("WaterRealTime");
  queryLayer("RainFallRealTime");
  queryLayer("cctv");
  queryLayer("road_cctv2");
  queryLayer("volunteer");
  queryLayer("allSocialWelfareAgency");
  queryLayer("community");
  queryLayer("floodingSensor");
  queryLayer("waterPumpCar");
  queryLayer("waterPumpStation1");
  queryLayer("waterPumpStation2");
  var today = new Date();
  var hours=today.getHours()<10?'0'+today.getHours():today.getHours();
  var min=today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes();
  var sec=today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
  document.getElementById('update_time').innerHTML=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+" "+hours + ":" + min + ":" +sec ;

  setInterval(updateAllData, 60000);//60000=1min
  currZoom = map.getView().getZoom();
  map.on("singleclick", function (evt)
  {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) 
    {
      if(layer.get("id").includes("WaterRealTime"))
      {
        var station=findWaterStationByNo(feature.getId())
        centerMap(station.lat,station.lon);
        var coordinate = evt.coordinate;
        station.time=station.time==null?'無資料':station.time; 

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">水位站</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(station,"WaterRealTime",station.stationNo);
        if(station.waterLevel=='無資料')
        {
          dataContent.innerHTML='<code>'
          +'站點編號:'+station.stationNo +'</code><br><code>'
          +'站點名稱:'+station.stationName+'</code><br><code>'
          +'地址:'+station.address+'</code><br><code>'
          +'水位高:'+station.waterLevel+'</code><br><code>'
          +'警戒等級:'+station.alarmLevel+'</code><br><code>'
          +'資料更新時間:'+station.time+'</code><br>';
        }
        else
        {
          dataContent.innerHTML='<code>'
          +'站點編號:'+station.stationNo +'</code><br><code>'
          +'站點名稱:'+station.stationName+'</code><br><code>'
          +'地址:'+station.address+'</code><br><code>'
          +'水位高:'+station.waterLevel+' m</code><br><code>'
          +'警戒等級:'+station.alarmLevel+'</code><br><code>'
          +'資料更新時間:'+station.time+'</code><br>';
        }
        chartContent.innerHTML='<canvas id="chartData"></canvas>';

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        socket.emit('waterLevel24hr',station.stationNo);
        tab.innerHTML =
          '<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">水位資料</a></li>'
          +'<li><a class="nav-link" href="#chart" data-toggle="tab">水位歷線圖</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>'
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className ="tab-pane fade in";
        addRelativeListListeners(station);
        overlay.setPosition(coordinate);
        cctvOverlay.setPosition(undefined);
      }
      else if(layer.get("id").includes("RainFallRealTime"))
      {
        var station=findRainFallStationByNo(feature.getId())
        centerMap(station.lat,station.lon);
        var coordinate2 = evt.coordinate;

        var m10=station.m10<0?'-':station.m10;
        var h1=station.h1<0?'-':station.h1;
        var h3= station.h3<0?'-':station.h3;
        var h6=station.h6<0?'-':station.h6;
        var h12=station.h12<0?'-':station.h12;
        var h24=station.h24<0?'-':station.h24;

        var m10=station.m10==-999||station.m10==-998?"-":station.m10;
        var h1=station.h1==-999||station.h1==-998?"-":station.h1;
        var h3=station.h3==-999||station.h3==-998?"-":station.h3;
        var h6=station.h6==-999||station.h6==-998?"-":station.h6;
        var h12=station.h12==-999||station.h12==-998?"-":station.h12;
        var h24=station.h24==-999||station.h24==-998?"-":station.h24;
        
        
        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">雨量站</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(station,"RainFallRealTime",station.stationNo);

        dataContent.innerHTML='<code>' 
        +'站點編號:'+station.stationNo +'</code><br><code>'
        +'站點名稱:'+station.stationName+'</code><br><code>'
        +'地址:'+station.address+'</code><br><code>'
        +'10分鐘雨量:'+m10+'</code><br><code>'
        +'1小時累積雨量:'+h1+'</code><br><code>'
        +'3小時累積雨量:'+h3+'</code><br><code>'
        +'6小時累積雨量:'+h6+'</code><br><code>'
        +'12小時累積雨量:'+h12+'</code><br><code>'
        +'24小時累積雨量:'+h24+'</code><br><code>'
        +'H1警戒等級:'+station.levelH1+'</code><br><code>'
        +'H3警戒等級:'+station.levelH3+'</code><br><code>'
        +'H6警戒等級:'+station.levelH6+'</code><br><code>'
        +'資料更新時間:'+station.time+'</code><br><code>'

        chartContent.innerHTML="";

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;

        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">站點資料</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in"; 
        relative.className="tab-pane fade in";
        addRelativeListListeners(station);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);

        // map.removeLayer(circleLayer);
        // var centerLongitudeLatitude = ol.proj.fromLonLat([station.lon, station.lat]);
        // circleLayer = new ol.layer.Vector({
        // source: new ol.source.Vector({
        // projection: 'EPSG:4326',
        // features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 10000))]
        // }),
        // style: [
        // new ol.style.Style({
        // stroke: new ol.style.Stroke({
        // color: 'blue',
        // width: 3
        // }),
        // fill: new ol.style.Fill({
        // color: 'rgba(0, 0, 255, 0.1)'
        // })
        // })
        // ]
        // });
        // map.addLayer(circleLayer);
      }
      else if(layer.get("id").includes("FloodingDisaster"))
      {
        var disaster=findFloodingDisasterByID(feature.getId())
         console.log(disaster.isReceded)
         console.log(disaster.disasterFloodingID)
        centerMap(disaster.lat,disaster.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">淹水災情</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(disaster,"FloodingDisaster",disaster.disasterFloodingID);
        // var chartContent=document.getElementById('chart');

        var category;
        switch(disaster.categoryCode)
        {
          case 1:
            category="經濟部水利署";
          break;
          case 2:
            category="消防署";
          break;
          case 3:
            category="傳播媒體";
          break;
          case 4:
            category="NCDR";
          break;
          case 6:
            category="水規所";
          break;
          case 7:
            category="APP災情通報";
          break;
          case 8:
            category="第一河川局";
          break;
          case 9:
            category="第二河川局";
          break;
          case 10:
            category="第四河川局";
          break;
          case 11:
            category="第五河川局";
          break;
          case 12:
            category="第六河川局";
          break;
          case 13:
            category="第七河川局";
          break;
          case 14:
            category="第十河川局";
          break;
          case 15:
            category="宜蘭縣政府";
          break;
          case 16:
            category="台南市政府";
          break;
          case 17:
            category="屏東縣政府";
          break;
        }
        var source;
        switch(disaster.sourceCode)
        {
          case 1:
            source="河川局";
          break;
          case 2:
            source="防護志工";
          break;
          case 3:
            source="其他";
          break;
          case 4:
            source="EMIC";
          break;
          case 5:
            source="新聞媒體";
          break;
          case 6:
            source="輿情資料";
          break;
          case 7:
            source="淹水感測";
          break;
          case 8:
            source="智慧水尺";
          break;
          case 9:
            source="語音通話";
          break;
        }
        var type;
        switch(disaster.type)
        {
          case 1:
            type="道路";
          break;
          case 2:
            type="房屋積淹水";
          break;
          case 3:
            type="工(商)業區";
          break;
          case 4:
            type="農田/魚塭";
          break;
          case 5:
            type="其他";
          break;
          case 6:
            type="待查";
          break;
          case 14:
            type="房屋地下室積水";
          break;
          case 15:
            type="地區積淹水";
          break;
          case 16:
            type="地下道積水";
          break;
        }

        var isReceded="-";
        if(!disaster.isReceded || disaster.isReceded==undefined)
        {
          isReceded="否";
        }
        else
        {
          isReceded="是"
        }
        //alert(isReceded)
        
        dataContent.innerHTML='<code>' 
        // +'災情序號:'+disaster.disasterFloodingID +'</code><br><code>'
        +'災害種類:'+checkUndefined(type)+'</code><br><code>'
        +'災點分區:'+checkUndefined(disaster.operatorName)+'</code><br><code>'
        +'災害地點:'+checkUndefined(disaster.location)+'</code><br><code>'
        +'災情描述:'+checkUndefined(disaster.situation)+'</code><br><code>'
        +'災情處置情形:'+checkUndefined(disaster.treatment)+'</code><br><code>'
        +'淹水深度:'+checkUndefined(disaster.depth)+'</code><br><code>'
        +'是否退水:'+isReceded+'</code><br><code>'
        +'退水時間:'+checkUndefined(disaster.recededDate)+'</code><br><code>'
        +'災情說明:'+checkUndefined(source)+'</code><br><code>'
        +'災情來源:'+checkUndefined(category)+'</code><br><code>'
        +'通報時間:'+checkUndefined(disaster.time)+'</code><br><code>'

        // chartContent.innerHTML='<p>這是圖</p>';
        chartContent.innerHTML="";

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;

        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">災情資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(disaster);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
      }
      else if(layer.get("id")=="cctv")
      {
        var station=findCCTVStationByID(feature.getId())
        centerMap(station.lat,station.lon);
        var coordinate = evt.coordinate;

        var title=document.getElementById('markerTitle2');
        title.innerHTML= '<p class="pcenter">CCTV站點</p>';
        
        socket.emit('cctvID',station.id);
        // var dataContent=document.getElementById('data');
        // var chartContent=document.getElementById('chart');

        // dataContent.innerHTML='<code>'
        // +'站點編號:'+station.id +'</code><br><code>'
        // +'站點名稱:'+station.name+'</code><br><code>'
        // +'所屬流域:'+station.basinName+'</code><br><code>'
        // +'地點:'+station.townname+'</code><br><code>'

        // chartContent.innerHTML='<canvas id="realTimeData"></canvas>';//show with timer

        // socket.emit('cctvID',station.id);
        // tab.innerHTML =
        //   '<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">CCTV站點資料</a></li>'
        //   +'<li><a class="nav-link" href="#chart" data-toggle="tab">即時影像</a></li>'
        // dataContent.className = "tab-pane fade active show";
        // chartContent.className ="tab-pane fade in";
        overlay.setPosition(undefined);
        cctvOverlay.setPosition(coordinate);
        //find10kmRelativeEvent(station,"cctv");
      }
      else if(layer.get("id")=="cctv2")
      {
        var station=findRoadCCTVStationByID(feature.getId())
        centerMap(station.lat,station.lon);
        var coordinate = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">CCTV站點(公路總局)</p>';
        
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(station,"cctv2",station.id);

        dataContent.innerHTML='<img id="realTimeData" width="400" src='+station.videoStreamURL+'></img>'+'<br><code>'
        +'站點編號:'+station.id +'</code><br><code>'
        +'地點:'+station.location+'</code><br><code>'

        chartContent.innerHTML='';
        relativeList.innerHTML=createRelativeListHTML(relativeEvents);

        tab.innerHTML =
          '<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">CCTV即時影像</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>'
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(station);
        overlay.setPosition(coordinate);
        cctvOverlay.setPosition(undefined);
        clearInterval(interval);
        interval=window.setInterval(function()
          {
            var image = document.getElementById("realTimeData");
            image.src = station.videoStreamURL;
          },20000);
      }
      else if(layer.get("id").includes("volunteer"))
      {
        var volunteer=findVolunteerByID(feature.getId())
        centerMap(volunteer.lat,volunteer.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">防汛志工</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(volunteer,"volunteer",volunteer.id);

        dataContent.innerHTML='<code>' 
        +'分隊:'+volunteer.team+'-'+ volunteer.name+'</code><br><code>'
        +'姓名:'+volunteer.volunteerName+'</code><br><code>'
        +'地址:'+volunteer.address+'</code><br><code>'
        +'電話:'+volunteer.phone+'</code><br><code>'
        +'服務區:'+volunteer.serviceAera+'</code><br><code>'
        +'河川局:'+volunteer.riverOffice+'</code><br><code>'
        +'承辦人:'+volunteer.officerName+'</code><br><code>'
        +'承辦人職稱:'+volunteer.officerDuty+'</code><br><code>'
        +'承辦人電話:'+volunteer.publicPhone+'</code><br><code>'
        +'承辦人手機:'+volunteer.privatePhone+'</code><br><code>'

        chartContent.innerHTML="";

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">志工資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(volunteer);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
        //find10kmRelativeEvent(volunteer,"volunteer");
      }
      else if(layer.get("id").includes("allSocialWelfareAgency"))
      {
        var angency=findSocialAgencyByID(feature.getId())
        centerMap(angency.lat,angency.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">社福機構</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(angency,"allSocialWelfareAgency",angency.id);

        // var isFirstFloor=angency.isFirstFloor==true?'是':'否';
        dataContent.innerHTML='<code>' 
        +'名稱:'+angency.name+'</code><br><code>'
        +'地址:'+angency.address+'</code><br><code>'
        +'電話:'+angency.phone+'</code><br><code>'
        +'是否位於1樓:'+angency.isFirstFloor+'</code><br><code>'
        chartContent.innerHTML="";
        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">機構資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(angency);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
        //find10kmRelativeEvent(angency,"allSocialWelfareAgency");
      }
      else if(layer.get("id").includes("community"))
      {
        var community=findCommunityByID(feature.getId())
        centerMap(community.lat,community.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">自主災防社區</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(community,"community",community.id);

        dataContent.innerHTML='<code>' 
        +'名稱:'+community.name+'</code><br><code>'
        +'指揮官姓名:'+community.commander+'</code><br><code>'
        +'領導組織:'+community.leadOrganization+'</code><br><code>'
        +'電話:'+community.phone+'</code><br><code>'
        +'地址:'+community.address+'</code><br><code>'
        +'河川局:'+community.riverOffice+'</code><br><code>'
        +'縣市:'+community.city+'</code><br><code>'
        +'縣市輔導團隊:'+community.citySupport+'</code><br><code>'
        +'成立年度:'+community.phone+'</code><br><code>'
        +'經費來源:'+community.fund+'</code><br><code>'
        +'108年獲獎:'+community.is108Reward+'</code><br><code>'
        chartContent.innerHTML="";
        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">社區資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(community);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
        //find10kmRelativeEvent(community,"community");
      }
      else if(layer.get("id").includes("floodingSensor"))
      {
        var sensor=findFloodingSensorByID(feature.getId())
        centerMap(sensor.lat,sensor.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">淹水感測器</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(sensor,"floodingSensor",sensor.id);

        var isConfirm=sensor.toBeConfirm==true?"是":"否";
        sensor.depth=sensor.depth==undefined?"-":sensor.depth;
        dataContent.innerHTML='<code>' 
        +'名稱:'+sensor.sensorName+'</code><br><code>'
        +'地址:'+sensor.address+'</code><br><code>'
        +'深度:'+sensor.depth+'(cm)</code><br><code>'
        +'是否待確認:'+isConfirm+'</code><br><code>'
        +'資料來源時間:'+checkUndefined(sensor.sourceTime)+'</code><br><code>'
        +'資料轉換時間:'+checkUndefined(sensor.transferTime)+'</code><br><code>'
       
        chartContent.innerHTML="";
        chartContent.innerHTML='<canvas id="chartData"></canvas>';
        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">感測器資訊</a></li>'
        +'<li><a class="nav-link" href="#chart" data-toggle="tab">感測歷線圖</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(sensor);
        socket.emit('FloodingSensor24hr',sensor.id);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
      }
      else if(layer.get("id").includes("waterPumpCar"))
      {
        var car=findWaterPumpCarByID(feature.getId())
        centerMap(car.lat,car.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">移動式抽水機</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
       var relativeEvents=find10kmRelativeEvent(car,"waterPumpCar",car.id);

        dataContent.innerHTML='<code>' 
        +'抽水機編號:'+car.id+'</code><br><code>'
        +'管理組織:'+car.orgName+'</code><br><code>'
        +'縣市:'+checkUndefined(car.city)+'</code><br><code>'
        +'鄉鎮區:'+checkUndefined(car.town)+'</code><br><code>'
        +'地址:'+checkUndefined(car.road)+'</code><br><code>'
        +'狀態:'+car.status+'</code><br><code>'
        +'資料傳送時間:'+car.operateat+'</code><br><code>'

        chartContent.innerHTML="";

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">抽水機資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(car);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
      }
      else if(layer.get("id").includes("waterPumpStation1"))
      {
        var station=findWaterPumpStation1ByID(feature.getId())
        centerMap(station.lat,station.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">抽水站(河海提供)</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(station,"waterPumpStation1",station.id);

        dataContent.innerHTML='<code>' 
        +'抽水站名稱:'+station.name+'</code><br><code>'
        +'核定抽水站或工程名稱:'+station.work_name+'</code><br><code>'
        +'縣市地區:'+station.city+station.town+'</code><br><code>'
        +'水系:'+station.water_system+'</code><br><code>'
        +'管理機關:'+station.manager+'</code><br><code>'
        +'抽水量(CMS):'+station.pump_cms+'</code><br><code>'
        +'操作人員:'+station.operator+'</code><br><code>'
        +'督導人員:'+station.supervisor+'</code><br><code>'
        +'完成(預計)整備日期:'+station.done_time+'</code><br><code>'
        +'備註:'+station.ps+'</code><br><code>'

        chartContent.innerHTML="";

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">抽水站資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(station);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
        //find10kmRelativeEvent(volunteer,"volunteer");
      }
      else if(layer.get("id").includes("waterPumpStation2"))
      {
        var station=findWaterPumpStation2ByID(feature.getId())
        centerMap(station.lat,station.lon);
        var coordinate2 = evt.coordinate;

        var title=document.getElementById('markerTitle');
        title.innerHTML= '<p class="pcenter">淡水河流域抽水站(十河局提供)</p>';
        var dataContent=document.getElementById('data');
        var chartContent=document.getElementById('chart');
        var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(station,"waterPumpStation2",station.id);

        dataContent.innerHTML='<code>' 
        +'抽水站名稱:'+station.name+'</code><br><code>'
        +'河系:'+station.river_system+'</code><br><code>'
        +'主管機關:'+station.supervisor_agency+'</code><br><code>'
        +'總抽水量(CMS):'+station.pump_cms+'</code><br><code>'
        +'電話:'+station.phone+'</code><br><code>'
        +'連絡人:'+checkUndefined(station.contact)+'</code><br><code>'
        +'連絡電話:'+checkUndefined(station.contact_phone)+'</code><br><code>'

        chartContent.innerHTML="";

        var listHTML=createRelativeListHTML(relativeEvents);
        relativeList.innerHTML=listHTML;
        tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">抽水站資訊</a></li>'
        +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
        dataContent.className = "tab-pane fade active show";
        chartContent.className ="tab-pane fade in";
        relative.className="tab-pane fade in";
        addRelativeListListeners(station);
        overlay.setPosition(coordinate2);
        cctvOverlay.setPosition(undefined);
      }
    });
  });
    map.getView().on('change:resolution', function(e) //監聽zoom-in zoom-out
    {
      var newZoom = map.getView().getZoom();
      currZoom = newZoom;
     // var targetLayer=findLayerByID("WaterRealTime"); //暫
      var layer=map.getLayers().getArray();
      for(var value in layer)
      {
        var targetLayer=layer[value];
        switch(targetLayer.get("id"))
        {
          case "WaterRealTime-0":
          case "WaterRealTime-1":
          case "WaterRealTime-2":
          case "WaterRealTime-3":
          case "WaterRealTime-noValue":
            if(targetLayer!=null)
            {
              var allData=featuresData["WaterRealTime"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].stationNo);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].stationName);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].stationNo);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }  
          break;
          case "RainFallRealTime-0":
          case "RainFallRealTime-1":
          case "RainFallRealTime-2":
          case "RainFallRealTime-noValue":
            if(targetLayer!=null)
            {
              var allData=featuresData["RainFallRealTime"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].stationNo);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].stationName);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].stationNo);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "FloodingDisaster":
            if(targetLayer!=null)
            {
              var allData=featuresData["FloodingDisaster"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var temp=allData[i];
                  for(var k=0;k<temp.disasterFloodings.length;k++)
                  {
                    var tempEvent=temp.disasterFloodings[k];
                    var val=targetLayer.getSource().getFeatureById(tempEvent.disasterFloodingID);
                    if(val!=null)
                    {
                      val.getStyle().getText().setText(tempEvent.operatorName);
                    }
                  } 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var temp=allData[i];
                  for(var k=0;k<temp.disasterFloodings.length;k++)
                  {
                    var tempEvent=temp.disasterFloodings[k];
                    var val=targetLayer.getSource().getFeatureById(tempEvent.disasterFloodingID);
                    if(val!=null)
                    {
                      val.getStyle().getText().setText("");
                    }
                  } 
                }
              }
            }
          break;
          case "cctv":
            if(targetLayer!=null)
            {
              var allData=featuresData["cctv"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].name);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "cctv2":
            if(targetLayer!=null)
            {
              var allData=featuresData["cctv2"];
              if(currZoom>13)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].location);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "volunteer":
            if(targetLayer!=null)
            {
              var allData=featuresData["volunteer"];
              if(currZoom>13)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].volunteerName);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "allSocialWelfareAgency":
            if(targetLayer!=null)
            {
              var allData=featuresData["allSocialWelfareAgency"];
              if(currZoom>15)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].name);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "community":
            if(targetLayer!=null)
            {
              var allData=featuresData["community"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].name);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "floodingSensor":
          case "floodingSensorAlert":
            if(targetLayer!=null)
            {
              var allData=featuresData["floodingSensor"];
              if(currZoom>14)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].sensorName);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "waterPumpCar":
            if(targetLayer!=null)
            {
              var allData=featuresData["waterPumpCar"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].id);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "waterPumpStation1":
            if(targetLayer!=null)
            {
              var allData=featuresData["waterPumpStation1"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].name);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
          case "waterPumpStation2":
            if(targetLayer!=null)
            {
              var allData=featuresData["waterPumpStation2"];
              if(currZoom>12)
              { 
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText(allData[i].name);
                  }
                 
                }
              }
              else
              {
                for(var i in allData)
                {
                  var val=targetLayer.getSource().getFeatureById(allData[i].id);
                  if(val!=null)
                  {
                    val.getStyle().getText().setText('');
                  }
                }
              }
            }
          break;
        }
      }
    });
}
function addRelativeListListeners(backPosition)
{
  var items=document.getElementsByName("relative_waterRealTime");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var station=findWaterStationByNo(item.id);
          var level="0";
          switch(station.alarmLevel)
          {
            case '未達警戒':
              level="0";
            break;
            case '一級警戒':
              level="1";
            break;
            case '二級警戒':
              level="2";
            break;
            case '三級警戒':
              level="3";
            break;
            default :
              level='noValue';
            break;
          }
          var feature=findLayerByID("WaterRealTime-"+level).getSource().getFeatureById(station.stationNo);
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);

          zoomMap(14);
          centerMap(station.lat,station.lon);
          var coordinate =ol.proj.transform([station.lon,station.lat], 'EPSG:4326','EPSG:3857');
 //         ol.coordinate.add(coordinate, [0, 700]);
          station.time=station.time==null?'無資料':station.time; 
      
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">水位站</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(station,"WaterRealTime",item.id);
          if(station.waterLevel=='無資料')
          {
            dataContent.innerHTML='<code>'
            +'站點編號:'+station.stationNo +'</code><br><code>'
            +'站點名稱:'+station.stationName+'</code><br><code>'
            +'地址:'+station.address+'</code><br><code>'
            +'水位高:'+station.waterLevel+'</code><br><code>'
            +'警戒等級:'+station.alarmLevel+'</code><br><code>'
            +'資料更新時間:'+station.time+'</code><br>';
          }
          else
          {
            dataContent.innerHTML='<code>'
            +'站點編號:'+station.stationNo +'</code><br><code>'
            +'站點名稱:'+station.stationName+'</code><br><code>'
            +'地址:'+station.address+'</code><br><code>'
            +'水位高:'+station.waterLevel+' m</code><br><code>'
            +'警戒等級:'+station.alarmLevel+'</code><br><code>'
            +'資料更新時間:'+station.time+'</code><br>';
          }
          chartContent.innerHTML='<canvas id="chartData"></canvas>';
      
          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          socket.emit('waterLevel24hr',station.stationNo);
          tab.innerHTML =
            '<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">水位資料</a></li>'
            +'<li><a class="nav-link" href="#chart" data-toggle="tab">水位歷線圖</a></li>'
            +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>'
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className ="tab-pane fade in";
          addRelativeListListeners(station);
          overlay.setPosition(coordinate);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_rainFallRealTime");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var station=findRainFallStationByNo(item.id);
          var level='';
          if(station.levelH1=="一級警戒" || station.levelH3=="一級警戒" || station.levelH6=="一級警戒")
          {
            level='1';
          }
          else
          {
            if(station.levelH1=="二級警戒" || station.levelH3=="二級警戒" || station.levelH6=="二級警戒")
            {
              level='2';
            }
            else
            {
              if(station.levelH1=="未達警戒" || station.levelH3=="未達警戒" || station.levelH6=="未達警戒")
              {
                level='0';
              }
              else
              {
                level='noValue';
              }
            }
          }

          var feature=findLayerByID("RainFallRealTime-"+level).getSource().getFeatureById(item.id);
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);

          zoomMap(14);
          centerMap(station.lat,station.lon);
          var coordinate2 =ol.proj.transform([station.lon,station.lat], 'EPSG:4326','EPSG:3857');
//          ol.coordinate.add(coordinate2, [0, 700]);
      
          var m10=station.m10==-998?0:station.m10;
          var h1=station.h1==-998?0:station.h1;
          var h3= station.h3==-998?0:station.h3;
          var h6=station.h6==-998?0:station.h6;
          var h12=station.h12==-998?0:station.h12;
          var h24=station.h24==-998?0:station.h24;
          
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">雨量站</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(station,"RainFallRealTime",station.stationNo);
      
          dataContent.innerHTML='<code>' 
          +'站點編號:'+station.stationNo +'</code><br><code>'
          +'站點名稱:'+station.stationName+'</code><br><code>'
          +'地址:'+station.address+'</code><br><code>'
          +'10分鐘雨量:'+m10+'</code><br><code>'
          +'1小時累積雨量:'+h1+'</code><br><code>'
          +'3小時累積雨量:'+h3+'</code><br><code>'
          +'6小時累積雨量:'+h6+'</code><br><code>'
          +'12小時累積雨量:'+h12+'</code><br><code>'
          +'24小時累積雨量:'+h24+'</code><br><code>'
          +'H1警戒等級:'+station.levelH1+'</code><br><code>'
          +'H3警戒等級:'+station.levelH3+'</code><br><code>'
          +'H6警戒等級:'+station.levelH6+'</code><br><code>'
          +'資料更新時間:'+station.time+'</code><br><code>'
      
          chartContent.innerHTML="";
      
          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
      
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">站點資料</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in"; 
          relative.className="tab-pane fade in";
          addRelativeListListeners(station);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_floodingDisaster");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
      {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var disaster=findFloodingDisasterByID(item.id);
          var feature=findLayerByID("FloodingDisaster").getSource().getFeatureById(item.id);
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
        
          zoomMap(14);
          centerMap(disaster.lat,disaster.lon);
          var coordinate2 =ol.proj.transform([disaster.lon,disaster.lat], 'EPSG:4326','EPSG:3857');
 //         ol.coordinate.add(coordinate2, [0, 700]);

          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">淹水災情</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(disaster,"FloodingDisaster",disaster.disasterFloodingID);
          // var chartContent=document.getElementById('chart');

          var category;
          switch(disaster.categoryCode)
          {
            case 1:
              category="經濟部水利署";
            break;
            case 2:
              category="消防署";
            break;
            case 3:
              category="傳播媒體";
            break;
            case 4:
              category="NCDR";
            break;
            case 6:
              category="水規所";
            break;
            case 7:
              category="APP災情通報";
            break;
            case 8:
              category="第一河川局";
            break;
            case 9:
              category="第二河川局";
            break;
            case 10:
              category="第四河川局";
            break;
            case 11:
              category="第五河川局";
            break;
            case 12:
              category="第六河川局";
            break;
            case 13:
              category="第七河川局";
            break;
            case 14:
              category="第十河川局";
            break;
            case 15:
              category="宜蘭縣政府";
            break;
            case 16:
              category="台南市政府";
            break;
            case 17:
              category="屏東縣政府";
            break;
          }
          var source;
          switch(disaster.sourceCode)
          {
            case 1:
              source="河川局";
            break;
            case 2:
              source="防護志工";
            break;
            case 3:
              source="其他";
            break;
            case 4:
              source="EMIC";
            break;
            case 5:
              source="新聞媒體";
            break;
            case 6:
              source="輿情資料";
            break;
            case 7:
              source="淹水感測";
            break;
            case 8:
              source="智慧水尺";
            break;
            case 9:
              source="語音通話";
            break;
          }
          var type;
          switch(disaster.type)
          {
            case 1:
              type="道路";
            break;
            case 2:
              type="房屋積淹水";
            break;
            case 3:
              type="工(商)業區";
            break;
            case 4:
              type="農田/魚塭";
            break;
            case 5:
              type="其他";
            break;
            case 6:
              type="待查";
            break;
            case 14:
              type="房屋地下室積水";
            break;
            case 15:
              type="地區積淹水";
            break;
            case 16:
              type="地下道積水";
            break;
          }

          var isReceded="-";
          if(!disaster.isReceded || disaster.isReceded==undefined)
          {
            isReceded="否";
          }
          else
          {
            isReceded="是"
          }
          //alert(isReceded)
          
          dataContent.innerHTML='<code>' 
          // +'災情序號:'+disaster.disasterFloodingID +'</code><br><code>'
          +'災害種類:'+checkUndefined(type)+'</code><br><code>'
          +'災點分區:'+checkUndefined(disaster.operatorName)+'</code><br><code>'
          +'災害地點:'+checkUndefined(disaster.location)+'</code><br><code>'
          +'災情描述:'+checkUndefined(disaster.situation)+'</code><br><code>'
          +'災情處置情形:'+checkUndefined(disaster.treatment)+'</code><br><code>'
          +'淹水深度:'+checkUndefined(disaster.depth)+'</code><br><code>'
          +'是否退水:'+isReceded+'</code><br><code>'
          +'退水時間:'+checkUndefined(disaster.recededDate)+'</code><br><code>'
          +'災情說明:'+checkUndefined(source)+'</code><br><code>'
          +'災情來源:'+checkUndefined(category)+'</code><br><code>'
          +'通報時間:'+checkUndefined(disaster.time)+'</code><br><code>'

          // chartContent.innerHTML='<p>這是圖</p>';
          chartContent.innerHTML="";

          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;

          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">災情資訊</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(disaster);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )

  var items=document.getElementsByName("relative_cctv");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var station=findCCTVStationByID(item.id)
          var feature=findLayerByID("cctv").getSource().getFeatureById(item.id);
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);

          zoomMap(14);
          centerMap(station.lat,station.lon);
          var coordinate =ol.proj.transform([station.lon,station.lat], 'EPSG:4326','EPSG:3857');
  //        ol.coordinate.add(coordinate, [0, 700]);
          var title=document.getElementById('markerTitle2');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">CCTV站點</p>';   
          $("#popup-return").on('click', function(e)
          {
            cctvOverlay.setPosition(undefined);
            cctvCloser.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          }); 
          socket.emit('cctvID',station.id);
          overlay.setPosition(undefined);
          cctvOverlay.setPosition(coordinate);
          cctvCloser.onclick = function() {
            cctvOverlay.setPosition(undefined);
            cctvCloser.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_volunteer");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var volunteer=findVolunteerByID(item.id)
          var feature=findLayerByID("volunteer").getSource().getFeatureById(item.id);
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
         
          zoomMap(14);
          centerMap(volunteer.lat,volunteer.lon);
          var coordinate2 =ol.proj.transform([volunteer.lon,volunteer.lat], 'EPSG:4326','EPSG:3857');
 //         ol.coordinate.add(coordinate2, [0, 700]);
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">防汛志工</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(volunteer,"volunteer",volunteer.id);

          dataContent.innerHTML='<code>' 
          +'分隊:'+volunteer.team+'-'+ volunteer.name+'</code><br><code>'
          +'姓名:'+volunteer.volunteerName+'</code><br><code>'
          +'地址:'+volunteer.address+'</code><br><code>'
          +'電話:'+volunteer.phone+'</code><br><code>'
          +'服務區:'+volunteer.serviceAera+'</code><br><code>'
          +'河川局:'+volunteer.riverOffice+'</code><br><code>'
          +'承辦人:'+volunteer.officerName+'</code><br><code>'
          +'承辦人職稱:'+volunteer.officerDuty+'</code><br><code>'
          +'承辦人電話:'+volunteer.publicPhone+'</code><br><code>'
          +'承辦人手機:'+volunteer.privatePhone+'</code><br><code>'

          chartContent.innerHTML="";

          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">志工資訊</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(volunteer);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_allSocialWelfareAgency");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var angency=findSocialAgencyByID(item.id)
          var feature=findLayerByID("allSocialWelfareAgency").getSource().getFeatureById(item.id); 
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
         
          zoomMap(14);
          centerMap(angency.lat,angency.lon);
          var coordinate2 =ol.proj.transform([angency.lon,angency.lat], 'EPSG:4326','EPSG:3857');
  //        ol.coordinate.add(coordinate2, [0, 700]);
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">社福機構</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(angency,"allSocialWelfareAgency",angency.id);
      
          // var isFirstFloor=angency.isFirstFloor==true?'是':'否';
          dataContent.innerHTML='<code>' 
          +'名稱:'+angency.name+'</code><br><code>'
          +'地址:'+angency.address+'</code><br><code>'
          +'電話:'+angency.phone+'</code><br><code>'
          +'是否位於1樓:'+angency.isFirstFloor+'</code><br><code>'
          chartContent.innerHTML="";
          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">機構資訊</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(angency);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_community");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var community=findCommunityByID(item.id)
          var feature=findLayerByID("community").getSource().getFeatureById(item.id); 
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
         
          zoomMap(14);
          centerMap(community.lat,community.lon);
          var coordinate2 =ol.proj.transform([community.lon,community.lat], 'EPSG:4326','EPSG:3857');
  //        ol.coordinate.add(coordinate2, [0, 700]);
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">自主災防社區</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(community,"community",community.id);
      
          dataContent.innerHTML='<code>' 
          +'名稱:'+community.name+'</code><br><code>'
          +'指揮官姓名:'+community.commander+'</code><br><code>'
          +'領導組織:'+community.leadOrganization+'</code><br><code>'
          +'電話:'+community.phone+'</code><br><code>'
          +'地址:'+community.address+'</code><br><code>'
          +'河川局:'+community.riverOffice+'</code><br><code>'
          +'縣市:'+community.city+'</code><br><code>'
          +'縣市輔導團隊:'+community.citySupport+'</code><br><code>'
          +'成立年度:'+community.phone+'</code><br><code>'
          +'經費來源:'+community.fund+'</code><br><code>'
          +'108年獲獎:'+community.is108Reward+'</code><br><code>'
          chartContent.innerHTML="";
          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">社區資訊</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(community);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
          //find10kmRelativeEvent(community,"community");
        };
    }
  )
  var items=document.getElementsByName("relative_cctv2");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var station=findRoadCCTVStationByID(item.id)
          var feature=findLayerByID("cctv2").getSource().getFeatureById(item.id); 
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
          
          zoomMap(14);
          centerMap(station.lat,station.lon);
          var coordinate =ol.proj.transform([station.lon,station.lat], 'EPSG:4326','EPSG:3857');
 //         ol.coordinate.add(coordinate, [0, 700]);
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">CCTV站點(公路總局)</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(station,"cctv2",station.id);

          dataContent.innerHTML='<img id="realTimeData" width="400" src='+station.videoStreamURL+'></img>'+'<br><code>'
          +'站點編號:'+station.id +'</code><br><code>'
          +'地點:'+station.location+'</code><br><code>'

          chartContent.innerHTML='';
          relativeList.innerHTML=createRelativeListHTML(relativeEvents);

          tab.innerHTML =
            '<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">CCTV即時影像</a></li>'
            +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>'
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(station);
          overlay.setPosition(coordinate);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_floodingSensor");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var sensor=findFloodingSensorByID(item.id)
          var feature=findLayerByID("floodingSensor").getSource().getFeatureById(item.id); 
          if(feature==undefined)
          {
            feature=findLayerByID("floodingSensorAlert").getSource().getFeatureById(item.id); 
          }
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
         
          zoomMap(14);
          centerMap(sensor.lat,sensor.lon);
          var coordinate2 =ol.proj.transform([sensor.lon,sensor.lat], 'EPSG:4326','EPSG:3857');
  //       ol.coordinate.add(coordinate2, [0, 700]);
      
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">淹水感測器</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(sensor,"floodingSensor",sensor.id);
      
          var isConfirm=sensor.toBeConfirm==true?"是":"否";
          sensor.depth=sensor.depth==undefined?"-":sensor.depth;
          dataContent.innerHTML='<code>' 
          +'名稱:'+sensor.sensorName+'</code><br><code>'
          +'地址:'+sensor.address+'</code><br><code>'
          +'深度:'+sensor.depth+'(cm)</code><br><code>'
          +'是否待確認:'+isConfirm+'</code><br><code>'
          +'資料來源時間:'+checkUndefined(sensor.sourceTime)+'</code><br><code>'
          +'資料轉換時間:'+checkUndefined(sensor.transferTime)+'</code><br><code>'
         
          chartContent.innerHTML="";
          chartContent.innerHTML='<canvas id="chartData"></canvas>';
          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">感測器資訊</a></li>'
          +'<li><a class="nav-link" href="#chart" data-toggle="tab">感測歷線圖</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(sensor);
          socket.emit('FloodingSensor24hr',sensor.id);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_waterPumpCar");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var car=findWaterPumpCarByID(item.id)
          var feature=findLayerByID('waterPumpCar').getSource().getFeatureById(item.id); 
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
         
          zoomMap(14);
          centerMap(car.lat,car.lon);
          var coordinate2 =ol.proj.transform([car.lon,car.lat], 'EPSG:4326','EPSG:3857');
 //         ol.coordinate.add(coordinate2, [0, 700]);

          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">移動式抽水機</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
        var relativeEvents=find10kmRelativeEvent(car,"waterPumpCar",car.id);

          dataContent.innerHTML='<code>' 
          +'抽水機編號:'+car.id+'</code><br><code>'
          +'管理組織:'+car.orgName+'</code><br><code>'
          +'縣市:'+checkUndefined(car.city)+'</code><br><code>'
          +'鄉鎮區:'+checkUndefined(car.town)+'</code><br><code>'
          +'地址:'+checkUndefined(car.road)+'</code><br><code>'
          +'狀態:'+car.status+'</code><br><code>'
          +'資料傳送時間:'+car.operateat+'</code><br><code>'

          chartContent.innerHTML="";

          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">移動式抽水機</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(car);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_waterPumpStation1");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var station=findWaterPumpStation1ByID(item.id)
          var feature=findLayerByID('waterPumpStation1').getSource().getFeatureById(item.id); 
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
         
          zoomMap(14);
          centerMap(station.lat,station.lon);
          var coordinate2 =ol.proj.transform([station.lon,station.lat], 'EPSG:4326','EPSG:3857');
 //         ol.coordinate.add(coordinate2, [0, 700]);
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">抽水站(河海提供)</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(station,"waterPumpStation1",station.id);

          dataContent.innerHTML='<code>' 
          +'抽水站名稱:'+station.name+'</code><br><code>'
          +'核定抽水站或工程名稱:'+station.work_name+'</code><br><code>'
          +'縣市地區:'+station.city+station.town+'</code><br><code>'
          +'水系:'+station.water_system+'</code><br><code>'
          +'管理機關:'+station.manager+'</code><br><code>'
          +'抽水量(CMS):'+station.pump_cms+'</code><br><code>'
          +'操作人員:'+station.operator+'</code><br><code>'
          +'督導人員:'+station.supervisor+'</code><br><code>'
          +'完成(預計)整備日期:'+station.done_time+'</code><br><code>'
          +'備註:'+station.ps+'</code><br><code>'

          chartContent.innerHTML="";

          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">抽水站資訊</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(station);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
  var items=document.getElementsByName("relative_waterPumpStation2");
  items.forEach(
    function(item)
    {
      item.onclick = function() 
        {
          var layer=findLayerByID("relativeTemp");
          if(layer!=undefined)
          {
            map.removeLayer(layer);
          }
          var station=findWaterPumpStation2ByID(item.id)
          var feature=findLayerByID('waterPumpStation2').getSource().getFeatureById(item.id); 
          var featuresTemp = [];
          featuresTemp.push(feature);
          var vectorSource = new ol.source.Vector({features: featuresTemp});
          relativeTempLayer = new ol.layer.Vector({source: vectorSource});
          relativeTempLayer.set("id","relativeTemp",false);
          relativeTempLayer.setVisible(true);
          map.addLayer(relativeTempLayer);
          
          zoomMap(14);
          centerMap(station.lat,station.lon);
          var coordinate2 =ol.proj.transform([station.lon,station.lat], 'EPSG:4326','EPSG:3857');
//          ol.coordinate.add(coordinate2, [0, 700]);
          var title=document.getElementById('markerTitle');
          title.innerHTML= '<a href="#" id="popup-return" style="position: absolute;"><img src="/icons/return.png"></img></a><p class="pcenter">淡水河流域抽水站(十河局提供)</p>';
          $("#popup-return").on('click', function(e)
          {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            centerMap(backPosition.lat,backPosition.lon);
          });
          var dataContent=document.getElementById('data');
          var chartContent=document.getElementById('chart');
          var relativeList=document.getElementById('relative-list');
          var relativeEvents=find10kmRelativeEvent(station,"waterPumpStation2",station.id);
      
          dataContent.innerHTML='<code>' 
          +'抽水站名稱:'+station.name+'</code><br><code>'
          +'河系:'+station.river_system+'</code><br><code>'
          +'主管機關:'+station.supervisor_agency+'</code><br><code>'
          +'總抽水量(CMS):'+station.pump_cms+'</code><br><code>'
          +'電話:'+station.phone+'</code><br><code>'
          +'連絡人:'+checkUndefined(station.contact)+'</code><br><code>'
          +'連絡電話:'+checkUndefined(station.contact_phone)+'</code><br><code>'
      
          chartContent.innerHTML="";
      
          var listHTML=createRelativeListHTML(relativeEvents);
          relativeList.innerHTML=listHTML;
          tab.innerHTML ='<li class="active"><a class="nav-link active" href="#data" data-toggle="tab">抽水站資訊</a></li>'
          +'<li><a class="nav-link" href="#relative" data-toggle="tab">附近10公里</a></li>';
          dataContent.className = "tab-pane fade active show";
          chartContent.className ="tab-pane fade in";
          relative.className="tab-pane fade in";
          addRelativeListListeners(station);
          overlay.setPosition(coordinate2);
          cctvOverlay.setPosition(undefined);
          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            var layer=findLayerByID("relativeTemp");
            if(layer!=undefined)
            {
              map.removeLayer(layer);
            }
            return false;
          };
        };
    }
  )
}
function createRelativeListHTML(relativeEvents)
{
  var listHTML='';
  var sortResult=[];
  for(var key in relativeEvents)
  {
    var events=relativeEvents[key];
    for(var k=0;k<events.length;k++)
    {
      var temp=events[k];
      temp.type=key;
      sortResult.push(temp);
    }
  }
  sortResult.sort(function (a, b) {
    return a.km - b.km;
  });
  for(var i=0;i<sortResult.length;i++)
  {
    switch(sortResult[i].type)
    {
      case "waterRealTime":
          listHTML+='<a id="'+sortResult[i].stationNo+'" name="relative_waterRealTime" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/water_level_station.png">'
          +'水位站</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">站點名稱:'+sortResult[i].stationName+'</p>'
          +'<p class="mb-2">地址:'+sortResult[i].address+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "rainFallRealTime":
          listHTML+='<a id="'+sortResult[i].stationNo+'" name="relative_rainFallRealTime" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/hygrometer32.png">'
          +'雨量站</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">站點名稱:'+sortResult[i].stationName+'</p>'
          +'<p class="mb-2">地址:'+sortResult[i].address+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "floodingDisaster":
          listHTML+='<a id="'+sortResult[i].disasterFloodingID+'" name="relative_floodingDisaster" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/disaster.png">'
          +'淹水災情</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-1">案件名稱:'+sortResult[i].caseNo+'</p>'
          +'<p class="mb-1">案發地點:'+sortResult[i].location+'</p>'
          +'<small>'+sortResult[i].situation+'</small>'
          +'</a>'; 
      break;
      case "cctv":
          listHTML+='<a id="'+sortResult[i].id+'" name="relative_cctv" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/cctv.png">'
          +'CCTV站點</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">站點名稱:'+sortResult[i].name+'</p>'
          +'<p class="mb-2">所屬流域:'+sortResult[i].basinName+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "volunteer":
          listHTML+='<a id="'+sortResult[i].id+'" name="relative_volunteer" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/volunteer.png">'
          +'防汛志工</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">姓名:'+sortResult[i].volunteerName+'</p>'
          +'<p class="mb-2">地址:'+sortResult[i].address+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "allSocialWelfareAgency":
          listHTML+='<a id="'+sortResult[i].id+'" name="relative_allSocialWelfareAgency" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/social_welfare.png">'
          +'社福機構</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">名稱:'+sortResult[i].name+'</p>'
          +'<p class="mb-2">地址:'+sortResult[i].address+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "community":
          listHTML+='<a id="'+sortResult[i].id+'" name="relative_community" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/community.png">'
          +'自主災防社區</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">社區名稱:'+sortResult[i].name+'</p>'
          +'<p class="mb-2">社區地址:'+sortResult[i].address+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "cctv2":
        listHTML+='<a id="'+sortResult[i].id+'" name="relative_cctv2" href="#" class="list-group-item list-group-item-action">'
        +'<div class="d-flex w-100 justify-content-between">'
        +'<h5 class="mb-1">'
        +'<img src="/icons/cctv.png">'
        +'公路總局CCTV</h5>'
        +'<small>'+sortResult[i].km+'公里</small>'
        +'</div>'
        +'<p class="mb-2">CCTV站點編號:'+sortResult[i].id+'</p>'
        +'<p class="mb-2">CCTV地點:'+sortResult[i].location+'</p>'
        // +'<small>Donec id elit non mi porta.</small>'
        +'</a>'; 
      break;
      case "floodingSensor":
          listHTML+='<a id="'+sortResult[i].id+'" name="relative_floodingSensor" href="#" class="list-group-item list-group-item-action">'
          +'<div class="d-flex w-100 justify-content-between">'
          +'<h5 class="mb-1">'
          +'<img src="/icons/flood.png">'
          +'淹水感測器</h5>'
          +'<small>'+sortResult[i].km+'公里</small>'
          +'</div>'
          +'<p class="mb-2">感測器名稱:'+sortResult[i].sensorName+'</p>'
          +'<p class="mb-2">感測器地址:'+sortResult[i].address+'</p>'
          // +'<small>Donec id elit non mi porta.</small>'
          +'</a>'; 
      break;
      case "waterPumpCar":
        listHTML+='<a id="'+sortResult[i].id+'" name="relative_waterPumpCar" href="#" class="list-group-item list-group-item-action">'
        +'<div class="d-flex w-100 justify-content-between">'
        +'<h5 class="mb-1">'
        +'<img src="/icons/water-pump.png">'
        +'移動式抽水機</h5>'
        +'<small>'+sortResult[i].km+'公里</small>'
        +'</div>'
        +'<p class="mb-2">抽水機編號:'+sortResult[i].id+'</p>'
        +'<p class="mb-2">縣市:'+sortResult[i].city+'</p>'
        // +'<small>Donec id elit non mi porta.</small>'
        +'</a>'; 
      break;
      case "waterPumpStation1":
        listHTML+='<a id="'+sortResult[i].id+'" name="relative_waterPumpStation1" href="#" class="list-group-item list-group-item-action">'
        +'<div class="d-flex w-100 justify-content-between">'
        +'<h5 class="mb-1">'
        +'<img src="/icons/water_pump_station.png">'
        +'抽水站(河海提供)</h5>'
        +'<small>'+sortResult[i].km+'公里</small>'
        +'</div>'
        +'<p class="mb-2">抽水站名稱:'+sortResult[i].id+'</p>'
        +'<p class="mb-2">水系:'+sortResult[i].water_system+'</p>'
        // +'<small>Donec id elit non mi porta.</small>'
        +'</a>'; 
      break;
      case "waterPumpStation2":
        listHTML+='<a id="'+sortResult[i].id+'" name="relative_waterPumpStation2" href="#" class="list-group-item list-group-item-action">'
        +'<div class="d-flex w-100 justify-content-between">'
        +'<h5 class="mb-1">'
        +'<img src="/icons/water_pump_station.png">'
        +'淡水河抽水站(十河局提供)</h5>'
        +'<small>'+sortResult[i].km+'公里</small>'
        +'</div>'
        +'<p class="mb-2">抽水站名稱:'+sortResult[i].id+'</p>'
        +'<p class="mb-2">河系:'+sortResult[i].river_system+'</p>'
        // +'<small>Donec id elit non mi porta.</small>'
        +'</a>'; 
      break;
    }
  }

  return listHTML;
}
function checkUndefined(value)
{
  if(value==undefined)
  {
    return '-';
  }
  else if(value=='')
  {
    return '無';
  }
  return value;
}
function findLayerByID(id)
{
  var layer=map.getLayers().getArray();
  for(var i in layer)
  {
    if(layer[i].get("id")==id)
    {
      return layer[i];
    }
  }
}
function findWaterStationByNo(stationNo)
{
  var data=featuresData['WaterRealTime'];
  for(var value in data)
  {
    if(data[value].stationNo==stationNo)
    {
      return data[value];
    }
  }
}
function findRainFallStationByNo(stationNo)
{
  var data=featuresData['RainFallRealTime'];
  for(var value in data)
  {
    if(data[value].stationNo==stationNo)
    {
      return data[value];
    }
  }
}
function findFloodingDisasterByID(id)
{
  var data=featuresData['FloodingDisaster'];
  for(var value in data)
  {
    var temp=data[value];
    for(var k=0;k<temp.disasterFloodings.length;k++)
    {
      if(temp.disasterFloodings[k].disasterFloodingID==id)
      {
        return temp.disasterFloodings[k];
      }
    }
   
  }
}
function findSocialAgencyByID(id)
{
  var data=featuresData['allSocialWelfareAgency'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findCommunityByID(id)
{
  var data=featuresData['community'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findVolunteerByID(id)
{
  var data=featuresData['volunteer'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findCCTVStationByID(id)
{
  var data=featuresData['cctv'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findRoadCCTVStationByID(id)
{
  var data=featuresData['cctv2'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findFloodingSensorByID(id)
{
  var data=featuresData['floodingSensor'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findWaterStationsByLevel(level)
{
  var data=featuresData["WaterRealTime"];
  var output=[];
  for(var value in data)
  {
    if(data[value].alarmLevel==level)
    {
      output[data[value].stationNo]=data[value];
    }
  }
  return output;
}
function findWaterPumpCarByID(id)
{
  var data=featuresData['waterPumpCar'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findWaterPumpStation1ByID(id)
{
  var data=featuresData['waterPumpStation1'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function findWaterPumpStation2ByID(id)
{
  var data=featuresData['waterPumpStation2'];
  for(var value in data)
  {
    if(data[value].id==id)
    {
      return data[value];
    }
  }
}
function createButtonClickListeners()
{
  missionTable=$('#mission_table').DataTable(
  {
    searching: false,
    paging: false,
    columns: [
      {data:'no'},
      {data:'base_unit'},
      {data:'report_no'},
      {data:'dispatch_unit'},
      {data:'support_location'},
      {data:'mission_status'},
      {data:'num'},
      {data:'dispatch_car_list'},
      {data:'site_condition'},
      {data:'flood_deep'},
      {data:'contact'},
      {data:'read_status'},
      {data:'remarks'},
  ]
  });
  $('#mission_table tbody').on('click', 'tr', function () {
    var data = missionTable.row(this).data();
    $('#unit_detail').val(data.base_unit);
    $('#input_no_detail').val(data.report_no);
    $('#unit_dispatch_detail').val(data.dispatch_unit);
    $('#mission_select_detail').val(data.mission_status);
    $('#num_select_detail').val(data.num);
    $('#input_location_detail').val(data.support_location);
    $('#input_remarks_detail').val(data.remarks);
    $('#input_read_status_detail').val(data.read_status);
    $('#input_dispatch_car_detail').val(data.dispatch_car_list==''?'尚未回報':data.dispatch_car_list);
    $('#input_site_condition_detail').val(data.site_condition==''?'尚未回報':data.site_condition);
    $('#input_flood_deep_detail').val(data.flood_deep==''?'尚未回報':data.flood_deep);
    $('#image_preview_detail').attr("src","./sitepics?mission_id="+data.mission_id);
    $('#DisasterDetailModal').modal('show');
  });
  refreshMissionTable();
  $("#btn_send_mission").on('click',function(e)
  {
    var selector=document.getElementById('unit_select');
    let base_unit=selector.options[selector.selectedIndex].text;
    selector=document.getElementById('unit_dispatch');
    let unit_dispatch=selector.options[selector.selectedIndex].text;
    selector=document.getElementById('mission_select');
    let mission_select=selector.options[selector.selectedIndex].text;
    selector=document.getElementById('num_select');
    let num_select=selector.options[selector.selectedIndex].text.split('輛')[0];
    var today = new Date();
    var hours=today.getHours()<10?'0'+today.getHours():today.getHours();
    var min=today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes();
    var sec=today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
    var datetime=today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+" "+hours + ":" + min + ":" +sec ;
    var data={
      "mission_id": uuidGenerator(),
      "base_unit": base_unit,
      "reportform_id": $("#input_no").val(),
      "dispatch_unit": unit_dispatch,
      "mission_status":mission_select,
      "pumpcar_num": num_select,
      "location": $("#input_location").val(),
      "remarks": $("#input_remarks").val(),
      "sender": clientUser.account,
      "create_time":datetime
    }
    $.post("./sendmission",data,function(result)
    {
      alert(result);
      document.getElementById('unit_select').selectedIndex=0;
      document.getElementById('unit_dispatch').selectedIndex=0;
      document.getElementById('mission_select').selectedIndex=0;
      document.getElementById('num_select').selectedIndex=0;
      $("#input_no").val("");
      $("#input_location").val("");
      $("#input_remarks").val("");
      $('#btn_close_mission').trigger( "click" );
      refreshMissionTable();
    });
  });
  $("#floatPost").on('click',function(e)
  {
    // $('#example123').DataTable();
  });

  $("#btn_logout").on('click',function(e)
  {
    socket.emit("logout",token);
  });
//-------begin of water level
  $("#level_0").on('click', function(e)
  {
    var layer =findLayerByID('WaterRealTime-0');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#level_0").css("background-color","#fff");
      $("#lv0").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#level_0").css("background-color","#dddfeb");
      $("#lv0").show(); 
    }
  });
  $("#level_1").on('click', function(e)
  {
    var layer =findLayerByID('WaterRealTime-1');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#level_1").css("background-color","#fff");
      $("#lv1").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#level_1").css("background-color","#dddfeb");
      $("#lv1").show();
    }
  });
  $("#level_2").on('click', function(e)
  {
    var layer =findLayerByID('WaterRealTime-2');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#level_2").css("background-color","#fff");
      $("#lv2").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#level_2").css("background-color","#dddfeb");
      $("#lv2").show();
    }
  });
  $("#level_3").on('click', function(e)
  {
    var layer =findLayerByID('WaterRealTime-3');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#level_3").css("background-color","#fff");
      $("#lv3").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#level_3").css("background-color","#dddfeb");
      $("#lv3").show();
    }
  });
  $("#level_noValue").on('click', function(e)
  {
    var layer =findLayerByID('WaterRealTime-noValue');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#level_noValue").css("background-color","#fff");
      $("#lvno").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#level_noValue").css("background-color","#dddfeb");
      $("#lvno").show();
    }
  });
  $("#level_all").on('click', function(e)
  {
    var allLayer=map.getLayers().getArray();
    for(var i in allLayer)
    {
      if(!allLayer[i].getVisible() && allLayer[i].get("id").includes("WaterRealTime"))
      {
        allLayer[i].setVisible(true);
      }
    }
    let elements = document.getElementsByName('layer');
    elements.forEach((element) => 
    {
      element.style.backgroundColor  = "#dddfeb";
    })
    // $("#lvAll").show();
    $("#lvno").show();
    $("#lv0").show();
    $("#lv1").show();
    $("#lv2").show();
    $("#lv3").show();
  });
  //-------end of water level

  //-------begin of rain
  $("#rainlevel_0").on('click', function(e)
  {
    var layer =findLayerByID('RainFallRealTime-0');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#rainlevel_0").css("background-color","#fff");
      $("#rainlv0").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#rainlevel_0").css("background-color","#dddfeb");
      $("#rainlv0").show(); 
    }
  });
  $("#rainlevel_1").on('click', function(e)
  {
    var layer =findLayerByID('RainFallRealTime-1');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#rainlevel_1").css("background-color","#fff");
      $("#rainlv1").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#rainlevel_1").css("background-color","#dddfeb");
      $("#rainlv1").show();
    }
  });
  $("#rainlevel_2").on('click', function(e)
  {
    var layer =findLayerByID('RainFallRealTime-2');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#rainlevel_2").css("background-color","#fff");
      $("#rainlv2").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#rainlevel_2").css("background-color","#dddfeb");
      $("#rainlv2").show();
    }
  });
  $("#rainlevel_noValue").on('click', function(e)
  {
    var layer =findLayerByID('RainFallRealTime-noValue');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#rainlevel_noValue").css("background-color","#fff");
      $("#rainlvno").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#rainlevel_noValue").css("background-color","#dddfeb");
      $("#rainlvno").show();
    }
  });
  $("#rainlevel_all").on('click', function(e)
  {
    var allLayer=map.getLayers().getArray();
    for(var i in allLayer)
    {
      if(!allLayer[i].getVisible() && allLayer[i].get("id").includes("RainFallRealTime"))
      {
        allLayer[i].setVisible(true);
      }
    }
    let elements = document.getElementsByName('rainlayer');
    elements.forEach((element) => 
    {
      element.style.backgroundColor  = "#dddfeb";
    })
    // $("#lvAll").show();
    $("#rainlvno").show();
    $("#rainlv0").show();
    $("#rainlv1").show();
    $("#rainlv2").show();
    $("#rainlv3").show();
  });
  //-------end of rain
  //begin of disaster
  $("#flooding_disaster").on('click', function(e)
  {
    var layer =findLayerByID('FloodingDisaster');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#flooding_disaster").css("background-color","#fff");
      $("#flooding").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#flooding_disaster").css("background-color","#dddfeb");
      $("#flooding").show();
    }
  });
//-------end of disaster
 //begin of cctv
  $("#cctv_pos").on('click', function(e)
  {
    var layer =findLayerByID('cctv');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#cctv_pos").css("background-color","#fff");
      $("#cctv").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#cctv_pos").css("background-color","#dddfeb");
      $("#cctv").show();
    }
  });
  $("#cctv_pos2").on('click', function(e)
  {
    var layer =findLayerByID('cctv2');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#cctv_pos2").css("background-color","#fff");
      $("#cctv2").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#cctv_pos2").css("background-color","#dddfeb");
      $("#cctv2").show();
    }
  });
  $("#cctv_all").on('click', function(e)
  {
    var allLayer=map.getLayers().getArray();
    for(var i in allLayer)
    {
      if(!allLayer[i].getVisible() && allLayer[i].get("id").includes("cctv"))
      {
        allLayer[i].setVisible(true);
      }
    }
    let elements = document.getElementsByName('cctvlayer');
    elements.forEach((element) => 
    {
      element.style.backgroundColor  = "#dddfeb";
    })
    $("#cctv").show();
    $("#cctv2").show();
  });
  //-------end of cctv
  //begin of volunteer
  $("#volunteer_pos").on('click', function(e)
  {
    var layer =findLayerByID('volunteer');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#volunteer_pos").css("background-color","#fff");
      $("#volunteer").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#volunteer_pos").css("background-color","#dddfeb");
      $("#volunteer").show();
    }
  });
  //-------end of volunteer
  //begin of social
  $("#social_pos").on('click', function(e)
  {
    var layer =findLayerByID('allSocialWelfareAgency');
    if(layer.getVisible())
    {
      layer.setVisible(false);
      $("#social_pos").css("background-color","#fff");
      $("#social").hide();
    }
    else
    {
      layer.setVisible(true);
      $("#social_pos").css("background-color","#dddfeb");
      $("#social").show();
    }
  });
  //-------end of social
    //begin of community
    $("#community_pos").on('click', function(e)
    {
      var layer =findLayerByID('community');
      if(layer.getVisible())
      {
        layer.setVisible(false);
        $("#community_pos").css("background-color","#fff");
        $("#community").hide();
      }
      else
      {
        layer.setVisible(true);
        $("#community_pos").css("background-color","#dddfeb");
        $("#community").show();
      }
    });
    //-------end of community
    //begin of floodingSensor
    $("#floodingSensorAlert").on('click', function(e)
    {
      var layer =findLayerByID('floodingSensorAlert');
      if(layer.getVisible())
      {
        layer.setVisible(false);
        $("#floodingSensorAlert").css("background-color","#fff");
        $("#sensorAlert").hide();
      }
      else
      {
        layer.setVisible(true);
        $("#floodingSensorAlert").css("background-color","#dddfeb");
        $("#sensorAlert").show();
      }
    });
    $("#floodingSensor").on('click', function(e)
    {
      var layer =findLayerByID('floodingSensor');
      if(layer.getVisible())
      {
        layer.setVisible(false);
        $("#floodingSensor").css("background-color","#fff");
        $("#sensor").hide();
      }
      else
      {
        layer.setVisible(true);
        $("#floodingSensor").css("background-color","#dddfeb");
        $("#sensor").show();
      }
    });
    $("#floodingSensor_all").on('click', function(e)
    {
      var allLayer=map.getLayers().getArray();
      for(var i in allLayer)
      {
        if(!allLayer[i].getVisible() && allLayer[i].get("id").includes("floodingSensor"))
        {
          allLayer[i].setVisible(true);
        }
      }
      let elements = document.getElementsByName('floodingSensorlayer');
      elements.forEach((element) => 
      {
        element.style.backgroundColor  = "#dddfeb";
      })
      $("#sensorAlert").show();
      $("#sensor").show();
    });
    //-------end of floodingSensor
    //begin of pump car
    $("#pump_pos").on('click', function(e)
    {
      var layer =findLayerByID('waterPumpCar');
      if(layer.getVisible())
      {
        layer.setVisible(false);
        $("#pump_pos").css("background-color","#fff");
        $("#pump").hide();
      }
      else
      {
        layer.setVisible(true);
        $("#pump_pos").css("background-color","#dddfeb");
        $("#pump").show();
      }
    });
    //-------end of pump car
    //begin of pumpStation
    $("#pumpStation_pos").on('click', function(e)
    {
      var layer =findLayerByID('waterPumpStation1');
      if(layer.getVisible())
      {
        layer.setVisible(false);
        $("#pumpStation_pos").css("background-color","#fff");
        $("#pumpStation1").hide();
      }
      else
      {
        layer.setVisible(true);
        $("#pumpStation_pos").css("background-color","#dddfeb");
        $("#pumpStation1").show();
      }
    });
    $("#pumpStation_pos2").on('click', function(e)
    {
      var layer =findLayerByID('waterPumpStation2');
      if(layer.getVisible())
      {
        layer.setVisible(false);
        $("#pumpStation_pos2").css("background-color","#fff");
        $("#pumpStation2").hide();
      }
      else
      {
        layer.setVisible(true);
        $("#pumpStation_pos2").css("background-color","#dddfeb");
        $("#pumpStation2").show();
      }
    });
    $("#pumpStation_all").on('click', function(e)
    {
      var allLayer=map.getLayers().getArray();
      for(var i in allLayer)
      {
        if(!allLayer[i].getVisible() && allLayer[i].get("id").includes("waterPumpStation"))
        {
          allLayer[i].setVisible(true);
        }
      }
      let elements = document.getElementsByName('pumpStationlayer');
      elements.forEach((element) => 
      {
        element.style.backgroundColor  = "#dddfeb";
      })
      $("#pumpStation1").show();
      $("#pumpStation2").show();
    });
    //-------end of pumpStation
}
function refreshMissionTable()
{
  missionList=undefined;
  missionTable.clear().draw();
  socket.emit("allMission");
}
function queryLayer(name)
{
    socket.emit('geo',name);
}
function createChart()
{
    var canvas = document.getElementById('chart');
    new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['水庫1', '水庫2', '水庫3', '水庫4', '水庫5'],
      datasets: [{
        label: '入流量',
        yAxisID: 'A',
        backgroundColor:"rgba(0,70,153, 1)",
        data: [500, 30, 10, 1500, 30]
      }, {
        label: '放流量',
        yAxisID: 'A',
        backgroundColor:"rgba(250, 145, 75, 1)",
        data: [-700, -50, -30, -800, -80]
      },{
        label: '滿水位差',
        yAxisID: 'B',
        backgroundColor:"rgba(149, 185,200, 1)",
        data: [4, 2, 15, 1, 18]
      },{
        label: '操作水位差',
        yAxisID: 'B',
        backgroundColor:"rgba(226, 157, 8, 1)",
        data: [3, 4, 5, 6, 8]
      }
      ]
    },
    options: {
    legend: {
        position: 'bottom'
      },
      scales: {
  xAxes: 
  [
        {
        stacked:false    
        } 
    ], 
        yAxes: [
        {
          id: 'A',
          type: 'linear',
          position: 'left', 
          labelString:'入/放流量(cms)',
          ticks: 
          {
            max: 6000,
            min: -1500,
          }
        }, 
        {
          id: 'B',
          type: 'linear',
          position: 'right',
          labelString:'水位差(m)',
          ticks: 
          {
            max: 120,
            min: 0,
            reverse: true
          }
        }
        ]
      },
      animation: 
      {
        onComplete: function() 
        {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function(bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x, bar._model.y-5);
            });
          });
        }       
      }
    }
  });
}
function createWaterLevelChart(data)
{
  document.getElementById('chartData').innerHTML='';
  if(data==null)
  {
    var chartContent=document.getElementById('chart');
    chartContent.innerHTML='<p class="centerP">此水位站無歷史資料</p>'
  }
  else
  {
    var config = 
    {
      type: 'line',
      data: 
      {
        labels: data.Hours.reverse(),
        datasets: [{
          label: '每小時水位值',
          backgroundColor: "#0073e6",
          borderColor: "#0073e6",
          data: data.WaterLevels.reverse(),
          fill: false,
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: '水位歷線圖'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: '小時'
            }
          }],
          yAxes: [{
            id:"y-axis-0",
            display: true,
            scaleLabel: {
              display: true,
              labelString: '水位值(m)'
            },
          }]
        },
      }
    };
  
      var annotation={};
      annotation.events=["click"];
      var annotations=[];
      var ticks={};
      if(data.alert1!=undefined)
      {
        var alert1Annotation={};
        alert1Annotation.drawTime="afterDatasetsDraw";
        alert1Annotation.id="alert1";
        alert1Annotation.type="line";
        alert1Annotation.mode="horizontal";
        alert1Annotation.scaleID="y-axis-0";
        alert1Annotation.value=data.alert1;
        alert1Annotation.borderColor="rgba(255,76,76,1)";
        alert1Annotation.borderWidth="3";
        alert1Annotation.label={backgroundColor: "rgba(255,76,76,1)",content: "一級警戒值 "+data.alert1+"m",enabled: true};
        alert1Annotation.onClick=function (e){console.log("Annotation", e.type, this);}
        annotations.push(alert1Annotation);
        ticks.max=Math.round(data.alert1)+5;
      }
      if(data.alert2!=undefined)
      {
        var alert2Annotation={};
        alert2Annotation.drawTime="afterDatasetsDraw";
        alert2Annotation.id="alert2";
        alert2Annotation.type="line";
        alert2Annotation.mode="horizontal";
        alert2Annotation.scaleID="y-axis-0";
        alert2Annotation.value=data.alert2;
        alert2Annotation.borderColor="rgb(255, 159, 64)";
        alert2Annotation.borderWidth="3";
        alert2Annotation.label={backgroundColor: "rgb(255, 159, 64)",content: "二級警戒值 "+data.alert2+"m",enabled: true};
        alert2Annotation.onClick=function (e){console.log("Annotation", e.type, this);}
        annotations.push(alert2Annotation);
        if(data.alert1==undefined)
        {
          ticks.max=Math.round(data.alert2)+5;
        }
      }
      if(data.alert3!=undefined)
      {
        var alert3Annotation={};
        alert3Annotation.drawTime="afterDatasetsDraw";
        alert3Annotation.id="alert3";
        alert3Annotation.type="line";
        alert3Annotation.mode="horizontal";
        alert3Annotation.scaleID="y-axis-0";
        alert3Annotation.value=data.alert3;
        alert3Annotation.borderColor="rgb(255, 205, 86)";
        alert3Annotation.borderWidth="3";
        alert3Annotation.label={backgroundColor: "rgb(255, 205, 86)",content: "三級警戒值 "+data.alert3+"m",enabled: true};
        alert3Annotation.onClick=function (e){console.log("Annotation", e.type, this);}
        annotations.push(alert3Annotation);
        if(data.alert1==undefined && data.alert2==undefined)
        {
          ticks.max=Math.round(data.alert3)+5;
        }
      }
      if(data.alert1==undefined && data.alert2==undefined  && data.alert3==undefined) 
      {
        var maxValue=Math.max(...data.WaterLevels);
        ticks.max=Math.round(maxValue)+2;
        var minValue=Math.min(...data.WaterLevels)
        ticks.min=Math.round(minValue)-2;
        config.options.scales.yAxes[0].ticks=ticks;
      }
      else if(data.alert1!=undefined || data.alert2!=undefined  || data.alert3!=undefined)
      {
        var minValue=Math.min(...data.WaterLevels)
        ticks.min=Math.round(minValue)-5;
        config.options.scales.yAxes[0].ticks=ticks;
      }

      if(annotations.length>0)
      {
        annotation.annotations=annotations;
        config.options.annotation=annotation;
      }
      var ctx = document.getElementById('chartData').getContext('2d');
      new Chart(ctx, config);
      document.getElementById('chartData').style.backgroundColor="white";
      document.getElementById('chartData').style.width="600px";
      document.getElementById('chartData').style.height="400px";
  }
  }
  function createFloodingSensorChart(data)
  {
    document.getElementById('chartData').innerHTML='';
    if(data==null)
    {
      var chartContent=document.getElementById('chart');
      chartContent.innerHTML='<p class="centerP">此淹水感測器無歷史資料</p>'
    }
    else
    {
      data.sort(function(a,b){
        return new Date(b.SourceTime) - new Date(a.SourceTime);
      });
      var reverseData=data.reverse();
      var times=[];
      var values=[];
      for(var temp in reverseData)
      {
        times.push(new Date(reverseData[temp].SourceTime).getHours());
        values.push(reverseData[temp].Depth);
      }
      var config = 
      {
        type: 'line',
        data: 
        {
          labels: times,
          datasets: [{
            label: '每小時深度(cm)',
            backgroundColor: "#0073e6",
            borderColor: "#0073e6",
            data: values,
            fill: false,
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: '感測歷線圖'
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: '時'
              }
            }],
            yAxes: [{
              id:"y-axis-0",
              display: true,
              scaleLabel: {
                display: true,
                labelString: '深度(cm)'
              },
            }]
          },
        }
      };
    
        var annotation={};
        annotation.events=["click"];
        var annotations=[];
        var ticks={};
        //add 10cm alert line
        var alert1Annotation={};
        alert1Annotation.drawTime="afterDatasetsDraw";
        alert1Annotation.id="alert1";
        alert1Annotation.type="line";
        alert1Annotation.mode="horizontal";
        alert1Annotation.scaleID="y-axis-0";
        alert1Annotation.value=10;
        alert1Annotation.borderColor="rgba(255,76,76,1)";
        alert1Annotation.borderWidth="3";
        alert1Annotation.label={backgroundColor: "rgba(255,76,76,1)",content: "警戒值 "+10+"cm",enabled: true};
        alert1Annotation.onClick=function (e){console.log("Annotation", e.type, this);}
        annotations.push(alert1Annotation);
        //set max and min value
        ticks.max=Math.max(...values)>10?Math.round(Math.max(...values))+5:15
        ticks.min=Math.min(...values);
        config.options.scales.yAxes[0].ticks=ticks;

        annotation.annotations=annotations;
        config.options.annotation=annotation;

        var ctx = document.getElementById('chartData').getContext('2d');
        new Chart(ctx, config);
        document.getElementById('chartData').style.backgroundColor="white";
        document.getElementById('chartData').style.width="600px";
        document.getElementById('chartData').style.height="400px";
    }
  }
  
  function find10kmRelativeEvent(centerPoint,eventType,id)
  {
    var relativeEvents={};
    var waterLevel=[];
    var rainfall=[];
    var floodingDisasters=[];
    var cctvStation=[];
    var cctv2Station=[];
    var volunteers=[];
    var social=[];
    var community=[];
    var floodingSensor=[];
    var waterPumpCar=[];
    var waterPumpStation1=[];
    var waterPumpStation2=[];
    for(var key in featuresData)
    {
      var data=featuresData[key];
 
      if(key==eventType)
      {
        continue;
      }
      else
      {
        switch(key)
        {
          case "WaterRealTime":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                waterLevel.push(data[i]);
              }
            }
            // waterLevel.sort(function (a, b) {
            //   return a.km - b.km;
            // });
          break;
          case "RainFallRealTime":
          
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                rainfall.push(data[i]);
              }
            }
            // rainfall.sort(function (a, b) {
            //   return a.km - b.km;
            // });
          break;
          case "FloodingDisaster":
            for(var value in data)
            {
              var temp=data[value];
              for(var k=0;k<temp.disasterFloodings.length;k++)
              {
                var km=calculateDistanceInKm(temp.disasterFloodings[k].lat,temp.disasterFloodings[k].lon,centerPoint.lat,centerPoint.lon);
                if(km<=10)
                {
                  temp.disasterFloodings[k].km=km;
                  floodingDisasters.push(temp.disasterFloodings[k]);
                }
              }
            }
          //  floodingDisasters.sort(function (a, b) {
          //   return a.km - b.km;
          // });
          break;
          case "cctv":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                cctvStation.push(data[i]);
              }
            }
            // cctvStation.sort(function (a, b) {
            //   return a.km - b.km;
            // });
          break;
          case "cctv2":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                cctv2Station.push(data[i]);
              }
            }
          break;
          case "volunteer":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                volunteers.push(data[i]);
              }
            }
            // volunteers.sort(function (a, b) {
            //   return a.km - b.km;
            // });
          break;
          case "allSocialWelfareAgency":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                social.push(data[i]);
              }
            }
            // social.sort(function (a, b) {
            //   return a.km - b.km;
            // });
          break;
          case "community":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                community.push(data[i]);
              }
            }
            // community.sort(function (a, b) {
            //   return a.km - b.km;
            // });
          break;
          case "floodingSensor":
            for(var i in data)
            {
              var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
              if(km<=10)
              {
                data[i].km=km;
                floodingSensor.push(data[i]);
              }
            }
            // community.sort(function (a, b) {
            //   return a.km - b.km;
            // });
            break;
            case "waterPumpCar":
              for(var i in data)
              {
                var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
                if(km<=10)
                {
                  data[i].km=km;
                  waterPumpCar.push(data[i]);
                }
              }
              // community.sort(function (a, b) {
              //   return a.km - b.km;
              // });
            break;
            case "waterPumpStation1":
              for(var i in data)
              {
                var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
                if(km<=10)
                {
                  data[i].km=km;
                  waterPumpStation1.push(data[i]);
                }
              }
              // community.sort(function (a, b) {
              //   return a.km - b.km;
              // });
            break;
            case "waterPumpStation2":
              for(var i in data)
              {
                var km=calculateDistanceInKm(data[i].lat,data[i].lon,centerPoint.lat,centerPoint.lon);
                if(km<=10)
                {
                  data[i].km=km;
                  waterPumpStation2.push(data[i]);
                }
              }
              // community.sort(function (a, b) {
              //   return a.km - b.km;
              // });
            break;
        } 
        
      }
    }
    relativeEvents.waterRealTime=waterLevel;
    relativeEvents.rainFallRealTime=rainfall;
    relativeEvents.floodingDisaster=floodingDisasters;
    relativeEvents.cctv=cctvStation;
    relativeEvents.cctv2=cctv2Station;
    relativeEvents.volunteer=volunteers;
    relativeEvents.allSocialWelfareAgency=social;
    relativeEvents.community=community;
    relativeEvents.floodingSensor=floodingSensor;
    relativeEvents.waterPumpCar=waterPumpCar;
    relativeEvents.waterPumpStation1=waterPumpStation1;
    relativeEvents.waterPumpStation2=waterPumpStation2;
   // console.log(JSON.stringify(relativeEvents));
    return relativeEvents;
  }
  function calculateDistanceInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return +(Math.round(d + "e+1")  + "e-1");
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
})
function uuidGenerator() 
{
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
