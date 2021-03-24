import os
from datetime import datetime

from linebot.models import ButtonsTemplate, URIAction, TemplateSendMessage, BubbleContainer, ImageComponent, \
    BoxComponent, TextComponent, IconComponent, ButtonComponent, SeparatorComponent, FlexSendMessage

# wra_baseuri = 'http://ncsist.wrapoc.tk'
from app import webhook_baseuri, image_register_static, wra_baseuri, wra_register


def buttonRegisterTemplate(user_id):
    button_template = ButtonsTemplate(
        thumbnail_image_url=webhook_baseuri + image_register_static,
        text='請點擊註冊',
        actions=[
            URIAction(
                label='確定',
                uri=wra_baseuri + wra_register + str(user_id)
            )
        ]
    )
    template_message = TemplateSendMessage(
        alt_text='註冊帳號', template=button_template)
    return template_message

def isNoneReturnDash(val):
    if isinstance(val,str) and (val=="" or val==None):
        return '-'

    elif isinstance(val,int) and val==None:
        return '0'
    else:
        return val

def isTimeFormat(input):
    print(input)
    try:
        return datetime.strptime(input, '%Y-%m-%d %H:%M:%S').strftime('%Y/%m/%d %H:%M')
    except ValueError:
        try:
            return datetime.strptime(input, '%Y-%m-%dT%H:%M:%S').strftime('%Y/%m/%d %H:%M')
        except ValueError:
            try:
                return datetime.strptime(input, '%Y/%m/%d %H:%M:%S').strftime('%Y/%m/%d %H:%M')
            except ValueError:
                return '-'


def flexReportMessageTemplate(jsonObj):
    if(jsonObj['mission_id']==None):
        return None
    create_time_str = isTimeFormat(jsonObj['create_time'])
    bubble = {
        "type": "bubble",
        "header": {
            "type": "box",
            "layout": "vertical",
            "flex": 0,
            "backgroundColor": "#FAFAFAFA",
            "contents": [
                {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "icon",
                            "url": webhook_baseuri + "/static/images/sys/warning.png"
                        },
                        {
                            "type": "text",
                            "text": "機具派遣",
                            "weight": "bold",
                            "size": "lg",
                            "color": "#FB0000FF",
                            "align": "start",
                            "contents": []
                        },
                        {
                            "type": "text",
                            "text": create_time_str,
                            "weight": "regular",
                            "size": "xxs",
                            "color": "#000000FF",
                            "align": "end",
                            "contents": []
                        }
                    ]
                },
                {
                    "type": "separator",
                    "margin": "xs",
                    "color": "#4D4D48FF"
                }
            ]
        },
        "hero": {
            "type": "image",
            "url": webhook_baseuri + "/static/images/sys/logo.png",
            "size": "full",
            "aspectRatio": "20:9",
            "aspectMode": "cover",
            "action": {
                "type": "uri",
                "label": "Line",
                "uri": "https://linecorp.com/"
            }
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "backgroundColor": "#FAFAFAFA",
            "contents": [
                {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "margin": "none",
                    "position": "relative",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "依據",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "wrap": True,
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isNoneReturnDash(jsonObj['base_unit']) + " - " + isNoneReturnDash(jsonObj['reportform_id']),
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "支援地點",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isNoneReturnDash(jsonObj['location']),
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "派遣單位",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "margin": "xs",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isNoneReturnDash(jsonObj['dispatch_unit']),
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "任務狀態",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isNoneReturnDash(jsonObj['mission_status']),
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "抽水車需求",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isNoneReturnDash(jsonObj['pumpcar_num']) + " (輛)",
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "備註",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "none",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isNoneReturnDash(jsonObj['remarks']),
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "flex": 0,
            "backgroundColor": "#FAFAFAFA",
            "contents": [
                {
                    "type": "button",
                    "action": {
                        "type": "uri",
                        "label": "回報資訊",
                        # "uri": wra_baseuri + "/reportpage?mission_id=" + jsonObj['mission_id']
                        "uri": "https://liff.line.me/1654967293-75RpAzOp?mission_id=" + jsonObj['mission_id']
                    },
                    "color": "#64AAFFFF",
                    "height": "sm",
                    "style": "primary",
                    "gravity": "top"
                },
                # {
                #     "type": "separator",
                #     "margin": "md"
                # },
                # {
                #     "type": "button",
                #     "action": {
                #         "type": "postback",
                #         "label": "我要回報",
                #         "data": "ping"
                #     },
                #     "color": "#64AAFFFF",
                #     "margin": "xs",
                #     "height": "sm",
                #     "style": "primary"
                # }
            ]
        }
    }
    message = FlexSendMessage(alt_text="機具派遣:" + jsonObj['reportform_id'] + " (" + create_time_str + ")",
                              contents=bubble)
    return message


# jsonObj['mission_id']


def flexDispatchDisaster(jsonObj):
    create_time_str = isTimeFormat(jsonObj['time'])
    disasterSource = {1: "經濟部水利署", 2: "消防署", 3: "傳播媒體", 4: "NCDR", 6: "水規所", 7: "APP災情通報", 8: "第一河川局", 9: "第二河川局",
                      10: "第四河川局", 11: "第五河川局", 12: "第六河川局", 13: "第七河川局", 14: "第十河川局", 15: "宜蘭縣政府", 16: "台南市政府",
                      17: "屏東縣政府"}
    disasterDesc = {1: "河川局", 2: "防護志工", 3: "其他", 4: "EMIC", 5: "新聞媒體", 6: "輿情資料", 7: "淹水感測", 8: "智慧水尺", 9: "語音通話"}
    disasterType = {1: "道路", 2: "房屋積淹水", 3: "工(商)業區", 4: "農田/魚塭", 5: "其他", 6: '待查', 14: "房屋地下室積水", 15: "地區積淹水",
                    16: "地下道積水"}


    sourceCode = jsonObj['sourceCode']
    if sourceCode in disasterSource:
        sourceCode = disasterSource[sourceCode]
    else:
        sourceCode = "-"

    categoryCode = jsonObj['categoryCode']
    if categoryCode in disasterDesc:
        categoryCode = disasterDesc[categoryCode]
    else:
        categoryCode = "-"

    dtype = jsonObj['type']
    if dtype in disasterType:
        dtype = disasterType[dtype]
    else:
        dtype = "-"

    isReceded = jsonObj['isReceded']
    if isReceded:
        isReceded = "是"
    else:
        isReceded = "否"

    for key in jsonObj:
        if jsonObj[key]=="":
            jsonObj[key] = "-"
        if type(jsonObj[key])!="str":
            jsonObj[key] = str(jsonObj[key])
    bubble = {
        "type": "bubble",
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "none",
            "margin": "none",
            "backgroundColor": "#FAFAFAFA",
            "contents": [
                {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "icon",
                            "url": webhook_baseuri + "/static/images/sys/warning.png"
                        },
                        {
                            "type": "text",
                            "text": "災情通知",
                            "weight": "bold",
                            "size": "lg",
                            "color": "#FB0000FF",
                            "align": "start",
                            "contents": []
                        },
                        {
                            "type": "text",
                            "text": create_time_str,
                            "weight": "regular",
                            "size": "xxs",
                            "color": "#000000FF",
                            "align": "end",
                            "contents": []
                        }
                    ]
                },
                {
                    "type": "separator",
                    "margin": "none",
                    "color": "#4D4D48FF"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "margin": "lg",
                    "position": "relative",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災情種類",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "wrap": True,
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": dtype,
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災情分區",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": jsonObj['operatorName'],
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災害地點",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": jsonObj['location'],
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災情描述",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "margin": "xs",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": jsonObj['situation'],
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災情處置情形",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": jsonObj['treatment'],
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#61696BFF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "淹水深度",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "none",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": jsonObj['depth'],
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "是否退水",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "none",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isReceded ,
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "退水時間",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "none",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": isTimeFormat(jsonObj['recededDate']),
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災情說明",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "none",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": sourceCode,
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "contents": [
                                        {
                                            "type": "icon",
                                            "url": webhook_baseuri + "/static/images/sys/iconswater30.png"
                                        },
                                        {
                                            "type": "text",
                                            "text": "災情來源",
                                            "size": "sm",
                                            "color": "#7EA2F2FF",
                                            "align": "start",
                                            "gravity": "top",
                                            "decoration": "underline",
                                            "contents": []
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "none",
                                    "margin": "sm",
                                    "contents": [
                                        {
                                            "type": "spacer",
                                            "size": "xxl"
                                        },
                                        {
                                            "type": "text",
                                            "text": categoryCode,
                                            "weight": "bold",
                                            "size": "sm",
                                            "color": "#666666FF",
                                            "align": "start",
                                            "gravity": "bottom",
                                            "margin": "xxl",
                                            "wrap": True,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    print(bubble)
    message = FlexSendMessage(alt_text="災情通知" + " (" + create_time_str + ")",
                              contents=bubble)

    return message


def flexReportMessageTemlate(user_id):
    bubble = BubbleContainer(
        direction='ltr',
        hero=ImageComponent(
            url=webhook_baseuri + '/static/images/sys/sign_icon.png',
            size='full',
            aspect_ratio='20:13',
            aspect_mode='cover',
            action=URIAction(uri='http://example.com', label='label')
        ),
        body=BoxComponent(
            layout='vertical',
            contents=[
                # title
                TextComponent(text='Brown Cafe', weight='bold', size='xl'),
                # review
                BoxComponent(
                    layout='baseline',
                    margin='md',
                    contents=[
                        IconComponent(size='sm', url='https://example.com/gold_star.png'),
                        IconComponent(size='sm', url='https://example.com/grey_star.png'),
                        IconComponent(size='sm', url='https://example.com/gold_star.png'),
                        IconComponent(size='sm', url='https://example.com/gold_star.png'),
                        IconComponent(size='sm', url='https://example.com/grey_star.png'),
                        TextComponent(text='4.0', size='sm', color='#999999', margin='md',
                                      flex=0)
                    ]
                ),
                # info
                BoxComponent(
                    layout='vertical',
                    margin='lg',
                    spacing='sm',
                    contents=[
                        BoxComponent(
                            layout='baseline',
                            spacing='sm',
                            contents=[
                                TextComponent(
                                    text='Place',
                                    color='#aaaaaa',
                                    size='sm',
                                    flex=1
                                ),
                                TextComponent(
                                    text='Shinjuku, Tokyo',
                                    wrap=True,
                                    color='#666666',
                                    size='sm',
                                    flex=5
                                )
                            ],
                        ),
                        BoxComponent(
                            layout='baseline',
                            spacing='sm',
                            contents=[
                                TextComponent(
                                    text='Time',
                                    color='#aaaaaa',
                                    size='sm',
                                    flex=1
                                ),
                                TextComponent(
                                    text="10:00 - 23:00",
                                    wrap=True,
                                    color='#666666',
                                    size='sm',
                                    flex=5,
                                ),
                            ],
                        ),
                    ],
                )
            ],
        ),
        footer=BoxComponent(
            layout='vertical',
            spacing='sm',
            contents=[
                # callAction, separator, websiteAction
                SpacerComponent(size='sm'),
                # callAction
                ButtonComponent(
                    style='link',
                    height='sm',
                    action=URIAction(label='CALL', uri='tel:000000'),
                ),
                # separator
                SeparatorComponent(),
                # websiteAction
                ButtonComponent(
                    style='link',
                    height='sm',
                    action=URIAction(label='WEBSITE', uri="https://example.com")
                )
            ]
        ),
    )
    message = FlexSendMessage(alt_text="hello", contents=bubble)
    return message
