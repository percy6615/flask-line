import errno
import json
import logging
import os
import sys
import tempfile

import requests
from flask import request, send_from_directory, Response
from flask_restful import Resource, abort
from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    LineBotApiError, InvalidSignatureError
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    SourceUser, SourceGroup, SourceRoom,
    TemplateSendMessage, ConfirmTemplate, MessageAction,
    ButtonsTemplate, ImageCarouselTemplate, ImageCarouselColumn, URIAction,
    PostbackAction, DatetimePickerAction,
    CameraAction, CameraRollAction, LocationAction,
    CarouselTemplate, CarouselColumn, PostbackEvent,
    StickerMessage, StickerSendMessage, LocationMessage, LocationSendMessage,
    ImageMessage, VideoMessage, AudioMessage, FileMessage,
    UnfollowEvent, FollowEvent, JoinEvent, LeaveEvent, BeaconEvent,
    MemberJoinedEvent, MemberLeftEvent,
    FlexSendMessage, BubbleContainer, ImageComponent, BoxComponent,
    TextComponent, SpacerComponent, IconComponent, ButtonComponent,
    SeparatorComponent, QuickReply, QuickReplyButton,
    ImageSendMessage)
from werkzeug.utils import redirect

from .line_template import buttonRegisterTemplate, flexReportMessageTemlate
from .. import register_man, FlaskApp, GlobalInMem

from ..model.event_handle import FollowEventHandle, JoinEventHandle

channel_secret = os.getenv('channel_secret')
channel_access_token = os.getenv('channel_access_token')

if channel_secret is None or channel_access_token is None:
    print('Specify LINE_CHANNEL_SECRET and LINE_CHANNEL_ACCESS_TOKEN as environment variables.')
    sys.exit(1)
line_bot_api = LineBotApi(channel_access_token)
handler = WebhookHandler(channel_secret)

# static_tmp_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static', 'tmp')
static_tmp_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'tmp')


# function for create tmp dir for download content
def make_static_tmp_dir():
    try:
        os.makedirs(static_tmp_path)
        print('make_static_tmp_dir')
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(static_tmp_path):
            pass
        else:
            raise


class LineControllerPro(Resource):

    def __init__(self, *args, **kwargs):
        # super().__init__(*args, **kwargs)
        # self.static_tmp_path = kwargs.get('static_tmp_path')
        make_static_tmp_dir()

    def post(self):
        # get X-Line-Signature header value
        signature = request.headers['X-Line-Signature']
        # get request body as text
        body = request.get_data(as_text=True)
        json_body = request.get_json()
        eventType = json_body['events'][0]['type']
        notNeedRestricted = ["unfollow", "follow", "leave", "join", "memberLeft", "memberJoined"]
        if eventType not in notNeedRestricted:
            eventSourceUserId = json_body['events'][0]['source']['userId']
            eventSourceType = json_body['events'][0]['source']['type']
            eventreplytoken = json_body['events'][0]['replyToken']
            if eventSourceType == 'user':
                print()
                # if not self.isUserRegister(eventSourceUserId):
                #     line_bot_api.reply_message(
                #         eventreplytoken,
                #         [TextSendMessage(text="沒註冊本系統，請點選註冊，謝謝。"), buttonRegisterTemplate(eventSourceUserId)])
                #     return
            elif eventSourceType == 'group':
                if not self.isUserRegister(eventSourceUserId):
                    print()
                    # profile = line_bot_api.get_profile(eventSourceUserId)
                    # line_bot_api.reply_message(
                    #     eventreplytoken, [
                    #         TextSendMessage(text="麻煩您註冊本系統")
                    #         ,
                    #     ]
                    # )
                    # line_bot_api.reply_message(
                    #     eventreplytoken,
                    #     [TextSendMessage(text="請加入機器人，謝謝。"), buttonRegisterTemplate(eventSourceUserId)])
                    # return
            elif eventSourceType == 'room':
                if not self.isUserRegister(eventSourceUserId):
                    # line_bot_api.reply_message(
                    #     eventreplytoken,
                    #     [TextSendMessage(text="請加入機器人，謝謝。"), buttonRegisterTemplate(eventSourceUserId)])
                    return

        logging.info("Request body: " + body)
        # handle webhook body
        try:
            handler.handle(body, signature)
        except LineBotApiError as e:
            print("Got exception from LINE Messaging API: %s\n" % e.message)
            for m in e.error.details:
                print("  %s: %s" % (m.property, m.message))
            print("\n")
        except InvalidSignatureError:
            abort(400)
        return 'ok'

    def get(self):
        pass
        # line_bot_api.push_message('C13484d958428ce83eba10808c44bbe34', TextSendMessage(text='Hello World!'))

        url = "https://notify-api.line.me/api/notify"
        data = {'message': 'We did it!'}
        headers = {'Authorization': 'Bearer ' + '1rU2omMOA2884DVB6Bx119ESfNoWyrO0bIchGjDrwtK'}
        r = requests.post(url, data=data, headers=headers)

        return r.status_code

    @handler.add(MessageEvent, message=TextMessage)
    def handle_text_message(event):
        text = event.message.text
        if isinstance(event.source, SourceUser):
            if text == 'test':
                # line_bot_api.reply_message(
                #     event.reply_token, TextSendMessage(text=wrauri + str(event.source.user_id)))
                # confirm_template = ConfirmTemplate(text='註冊阿，叫你註冊是沒聽到逆!', actions=[
                #     URIAction(label='確定', uri=wrauri + str(event.source.user_id)),
                #     MessageAction(label='取消', text='No!')
                # ])
                template_message = buttonRegisterTemplate(event.source.user_id)
                line_bot_api.reply_message(event.reply_token, flexReportMessageTemlate(''))

            if text == 'profile':
                profile = line_bot_api.get_profile(event.source.user_id)
                line_bot_api.reply_message(
                    event.reply_token, [
                        TextSendMessage(text='Display name: ' + profile.display_name),
                        TextSendMessage(text='Status message: ' + str(profile.status_message)),
                    ]
                )
            if 'message#' in text:
                talk = text.split('message#', 1)
                # if talk.__len__ > 1:
                # line_bot_api.reply_message(
                #     event.reply_token, [
                #         TextSendMessage(text=talk[1]),
                #
                #     ]
                # )
                url = "https://notify-api.line.me/api/notify"
                data = {'message': talk[1]}
                headers = {'Authorization': 'Bearer ' + 'Ri4qeh6l4hSlhEuydMpZ7nbE67TpwUirKEiurgEuhtn'}
                r = requests.post(url, data=data, headers=headers)
        elif isinstance(event.source, SourceGroup):
            profile = line_bot_api.get_group_summary(event.source.group_id)
            grpid = line_bot_api.get_group_member_profile(user_id=event.source.user_id, group_id=event.source.group_id)
            count = line_bot_api.get_group_members_count(group_id=event.source.group_id)
            # ids = line_bot_api.get_group_member_ids(group_id=event.source.group_id)#$$$$$$

            # line_bot_api.reply_message(
            #     event.reply_token, [
            #         TextSendMessage(text="" ),
            #
            #     ]
            # )
        elif isinstance(event.source, SourceRoom):
            pass
        else:
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text="Bot can't use profile API without user ID"))

    @handler.add(MessageEvent, message=LocationMessage)
    def handle_location_message(event):
        if isinstance(event.source, SourceUser):
            line_bot_api.reply_message(
                event.reply_token,
                LocationSendMessage(
                    title='Location', address=event.message.address,
                    latitude=event.message.latitude, longitude=event.message.longitude
                )
            )
        elif isinstance(event.source, SourceGroup):
            pass
        elif isinstance(event.source, SourceRoom):
            pass

    @handler.add(MessageEvent, message=StickerMessage)
    def handle_sticker_message(event):
        if isinstance(event.source, SourceUser):
            line_bot_api.reply_message(
                event.reply_token,
                StickerSendMessage(
                    package_id=event.message.package_id,
                    sticker_id=event.message.sticker_id)
            )
        elif isinstance(event.source, SourceGroup):
            pass
        elif isinstance(event.source, SourceRoom):
            pass

    # Other Message Type
    @handler.add(MessageEvent, message=(ImageMessage, VideoMessage, AudioMessage))
    def handle_content_message(event):
        if isinstance(event.source, SourceUser):
            if isinstance(event.message, ImageMessage):
                ext = 'jpg'
            elif isinstance(event.message, VideoMessage):
                ext = 'mp4'
            elif isinstance(event.message, AudioMessage):
                ext = 'm4a'
            else:
                return
            message_content = line_bot_api.get_message_content(event.message.id)
            with tempfile.NamedTemporaryFile(dir=static_tmp_path, prefix=ext + '-', delete=False) as tf:
                for chunk in message_content.iter_content():
                    tf.write(chunk)
                temple_path = tf.name

            dist_path = temple_path + '.' + ext
            dist_name = os.path.basename(dist_path)
            os.rename(temple_path, dist_path)
            url = request.host_url + os.path.join('static', 'tmp', dist_name)
            url = url.replace('\\', '/')
            line_bot_api.reply_message(
                event.reply_token, [
                    TextSendMessage(text='Save content.'),
                    TextSendMessage(text=url)
                ])
        elif isinstance(event.source, SourceGroup):
            pass
        elif isinstance(event.source, SourceRoom):
            pass

    @handler.add(MessageEvent, message=FileMessage)
    def handle_file_message(event):
        if isinstance(event.source, SourceUser):
            message_content = line_bot_api.get_message_content(event.message.id)
            with tempfile.NamedTemporaryFile(dir=static_tmp_path, prefix='file-', delete=False) as tf:
                for chunk in message_content.iter_content():
                    tf.write(chunk)
                temple_path = tf.name

            dist_path = temple_path + '-' + event.message.file_name
            dist_name = os.path.basename(dist_path)
            os.rename(temple_path, dist_path)
            url = request.host_url + os.path.join('static', 'tmp', dist_name)
            url = url.replace('\\', '/')
            line_bot_api.reply_message(
                event.reply_token, [
                    TextSendMessage(text='Save file.'),
                    TextSendMessage(text=url)
                ])
        elif isinstance(event.source, SourceGroup):
            pass
        elif isinstance(event.source, SourceRoom):
            pass

    @handler.add(FollowEvent)
    def handle_follow(event):
        logging.info("Got Follow event:" + event.source.user_id)
        # app.logger.info("Got Follow event:" + event.source.user_id)
        profile = line_bot_api.get_profile(event.source.user_id)
        followHandle = FollowEventHandle(event, profile, channel_access_token)
        followHandle.saveUserEvent("disaster_userlist", followHandle.to_json()['data'])
        # register_man[event.source.user_id] =
        template_message = buttonRegisterTemplate(event.source.user_id)
        line_bot_api.reply_message(
            event.reply_token, template_message)

    @handler.add(UnfollowEvent)
    def handle_unfollow(event):
        FollowEventHandle(event, None, channel_access_token).deleteEvent()
        # logging.info("Got Unfollow event:" + event.source.user_id)
        # app.logger.info("Got Unfollow event:" + event.source.user_id)

    @handler.add(JoinEvent)
    def handle_join(event):
        summary = line_bot_api.get_group_summary(event.source.group_id)
        joinHandle = JoinEventHandle(event, summary, channel_access_token)
        joinHandle.saveUserEvent("disaster_userlist", joinHandle.to_json()['data'])
        # profile = line_bot_api.get_group_member_profile(groupidid)
        # dataEventHandle = DataEventHandle(event, profile)
        # line_bot_api.get_group_member_ids();
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text='Joined this ' + event.source.type + summary.group_name))

    @handler.add(LeaveEvent)
    def handle_leave(event):
        print(event)
        joinHandle = JoinEventHandle(event, None, channel_access_token)
        joinHandle.deleteEvent()
        logging.info("Got leave event")
        # app.logger.info("Got leave event")

    @handler.add(PostbackEvent)
    def handle_postback(event):
        if event.postback.data == 'ping':
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text='pong'))
        elif event.postback.data == 'datetime_postback':
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text=event.postback.params['datetime']))
        elif event.postback.data == 'date_postback':
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text=event.postback.params['date']))

    @handler.add(BeaconEvent)
    def handle_beacon(event):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(
                text='Got beacon event. hwid={}, device_message(hex string)={}'.format(
                    event.beacon.hwid, event.beacon.dm)))

    @handler.add(MemberJoinedEvent)
    def handle_member_joined(event):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(
                text='Got memberJoined event. event={}'.format(
                    event)))

    @handler.add(MemberLeftEvent)
    def handle_member_left(event):
        print(event)
        logging.info("Got memberLeft event")
        # app.logger.info("Got memberLeft event")

    def isUserRegister(self, user_id):
        if user_id in register_man:
            if register_man[user_id]['webflag'] == 1:
                return True
        return False


class StaticPathController(Resource):
    # def __init__(self, *args, **kwargs):
    # print()
    # super.__init__(*args, **kwargs)

    def get(self, path):
        return self.send_static_content(path)

    def send_static_content(path):
        return send_from_directory('static', path)


class RegisterController(Resource):
    # def __init__(self, *args, **kwargs):
    # print()
    # super.__init__(*args, **kwargs)
    @staticmethod
    def post(self):
        # body = request.get_data(as_text=True)
        json_body = request.get_json()
        if json_body is not None and "senderid" in json_body:
            if register_man[json_body['senderid']]['webflag'] == 1:
                print('註冊過了')
            else:
                register_man[json_body['senderid']]['webflag'] = 1
                register_man[json_body['senderid']]['groupname'] = json_body['groupname']
                print(GlobalInMem.updateUser(json_body['senderid'], json_body['groupname']))
            return {"success": 200}
        else:
            return {"fail": "fuck no content"}

    # @routerCache.cached(timeout=50)
    @staticmethod
    def get():
        if request.args.get('flag') == str(1):
            return Response("line 帳號已註冊過!", content_type="application/json; charset=utf-8")
        else:
            return redirect("http://ncsist.wrapoc.tk/registration", code=200)


class RepostMessageToLineBot(Resource):
    def post(self):
        json_body = request.get_json()
        print(json_body)
        return {'success': 200}

    def get(self):
        return {'success': 200}
