from linebot.models import ButtonsTemplate, URIAction, TemplateSendMessage


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