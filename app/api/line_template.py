import os
from datetime import datetime

from linebot.models import ButtonsTemplate, URIAction, TemplateSendMessage, BubbleContainer, ImageComponent, \
    BoxComponent, TextComponent, IconComponent, SpacerComponent, ButtonComponent, SeparatorComponent, FlexSendMessage

# wra_baseuri = 'http://ncsist.wrapoc.tk'

webhook_baseuri = os.getenv('webhook_baseuri')
wra_baseuri = os.getenv('wra_baseuri')
wra_register = os.getenv('wra_register')
image_sign_static = os.getenv('image_sign_static')
image_register_static = os.getenv('image_register_static')

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


def flexReportMessageTemplate(jsonObj):
    create_time_str = datetime.strptime(jsonObj['create_time'], '%Y/%m/%d %H:%M:%S').strftime('%Y/%m/%d %H:%M')
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
                            "url": webhook_baseuri + "/static/images/warning.png"
                        },
                        {
                            "type": "text",
                            "text": "派遣任務",
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
            "url": webhook_baseuri + "/static/images/logo.png",
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
                                            "url": webhook_baseuri + "/static/images/iconswater30.png"
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
                                            "text": jsonObj['base_unit'] + " - " + jsonObj['reportform_id'],
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
                                            "url": webhook_baseuri + "/static/images/iconswater30.png"
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
                                            "url": webhook_baseuri + "/static/images/iconswater30.png"
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
                                            "text": jsonObj['dispatch_unit'],
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
                                            "url": webhook_baseuri + "/static/images/iconswater30.png"
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
                                            "text": jsonObj['mission_status'],
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
                                            "url": webhook_baseuri + "/static/images/iconswater30.png"
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
                                            "text": jsonObj['pumpcar_num'] + " (輛)",
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
                                            "url": webhook_baseuri + "/static/images/iconswater30.png"
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
                                            "text": jsonObj['remarks'],
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
                        #"uri": wra_baseuri + "/reportpage?mission_id=" + 'db1a102d-5be6-4cfa-8f0a-8788146bb584'
                        "uri":"https://liff.line.me/1654967293-75RpAzOp?mission_id=" + 'db1a102d-5be6-4cfa-8f0a-8788146bb584'
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
    message = FlexSendMessage(alt_text="派遣任務:" + jsonObj['reportform_id'] + " (" + create_time_str + ")",
                              contents=bubble)
    return message


# jsonObj['mission_id']

def flexReportMessageTemlate(user_id):
    bubble = BubbleContainer(
        direction='ltr',
        hero=ImageComponent(
            url=webhook_baseuri + '/static/images/sign_icon.png',
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
