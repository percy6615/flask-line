from linebot.models import ButtonsTemplate, URIAction, TemplateSendMessage, BubbleContainer, ImageComponent, \
    BoxComponent, TextComponent, IconComponent, SpacerComponent, ButtonComponent, SeparatorComponent, FlexSendMessage

wra_baseuri = 'http://ncsist.wrapoc.tk'
wra_register = '/registration?openExternalBrowser=1&sender='
webhook_baseuri = 'https://lineapplicationwra.zapto.org'
image_sign_static = '/static/images/sign_icon.png'
image_register_static = '/static/images/register.jpg'

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

def flexReportMessageTemlate(user_id):
    bubble = BubbleContainer(
        direction='ltr',
        hero=ImageComponent(
            url=webhook_baseuri+'/static/images/sign_icon.png',
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
