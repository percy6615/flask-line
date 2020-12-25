import errno
import logging
import os
import sys
import tempfile
import requests
from flask import request, send_from_directory, Response
from flask_restful import abort
from linebot import (
    LineBotApi, WebhookHandler, WebhookParser
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

from .line_template import buttonRegisterTemplate, flexReportMessageTemlate, flexReportMessageTemplate, \
    flexDispatchDisaster
from .. import globalRegisterUser, FlaskApp, GlobalInMem, globalRegisterGroup, globalMissionData
from ..database.mysql_engine import MySQLs

from ..model.event_handle import FollowEventHandle, JoinEventHandle

channel_secret = os.getenv('channel_secret')
channel_access_token = os.getenv('channel_access_token')

if channel_secret is None or channel_access_token is None:
    print('Specify LINE_CHANNEL_SECRET and LINE_CHANNEL_ACCESS_TOKEN as environment variables.')
    sys.exit(1)
line_bot_api = LineBotApi(channel_access_token)
handler = WebhookHandler(channel_secret)
parser = WebhookParser(channel_secret)
from flask.views import MethodView

line_dropfile = 'line_dropfile'
# static_tmp_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static', 'tmp')
static_tmp_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', line_dropfile)
static_disasterpics_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'images', 'disasterpics')


def isUserRegister(user_id):
    if user_id in globalRegisterUser:
        if globalRegisterUser[user_id]['webflag'] == 1:
            return True
    return False


# function for create tmp dir for download content
def make_static_tmp_dir():
    try:
        os.makedirs(static_tmp_path)
        os.makedirs(static_disasterpics_path)
        print('make_static_tmp_dir')
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(static_tmp_path):
            pass
        else:
            raise


class LineController(MethodView):

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
            # eventreplytoken = json_body['events'][0]['replyToken']
            if eventSourceType == 'user':
                if not isUserRegister(eventSourceUserId):
                    pass
                #     line_bot_api.reply_message(
                #         eventreplytoken,
                #         [TextSendMessage(text="沒註冊本系統，請點選註冊，謝謝。"), buttonRegisterTemplate(eventSourceUserId)])
                #     return
            elif eventSourceType == 'group':
                if not isUserRegister(eventSourceUserId):
                    pass
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
                if not isUserRegister(eventSourceUserId):
                    pass
                    # line_bot_api.reply_message(
                    #     eventreplytoken,
                    #     [TextSendMessage(text="請加入機器人，謝謝。"), buttonRegisterTemplate(eventSourceUserId)])
                    # return

        logging.info("Request body: " + body)
        # handle webhook body
        try:
            # self.middleParser(body, signature)
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
        # url = "https://notify-api.line.me/api/notify"
        # data = {'message': 'We did it!'}
        # headers = {'Authorization': 'Bearer ' + '1rU2omMOA2884DVB6Bx119ESfNoWyrO0bIchGjDrwtK'}
        # r = requests.post(url, data=data, headers=headers)

        return {'success': 200}

    def middleParser(self, body, signature):
        events = parser.parse(body, signature)
        for event in events:
            print(event)
        pass

    @handler.add(MessageEvent, message=TextMessage)
    def handle_text_message(event):
        text = event.message.text
        try:
            if isinstance(event.source, SourceUser):
                if text == 'test':
                    # line_bot_api.reply_message(
                    #     event.reply_token, TextSendMessage(text=wrauri + str(event.source.user_id)))
                    # confirm_template = ConfirmTemplate(text='註冊阿，叫你註冊是沒聽到逆!', actions=[
                    #     URIAction(label='確定', uri=wrauri + str(event.source.user_id)),
                    #     MessageAction(label='取消', text='No!')
                    # ])
                    # template_message = buttonRegisterTemplate(event.source.user_id)
                    # data = {'mission_id': '65b8a1fb-e007-472a-b8d3-e1b2e575d30a', 'base_unit': '第四河川局',
                    #         'reportform_id': 'RP12365854', 'dispatch_unit': '第八河川局', 'mission_status': '進行預佈',
                    #         'pumpcar_num': '8',
                    #         'location': '桃園市中壢區中央西路888號', 'remarks': '氣象局預報大雨即將來襲，請盡速前往進行欲佈作業。', 'sender': 'ad',
                    #         'create_time': '2020/9/21 14:34:22'}
                    # data = {
                    #     'Type': 1, 'OperatorName': '第一河川局', 'Location': '你家', 'Treatment': '-', 'Situation': '-',
                    #     'Depth': '15', 'RecededDate': '-', 'IsReceded': True, 'SourceCode': 1, 'CategoryCode': 1,
                    #     'Time': '2019-07-18 09:00:00',
                    # }
                    data1 = {'disasterFloodingID': 'b76e4d5f-294e-448c-92d2-489ed8e9ae11',
                             'time': '2019-07-18 09:00:00', 'categoryCode': 1, 'sourceCode': 1, 'caseNo': '員林彰基淹水感測',
                             'operatorName': '第四河川局', 'townCode': '1000710', 'situation': '未退水',
                             'location': '彰化縣員林巿靜修路員林基督教醫院旁', 'point': {'latitude': 23.962316, 'longitude': 120.567229},
                             'depth': 35.00841, 'treatment': '', 'isReceded': True,
                             'recededDate': '2019-07-18 09:00:00', 'type': 1, 'photo': []}

                    # line_bot_api.reply_message(event.reply_token, flexReportMessageTemplate(data))
                    line_bot_api.reply_message(event.reply_token, flexDispatchDisaster(data1))
                elif text == 'create':
                    line_bot_api.create_rich_menu()

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
                if text == 'test':
                    # line_bot_api.reply_message(
                    #     event.reply_token, TextSendMessage(text=wrauri + str(event.source.user_id)))
                    # confirm_template = ConfirmTemplate(text='註冊阿，叫你註冊是沒聽到逆!', actions=[
                    #     URIAction(label='確定', uri=wrauri + str(event.source.user_id)),
                    #     MessageAction(label='取消', text='No!')
                    # ])
                    template_message = buttonRegisterTemplate(event.source.user_id)
                    data = {'mission_id': '65b8a1fb-e007-472a-b8d3-e1b2e575d30a', 'base_unit': '第四河川局',
                            'reportform_id': 'RP12365854', 'dispatch_unit': '第八河川局', 'mission_status': '進行預佈',
                            'pumpcar_num': '8',
                            'location': '桃園市中壢區中央西路888號', 'remarks': '氣象局預報大雨即將來襲，請盡速前往進行欲佈作業。', 'sender': 'ad',
                            'create_time': '2020/9/21 14:34:22'}
                    flex_json=  flexReportMessageTemplate(data)
                    if flex_json!=None:
                        line_bot_api.reply_message(event.reply_token, flex_json)

                # profile = line_bot_api.get_group_summary(event.source.group_id)
                # grpid = line_bot_api.get_group_member_profile(user_id=event.source.user_id, group_id=event.source.group_id)
                # count = line_bot_api.get_group_members_count(group_id=event.source.group_id)
                ## ids = line_bot_api.get_group_member_ids(group_id=event.source.group_id)#$$$$$$

                # # line_bot_api.reply_message(
                # #     event.reply_token, [
                # #         TextSendMessage(text="" ),
                # #
                # #     ]
                #  # )
            elif isinstance(event.source, SourceRoom):
                pass
            else:
                line_bot_api.reply_message(
                    event.reply_token,
                    TextSendMessage(text="Bot can't use profile API without user ID"))
        except Exception as e:
            print("handle text" + str(e))

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
            host_url = os.getenv('webhook_baseuri')
            if host_url is None:
                host_url = request.host_url
            url = host_url + "/" + os.path.join('static', line_dropfile, dist_name)
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
            host_url = os.getenv('webhook_baseuri')
            if host_url is None:
                host_url = request.host_url
            url = host_url + "/" + os.path.join('static', line_dropfile, dist_name)
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
        logging.info("Got Unfollow event:" + event.source.user_id)
        # app.logger.info("Got Unfollow event:" + event.source.user_id)

    @handler.add(JoinEvent)
    def handle_join(event):
        summary = line_bot_api.get_group_summary(event.source.group_id)
        joinHandle = JoinEventHandle(event, summary, channel_access_token)
        joinHandle.saveUserEvent("disaster_userlist", joinHandle.to_json()['data'])
        ## profile = line_bot_api.get_group_member_profile(groupidid)
        ## dataEventHandle = DataEventHandle(event, profile)
        ### line_bot_api.get_group_member_ids();
        # line_bot_api.reply_message(
        #     event.reply_token,
        #     TextSendMessage(text='Joined this ' + event.source.type + summary.group_name))

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
        # line_bot_api.reply_message(
        #     event.reply_token,
        #     TextSendMessage(
        #         text='Got memberJoined event. event={}'.format(
        #             event)))
        pass

    @handler.add(MemberLeftEvent)
    def handle_member_left(event):
        pass
        logging.info("Got memberLeft event")
        # app.logger.info("Got memberLeft event")


class LineWebhooksStaticPathController(MethodView):
    # def __init__(self, *args, **kwargs):
    # print()
    # super.__init__(*args, **kwargs)

    def get(self, path):
        # return {"success":path}
        return self.send_static_content(path)

    def send_static_content(self, path):
        return send_from_directory('static', path)


# status action
# webflag webpage register
class LineRegisterController(MethodView):
    # def __init__(self, *args, **kwargs):
    # print()
    # super.__init__(*args, **kwargs)
    def post(self):
        # body = request.get_data(as_text=True)
        json_body = request.get_json()
        if json_body is not None and "senderid" in json_body:
            if globalRegisterUser[json_body['senderid']]['webflag'] == 1:
                print('註冊過了')
            else:
                globalRegisterUser[json_body['senderid']]['webflag'] = 1
                globalRegisterUser[json_body['senderid']]['groupname'] = json_body['groupname']
                print(GlobalInMem().updateDataBaseUser(json_body['senderid'], json_body['groupname']))
            return {"success": 200}
        else:
            return {"fail": "fuck no content"}

    # @routerCache.cached(timeout=50)
    def get(self):
        if request.args.get('flag') == str(1):
            return Response("line 帳號已註冊過!", content_type="application/json; charset=utf-8")
        else:
            return redirect("http://ncsist.wrapoc.tk/registration", code=200)


class LineRepostMessageToLineBotController(MethodView):
    # TODO
    def post(self):
        json_body = request.get_json()
        dispatch_unit = json_body['dispatch_unit']
        groupid = None
        sql = None
        if json_body['mission_id'] != None:
            if json_body['mission_id'] in globalMissionData:
                sql = "UPDATE  wraproject.pump_mission_list set mission_id='" + json_body[
                    'mission_id'] + "', base_unit='" + json_body['base_unit'] + "', report_no='" + json_body[
                          'reportform_id'] + "', dispatch_unit='" + json_body['dispatch_unit'] + "', mission_status='" + \
                      json_body['mission_status'] + "',num='" + json_body['pumpcar_num'] + "', support_location='" + \
                      json_body['location'] + "' ,sender='" + json_body['sender'] + "', create_time='" + json_body[
                          'create_time'] + "' WHERE mission_id='" + json_body['mission_id'] + "'"
                print(sql)

            else:
                globalMissionData.add(json_body['mission_id'])
                sql = "INSERT INTO wraproject.pump_mission_list (mission_id, base_unit, report_no,dispatch_unit,mission_status,num,support_location,sender,create_time) VALUES ('" + \
                      json_body['mission_id'] + "', '" + json_body['base_unit'] + "', '" + json_body[
                          'reportform_id'] + "', '" + \
                      json_body['dispatch_unit'] + "', '" + json_body['mission_status'] + "', '" + json_body[
                          'pumpcar_num'] + "', '" + json_body['location'] + "', '" + json_body['sender'] + "','" + \
                      json_body[
                          'create_time'] + "')"

            val = MySQLs().run(sql)

            for key in globalRegisterGroup.keys():
                if globalRegisterGroup[key]['groupname'] == dispatch_unit:
                    groupid = key
                    break
            if json_body is not None and groupid is not None:
                flex_json = flexReportMessageTemplate(json_body)
                if flex_json != None:
                    line_bot_api.push_message(groupid, flex_json)
            print(json_body)
        return {'success': 200}

    def get(self):
        data = {'mission_id': '65b8a1fb-e007-472a-b8d3-e1b2e575d30a', 'base_unit': '第四河川局',
                'reportform_id': 'RP12365854', 'dispatch_unit': '第八河川局', 'mission_status': '進行預佈',
                'pumpcar_num': '8',
                'location': '桃園市中壢區中央西路888號', 'remarks': '氣象局預報大雨即將來襲，請盡速前往進行欲佈作業。', 'sender': 'ad',
                'create_time': '2020/9/21 14:34:22'}
        # line_bot_api.push_message('Cd2caf66620fdc51721a42d4e395783e2', flexReportMessageTemplate(data))
        return {'success': data}


class LineDispatchDisasterToLineBotController(MethodView):
    # TODO
    def post(self):
        json_body = request.get_json()
        print(json_body)
        # if(type(json_body)=="list"):
        for j in json_body:
            dispatch_unit = j['operatorName']
            groupid = None

            for key in globalRegisterGroup.keys():
                if globalRegisterGroup[key]['groupname'] == dispatch_unit:
                    groupid = key
                    break
            if j is not None and groupid is not None:
                line_bot_api.push_message(groupid, flexDispatchDisaster(j))
        # else:
        #     dispatch_unit = json_body['operatorName']
        #     groupid = None
        #
        #     for key in globalRegisterGroup.keys():
        #         if globalRegisterGroup[key]['groupname'] == dispatch_unit:
        #             groupid = key
        #             break
        #     if json_body is not None and groupid is not None:
        #         line_bot_api.push_message(groupid, flexDispatchDisaster(json_body))

        return {'success': 200}

    def get(self):
        data = {
            'type': 1, 'operatorName': '第三河川局', 'location': '你家', 'treatment': '-', 'situation': '-',
            'depth': '15', 'recededDate': '-', 'isReceded': True, 'sourceCode': 1, 'categoryCode': 1,
            'time': '2019-07-18 09:00:00',
        }
        # line_bot_api.push_message('C51add1d164315ebe4e6c02ba9585fbc6', flexDispatchDisaster(data))

        return {'success': 200}
